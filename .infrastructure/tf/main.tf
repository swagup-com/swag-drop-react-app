terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
  }
}

# Configure the AWS Providers
provider "aws" {
  region = "us-east-2"

  assume_role {
    role_arn = var.terraform_execution_role
  }
}

provider "aws" {
  region = "us-east-1"
  alias = "east_one"
  assume_role {
    role_arn = var.terraform_execution_role
  }
}

locals {
  default_domain                    = var.default_domain
  route53_records                = [local.default_domain]
  cloudfront_aliases             = var.env_name == "prod" ? ["*.${local.default_domain}", local.default_domain, "swagup.com"] : ["*.${local.default_domain}", local.default_domain]
  cert_subject_alternative_names = var.env_name == "prod" ? [ "*.${local.default_domain}", "swagup.com", "*.swagup.com" ] : [ "*.${local.default_domain}" ]
  prod_swagup_domains            = ["*.swagup.com", "swagup.com"]
  default_bucket_origin_id       = "${var.env_name}-marketing-web-fe-bucket"
}

## Certificates & Domains ##
resource "aws_acm_certificate" "certificate" {
  domain_name       = local.default_domain
  validation_method = "DNS"
  provider          = aws.east_one

  subject_alternative_names = local.cert_subject_alternative_names

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "hosted_zone" {
  name         = var.hosted_zone
  private_zone = false
}

resource "aws_route53_record" "record" {
  for_each = toset(local.route53_records)

  allow_overwrite = true
  name            = each.key
  type            = "A"
  zone_id         = data.aws_route53_zone.hosted_zone.zone_id
  provider        = aws.east_one

  alias {
    name                    = aws_cloudfront_distribution.app_distro.domain_name
    zone_id                 = aws_cloudfront_distribution.app_distro.hosted_zone_id
    evaluate_target_health  = false
  }
}

resource "aws_route53_record" "cert-validation-record" {
  for_each = {
    for dvo in aws_acm_certificate.certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
    if contains(local.prod_swagup_domains, dvo.domain_name) != true
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = data.aws_route53_zone.hosted_zone.zone_id
  records         = [each.value.record]
  ttl             = "60"
  allow_overwrite = true
}
resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.certificate.arn
  provider                = aws.east_one
}

## S3 Bucket and Policies ##
data "aws_iam_policy_document" "app_bucket_policy" {
  statement {
    sid = "CloudfrontReadObject"

    actions = [
      "s3:GetObject",
    ]

    principals {
      type        = "AWS"
      identifiers = [ aws_cloudfront_origin_access_identity.mweb_distro_identity.iam_arn ]
    }

    resources = [
      "arn:aws:s3:::${var.env_name}-swagup-marketing-website/*",
    ]

    effect = "Allow"
  }

  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
    ]

    effect = "Allow"

    principals {
      type = "AWS"
      identifiers = [ "${var.spaceport_role_arn}" ]
    }
    resources = [
      "arn:aws:s3:::${var.env_name}-swagup-marketing-website/*",
    ]
  }

  statement {
    actions = [
      "s3:ListBucket",
    ]

    effect = "Allow"

    principals {
      type = "AWS"
      identifiers = [ "${var.spaceport_role_arn}", aws_cloudfront_origin_access_identity.mweb_distro_identity.iam_arn ]
    }
    resources = [
      "arn:aws:s3:::${var.env_name}-swagup-marketing-website",
    ]
  }
}

resource "aws_s3_bucket" "app_s3_bucket" {
  bucket = "${var.env_name}-swagup-marketing-website"
  acl    = "private"
  policy = data.aws_iam_policy_document.app_bucket_policy.json

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }
}

## Cloudfront Distro ##

## S3 Bucket and Policies ##
data "aws_iam_policy_document" "mweb_distro_logging_bucket" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
    ]

    effect = "Allow"

    principals {
      type = "AWS"
      identifiers = [ "${var.spaceport_role_arn}" ]
    }
    resources = [
      "arn:aws:s3:::${var.env_name}-swagup-mweb-distro-logging/*",
    ]
  }

  statement {
    sid = "CloudfrontReadObject"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
    ]

    principals {
      type        = "AWS"
      identifiers = [ "${aws_cloudfront_origin_access_identity.mweb_distro_identity.iam_arn}" ]
    }

    resources = [
      "arn:aws:s3:::${var.env_name}-swagup-mweb-distro-logging/*",
    ]

    effect = "Allow"
  }
}

resource "aws_s3_bucket" "cloudfront_logging_bucket" {
  bucket = "${var.env_name}-swagup-mweb-distro-logging"
  acl    = "public-read"
  policy = data.aws_iam_policy_document.mweb_distro_logging_bucket.json

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }
}

resource "aws_cloudfront_cache_policy" "mweb_distro_cache_policy" {
  name        = "mweb-custom-cf-cache-policy"
  default_ttl = 50
  max_ttl     = 100
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

## Distro
resource "aws_cloudfront_origin_access_identity" "mweb_distro_identity" {
  comment = "Access Identity for MWEB Cloudfront Distro"
}

resource "aws_cloudfront_distribution" "app_distro" {
  origin {
    domain_name = aws_s3_bucket.app_s3_bucket.bucket_regional_domain_name
    origin_id   = local.default_bucket_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.mweb_distro_identity.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = var.customer_portal_domain
    origin_id   = var.customer_portal_domain

    custom_origin_config {
      http_port                     = 80
      https_port                    = 443
      origin_ssl_protocols          = ["TLSv1"]
      origin_protocol_policy        = "match-viewer"
    }
  }

  default_root_object = "index.html"
  enabled             = true
  is_ipv6_enabled     = true

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cloudfront_logging_bucket.bucket_domain_name
  }

  aliases = local.cloudfront_aliases

  custom_error_response {
    error_code         = 404
    response_page_path = "/index.html"
    response_code      = 200
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.default_bucket_origin_id

    cache_policy_id = aws_cloudfront_cache_policy.mweb_distro_cache_policy.id

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  ordered_cache_behavior {
    path_pattern           = "/dashboard*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.customer_portal_domain
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/images/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.customer_portal_domain
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn
    ssl_support_method  = "sni-only"
  }
}

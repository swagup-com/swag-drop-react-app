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

#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# P R O V I D E R S
#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
provider "aws" {
  region = "us-east-2"

  dynamic "assume_role" {
    for_each = var.terraform_execution_role == null ? [] : [1]
    content {
      role_arn = var.terraform_execution_role
    }
  }
}

provider "aws" {
  region = "us-east-1"
  alias = "east_one"
  dynamic "assume_role" {
    for_each = var.terraform_execution_role == null ? [] : [1]
    content {
      role_arn = var.terraform_execution_role
    }
  }
}

#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# L O C A L S
#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=

locals {
  default_domain             = var.default_domain
  terraform_execution_role   = var.terraform_execution_role
  hosted_zone                = var.hosted_zone
  env_name                   = var.env_name
  region                     = var.region
  route53_records            = [local.default_domain]
  service_name               = var.service_name
  default_bucket_origin_id   = "${local.env_name}-swagup-${local.service_name}"
}


#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# D A T A
#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
data "aws_route53_zone" "hosted_zone" {
  name         = local.hosted_zone
  private_zone = false
}

data "aws_iam_policy_document" "app_bucket_policy" {
  statement {
    sid = "CloudfrontReadObject"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]

    principals {
      type        = "AWS"
      identifiers = [ aws_cloudfront_origin_access_identity.service_distro_identity.iam_arn ]
    }

    resources = [
      "arn:aws:s3:::${local.env_name}-swagup-${local.service_name}/*",
    ]

    effect = "Allow"
  } 

  statement {
    actions = [
      "s3:ListBucket",
    ]

    effect = "Allow"

    principals {
      type = "AWS"
      identifiers = [ aws_cloudfront_origin_access_identity.service_distro_identity.iam_arn ]
    }
    resources = [
      "arn:aws:s3:::${local.env_name}-swagup-${local.service_name}",
    ]
  }
}

data "aws_iam_policy_document" "service_distro_logging_bucket" {
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
      identifiers = [ "${aws_cloudfront_origin_access_identity.service_distro_identity.iam_arn}" ]
    }

    resources = [
      "arn:aws:s3:::${local.env_name}-swagup-${local.service_name}-distro-logging/*",
    ]

    effect = "Allow"
  }
}

#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
# R E S O U R C E S
#=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=
resource "aws_acm_certificate" "certificate" {
  domain_name       = local.default_domain
  validation_method = "DNS"
  provider = aws.east_one

  subject_alternative_names = [ "*.${local.default_domain}" ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "record" {
  for_each = toset(local.route53_records)

  allow_overwrite = true
  name            = each.key
  type            = "A"
  zone_id         = data.aws_route53_zone.hosted_zone.zone_id
  provider        = aws

  alias {
    name = aws_cloudfront_distribution.app_distro.domain_name
    zone_id = aws_cloudfront_distribution.app_distro.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cert-validation-record" {
  for_each = {
    for dvo in aws_acm_certificate.certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name    = each.value.name
  type    = each.value.type
  zone_id = data.aws_route53_zone.hosted_zone.zone_id
  records = [each.value.record]
  ttl     = "60"
  allow_overwrite = true
  provider = aws.east_one
}
resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.certificate.arn
  provider = aws.east_one
}

resource "aws_s3_bucket" "app_s3_bucket" {
  bucket = "${local.env_name}-swagup-${local.service_name}"
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

resource "aws_s3_bucket" "cloudfront_logging_bucket" {
  bucket = "${local.env_name}-swagup-${local.service_name}-distro-logging"
  acl    = "public-read"
  policy = data.aws_iam_policy_document.service_distro_logging_bucket.json

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }
}

resource "aws_cloudfront_cache_policy" "service_distro_cache_policy" {
  name        = "${local.service_name}-custom-cf-cache-policy"
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

resource "aws_cloudfront_origin_access_identity" "service_distro_identity" {
  comment = "Access Identity for service Cloudfront Distro"
}

resource "aws_cloudfront_distribution" "app_distro" {
  origin {
    domain_name = aws_s3_bucket.app_s3_bucket.bucket_regional_domain_name
    origin_id   = local.default_bucket_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.service_distro_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cloudfront_logging_bucket.bucket_domain_name
  }

  aliases = [local.default_domain]

  custom_error_response {
    error_code         = 404
    response_page_path = "/index.html"
    response_code      = 200
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.default_bucket_origin_id

    cache_policy_id = aws_cloudfront_cache_policy.service_distro_cache_policy.id

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert_validation.certificate_arn
    ssl_support_method = "sni-only"
  }
}

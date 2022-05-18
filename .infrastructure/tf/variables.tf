variable "region" {
    type = string
    default = "us-east-2"
}
variable "terraform_execution_role" {
    type = string
    default = null
}

variable "default_domain" {
  type = string
}

variable "hosted_zone" {
  type = string
}

variable "env_name" {
  type = string
}

variable "service_name" {
  type = string
  default = "swagdrop-ui"
}
variable "terraform_execution_role" {
    type = string
    default = null
}

variable "spaceport_role_arn" {
    type = string
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

variable "customer_portal_domain" {
  type = string
}

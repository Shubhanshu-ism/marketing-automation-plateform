# variables.tf

variable "aws_region" {
  description = "The AWS region to deploy the infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "db_name" {
  description = "The name of the PostgreSQL database."
  type        = string
  default     = "marketing_automation"
}

variable "db_user" {
  description = "The username for the PostgreSQL database."
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "The password for the PostgreSQL database."
  type        = string
  sensitive   = true
}

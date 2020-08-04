terraform {
  required_version = ">=0.12.8"
  backend "s3" {
    encrypt        = true
    bucket         = "anime-quiz-state-bucket"
    key            = "terraform.tfstate"
    dynamodb_table = "anime-quiz-state-table"
    region         = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws-region
}

module "state-management" {
  source = "./terraform/state-management"
}

provider "aws" {
  region = var.aws-region
}

module "state-management" {
  source = "./terraform/state-management"
}

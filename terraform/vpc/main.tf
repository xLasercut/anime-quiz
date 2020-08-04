resource "aws_vpc" "aq-vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "aq-subnet" {
  cidr_block = ""
  vpc_id = aws_vpc.aq-vpc.id
}

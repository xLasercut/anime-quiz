resource "aws_s3_bucket" "tf-state-bucket" {
  bucket = "anime-quiz-state-bucket"
  acl    = "private"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "tf-state-table" {
  name = "anime-quiz-state-table"
  hash_key = "LockID"
  read_capacity = 20
  write_capacity = 20

  attribute {
    name = "LockID"
    type = "S"
  }
}

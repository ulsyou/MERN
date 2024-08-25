provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1a"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    ec2  = "http://localhost:4566"
    s3 = "http://s3.localhost.localstack.cloud:4566"
  }
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "webkidshop-frontend-bucket"
}

resource "aws_s3_bucket_public_access_block" "public" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls   = false
  block_public_policy = false
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  availability_zone = "us-east-1a"
}

resource "aws_instance" "backend_instance" {
  ami           = "ami-12345678"  # Sử dụng một AMI ID giả
  instance_type = "t2.micro"
  subnet_id     = data.aws_subnet.default.id
  tags = {
    Name = "webkidshop-backend"
  }
  user_data = base64encode(file("${path.module}/user-data.sh"))
}

output "backend_instance_id" {
  value = aws_instance.backend_instance.id
}

output "backend_instance_private_ip" {
  value = aws_instance.backend_instance.private_ip
}

output "vpc_id" {
  value = data.aws_vpc.default.id
}

output "subnet_id" {
  value = data.aws_subnet.default.id
}

output "s3_bucket_id" {
  value = aws_s3_bucket.frontend_bucket.id
}

provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    s3  = "http://localhost:4566"
    ec2 = "http://localhost:4566"
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

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_instance" "backend_instance" {
  ami           = "ami-12345678" 
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.main.id

  tags = {
    Name = "webkidshop-backend"
  }
  
resource "aws_instance" "backend_instance" {
  ami           = "ami-0c55b159cbfafe1f0"  
  instance_type = "t2.micro"

  tags = {
    Name = "webkidshop-backend"
  }

  user_data = file("${path.module}/user-data.sh")
}

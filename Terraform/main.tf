provider "aws" {
  access_key                  = "mock_access_key"
  secret_key                  = "mock_secret_key"
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
  
  user_data = <<-EOF
              #!/bin/bash
              cd /home/ubuntu
              git clone https://github.com/ulsyou/MERN.git
              cd MERN/WebKidShop_BE
              npm install
              npm start
              EOF
}

provider "aws" {
  access_key = "mock_access_key"
  secret_key = "mock_secret_key"
  region     = "us-east-1"
  s3_use_path_style = true
  skip_credentials_validation = true
  skip_metadata_api_check = true
  endpoints {
    s3 = "http://localhost:4566"
    ec2 = "http://localhost:4566"
  }
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "webkidshop-frontend-bucket"
}

resource "aws_instance" "backend_instance" {
  ami           = "ami-0c55b159cbfafe1f0"  
  instance_type = "t2.micro"

  tags = {
    Name = "webkidshop-backend"
  }
  
  user_data = <<-EOF
              #!/bin/bash
              cd /home/ubuntu
              git clone https://github.com/ulsyou/MERN.git
              cd WebKidShop_BE
              npm install
              npm start
              EOF
}

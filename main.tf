provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  endpoints {
    apigateway     = "${var.localstack_url}"
    cloudformation = "${var.localstack_url}"
    cloudwatch     = "${var.localstack_url}"
    dynamodb       = "${var.localstack_url}"
    ec2            = "${var.localstack_url}"
    es             = "${var.localstack_url}"
    firehose       = "${var.localstack_url}"
    iam            = "${var.localstack_url}"
    kinesis        = "${var.localstack_url}"
    lambda         = "${var.localstack_url}"
    route53        = "${var.localstack_url}"
    redshift       = "${var.localstack_url}"
    s3             = "${var.localstack_url}"
    secretsmanager = "${var.localstack_url}"
    ses            = "${var.localstack_url}"
    sns            = "${var.localstack_url}"
    sqs            = "${var.localstack_url}"
    ssm            = "${var.localstack_url}"
    stepfunctions  = "${var.localstack_url}"
    sts            = "${var.localstack_url}"
  }
}

variable "localstack_url" {
  default = "http://localhost:4566"
}

resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "my-bucket"
}

resource "aws_instance" "backend_instance" {
  ami           = "ami-12345678" 
  instance_type = "t2.micro"

  tags = {
    Name = "WebKidShop-Backend"
  }

  user_data = <<-EOF
              #!/bin/bash
              cd /home/ubuntu/WebKidShop_BE
              npm install
              npm start
              EOF
}

resource "aws_security_group" "backend_sg" {
  name        = "allow_http"
  description = "Allow inbound HTTP traffic"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "backend_instance_public_ip" {
  value = aws_instance.backend_instance.public_ip
}

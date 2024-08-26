provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  endpoints {
    ec2 = "http://localhost:4566"
    s3  = "http://localhost:4566"
  }
}

resource "aws_vpc" "default" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_subnet" "default" {
  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.default.id
}

resource "aws_route_table" "example" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.default.id
  route_table_id = aws_route_table.example.id
}

resource "aws_eip" "frontend_instance" {
  instance = aws_instance.frontend_instance.id
  domain   = "vpc"
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow inbound web traffic"
  vpc_id      = aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
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

resource "aws_instance" "backend_instance" {
  ami                    = "ami-12345678"  
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.allow_web.id]
  tags = {
    Name = "webkidshop-backend"
  }
  user_data = base64encode(file("${path.module}/user-data.sh"))
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_instance" "frontend_instance" {
  ami                    = "ami-12345678"  
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.allow_web.id]
  tags = {
    Name = "webkidshop-frontend"
  }
  user_data = base64encode(file("${path.module}/user-data.sh"))
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_s3_bucket" "temp_frontend_bucket" {
  bucket = "temp-frontend-bucket"
}

resource "aws_s3_bucket" "temp_backend_bucket" {
  bucket = "temp-backend-bucket"
}

output "backend_instance_id" {
  value = aws_instance.backend_instance.id
}

output "backend_instance_private_ip" {
  value = aws_instance.backend_instance.private_ip
}

output "frontend_instance_id" {
  value = aws_instance.frontend_instance.id
}

output "frontend_instance_private_ip" {
  value = aws_instance.frontend_instance.private_ip
}

output "vpc_id" {
  value = aws_vpc.default.id
}

output "subnet_id" {
  value = aws_subnet.default.id
}

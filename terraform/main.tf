# main.tf

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# --------------------------------------------------------------------------------------------------
# Networking
# --------------------------------------------------------------------------------------------------

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "private-subnet-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "private-subnet-b"
  }
}

# --------------------------------------------------------------------------------------------------
# Database (RDS for PostgreSQL)
# --------------------------------------------------------------------------------------------------

resource "aws_db_subnet_group" "default" {
  name       = "main-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "Main DB subnet group"
  }
}

resource "aws_db_instance" "default" {
  identifier           = "main-db"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14"
  instance_class       = "db.t3.micro"
  db_name              = var.db_name
  username             = var.db_user
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.default.name
  skip_final_snapshot  = true
}

# --------------------------------------------------------------------------------------------------
# Cache (ElastiCache for Redis)
# --------------------------------------------------------------------------------------------------

resource "aws_elasticache_subnet_group" "default" {
  name       = "main-cache-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_elasticache_cluster" "default" {
  cluster_id           = "main-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.default.name
}

# --------------------------------------------------------------------------------------------------
# API Service (App Runner)
# --------------------------------------------------------------------------------------------------

resource "aws_apprunner_service" "api" {
  service_name = "api-service"

  source_configuration {
    image_repository {
      image_identifier      = "public.ecr.aws/aws-containers/hello-app-runner:latest" # Placeholder image
      image_repository_type = "ECR_PUBLIC"
    }
  }
}

# --------------------------------------------------------------------------------------------------
# Dashboard Service (App Runner)
# --------------------------------------------------------------------------------------------------

resource "aws_apprunner_service" "dashboard" {
  service_name = "dashboard-service"

  source_configuration {
    image_repository {
      image_identifier      = "public.ecr.aws/aws-containers/hello-app-runner:latest" # Placeholder image
      image_repository_type = "ECR_PUBLIC"
    }
  }
}

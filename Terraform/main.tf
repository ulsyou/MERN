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

provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "webkidshop" {
  metadata {
    name = "webkidshop"
  }
}

resource "kubernetes_deployment" "backend_deployment" {
  metadata {
    name      = "webkidshop-backend"
    namespace = kubernetes_namespace.webkidshop.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "webkidshop-backend"
      }
    }
    template {
      metadata {
        labels = {
          app = "webkidshop-backend"
        }
      }
      spec {
        container {
          name  = "backend"
          image = "webkidshop-backend:latest"
        }
      }
    }
  }
}

resource "kubernetes_deployment" "frontend_deployment" {
  metadata {
    name      = "webkidshop-frontend"
    namespace = kubernetes_namespace.webkidshop.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "webkidshop-frontend"
      }
    }
    template {
      metadata {
        labels = {
          app = "webkidshop-frontend"
        }
      }
      spec {
        container {
          name  = "frontend"
          image = "webkidshop-frontend:latest"
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_service" {
  metadata {
    name      = "webkidshop-backend-service"
    namespace = kubernetes_namespace.webkidshop.metadata[0].name
  }
  spec {
    selector = {
      app = "webkidshop-backend"
    }
    port {
      port        = 80
      target_port = 5000
      protocol    = "TCP"
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "webkidshop-frontend-service"
    namespace = kubernetes_namespace.webkidshop.metadata[0].name
  }
  spec {
    selector = {
      app = "webkidshop-frontend"
    }
    port {
      port        = 80
      target_port = 3000
      protocol    = "TCP"
    }
    type = "LoadBalancer"
  }
}

export const test = {
  "METADATA": {
    "topic": "DevOps",
    "generalTip": "Focus on understanding the 'why' behind each tool and practice. DevOps is about culture and automation, not just tools. Hands-on practice is crucial."
  },
  "projects": [
    {
      "Project_id": 0,
      "batch": 1,
      "title": "Project 1: Setting up a Basic Development Environment with Docker",
      "description": "Create a simple Dockerfile to containerize a basic 'Hello, World!' application (e.g., Python, Node.js). Learn to build, run, and manage Docker containers. This project focuses on understanding containerization fundamentals.",
      "level": "Beginner",
      "learningObjectives": [
        "Understand containerization concepts.",
        "Write a basic Dockerfile.",
        "Build and run Docker images.",
        "Manage Docker containers (start, stop, remove).",
        "Learn basic Docker commands."
      ]
    },
    {
      "Project_id": 1,
      "batch": 1,
      "title": "Project 2: Automating Builds with Docker Compose",
      "description": "Extend the previous project by using Docker Compose to define and manage multi-container applications.  Create a simple web application with a database (e.g., Flask + Redis) and orchestrate them using Docker Compose.",
      "level": "Beginner",
      "learningObjectives": [
        "Understand Docker Compose and its benefits.",
        "Write a `docker-compose.yml` file.",
        "Define services, networks, and volumes in Docker Compose.",
        "Orchestrate multi-container applications.",
        "Learn basic Docker Compose commands."
      ]
    },
    {
      "Project_id": 2,
      "batch": 1,
      "title": "Project 3: Introduction to Infrastructure as Code (IaC) with Terraform",
      "description": "Provision a simple cloud resource (e.g., an AWS EC2 instance or Azure Virtual Machine) using Terraform.  Focus on defining infrastructure in code and understanding Terraform's workflow.",
      "level": "Intermediate",
      "learningObjectives": [
        "Understand Infrastructure as Code (IaC) principles.",
        "Install and configure Terraform.",
        "Write basic Terraform configuration files.",
        "Provision cloud resources using Terraform.",
        "Understand Terraform state management."
      ]
    },
    {
      "Project_id": 3,
      "batch": 1,
      "title": "Project 4: CI/CD Pipeline with Jenkins and Git",
      "description": "Set up a basic CI/CD pipeline using Jenkins to automatically build, test, and deploy the Dockerized application from Project 2 whenever changes are pushed to a Git repository (e.g., GitHub).",
      "level": "Intermediate",
      "learningObjectives": [
        "Understand CI/CD concepts and pipelines.",
        "Install and configure Jenkins.",
        "Integrate Jenkins with Git.",
        "Create Jenkins jobs to automate build, test, and deployment processes.",
        "Configure webhooks for automated triggers."
      ]
    },
    {
      "Project_id": 4,
      "batch": 2,
      "title": "Project 5: Advanced Docker Orchestration with Kubernetes (Minikube)",
      "description": "Deploy the Dockerized application from Project 2 to a local Kubernetes cluster using Minikube.  Learn about Kubernetes deployments, services, and pods.",
      "level": "Intermediate",
      "learningObjectives": [
        "Understand Kubernetes architecture and concepts.",
        "Install and configure Minikube.",
        "Deploy applications to Kubernetes using deployments and services.",
        "Manage pods and deployments.",
        "Use `kubectl` to interact with the Kubernetes cluster."
      ]
    },
    {
      "Project_id": 5,
      "batch": 2,
      "title": "Project 6: Monitoring and Logging with Prometheus and Grafana",
      "description": "Integrate Prometheus and Grafana to monitor the Kubernetes cluster and the deployed application from Project 5.  Set up basic dashboards to visualize key metrics.",
      "level": "Intermediate",
      "learningObjectives": [
        "Understand monitoring and logging principles.",
        "Install and configure Prometheus and Grafana.",
        "Configure Prometheus to scrape metrics from Kubernetes.",
        "Create Grafana dashboards to visualize metrics.",
        "Learn about common Kubernetes metrics."
      ]
    },
    {
      "Project_id": 6,
      "batch": 2,
      "title": "Project 7: Automating Infrastructure Changes with Terraform Modules",
      "description": "Refactor the Terraform code from Project 3 into reusable modules.  Create a module for provisioning EC2 instances and use it to provision multiple instances with different configurations.",
      "level": "Advanced",
      "learningObjectives": [
        "Understand Terraform modules and their benefits.",
        "Create reusable Terraform modules.",
        "Use modules to provision multiple resources with different configurations.",
        "Manage module versions and dependencies."
      ]
    },
    {
      "Project_id": 7,
      "batch": 2,
      "title": "Project 8: Advanced CI/CD with Jenkins and Infrastructure Testing",
      "description": "Enhance the CI/CD pipeline from Project 4 to include infrastructure testing using tools like InSpec or Serverspec.  Automate the verification of infrastructure configuration and security policies.",
      "level": "Advanced",
      "learningObjectives": [
        "Understand infrastructure testing principles.",
        "Integrate infrastructure testing tools into the CI/CD pipeline.",
        "Write tests to verify infrastructure configuration and security policies.",
        "Automate infrastructure testing as part of the deployment process."
      ]
    },
    {
      "Project_id": 8,
      "batch": 3,
      "title": "Project 9: Kubernetes Autoscaling and Resource Management",
      "description": "Configure horizontal pod autoscaling (HPA) for the application deployed in Kubernetes from Project 5.  Set resource requests and limits for containers to optimize resource utilization.",
      "level": "Advanced",
      "learningObjectives": [
        "Understand Kubernetes autoscaling concepts.",
        "Configure horizontal pod autoscaling (HPA).",
        "Set resource requests and limits for containers.",
        "Monitor resource utilization and adjust autoscaling parameters."
      ]
    },
    {
      "Project_id": 9,
      "batch": 3,
      "title": "Project 10: Implementing Blue/Green Deployments with Kubernetes",
      "description": "Implement a blue/green deployment strategy for the application in Kubernetes to minimize downtime during deployments.  Use Kubernetes services and deployments to manage traffic switching.",
      "level": "Advanced",
      "learningObjectives": [
        "Understand blue/green deployment strategies.",
        "Implement blue/green deployments in Kubernetes.",
        "Use Kubernetes services to manage traffic switching.",
        "Monitor deployment health and rollback if necessary."
      ]
    },
    {
      "Project_id": 10,
      "batch": 3,
      "title": "Project 11: Security Hardening with HashiCorp Vault",
      "description": "Integrate HashiCorp Vault to securely manage secrets (e.g., database passwords, API keys) for the application deployed in Kubernetes.  Learn about Vault's authentication and authorization mechanisms.",
      "level": "Expert",
      "learningObjectives": [
        "Understand secrets management principles.",
        "Install and configure HashiCorp Vault.",
        "Integrate Vault with Kubernetes.",
        "Securely store and retrieve secrets from Vault.",
        "Implement authentication and authorization policies in Vault."
      ]
    },
    {
      "Project_id": 11,
      "batch": 3,
      "title": "Project 12: Building a Complete DevOps Pipeline for a Microservices Architecture",
      "description": "Design and implement a complete DevOps pipeline for a microservices application, encompassing all the concepts learned in the previous projects.  This includes infrastructure provisioning, CI/CD, monitoring, logging, and security.",
      "level": "Expert",
      "learningObjectives": [
        "Apply all the learned DevOps concepts to a real-world microservices application.",
        "Design and implement a complete DevOps pipeline.",
        "Automate all aspects of the application lifecycle.",
        "Optimize the pipeline for performance, reliability, and security."
      ]
    }
  ]
}
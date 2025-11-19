# Terraform for Marketing Automation Platform

This directory contains the Terraform scripts to provision the necessary AWS infrastructure for the Marketing Automation Platform.

## Prerequisites

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) installed on your local machine.
- AWS account and configured credentials. You can configure your credentials by following the [AWS CLI configuration guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

## Infrastructure

The Terraform scripts will provision the following resources:

- **VPC:** A new VPC with two private subnets.
- **RDS for PostgreSQL:** A `db.t3.micro` instance for the database.
- **ElastiCache for Redis:** A `cache.t2.micro` instance for the job queue.
- **App Runner:** Two App Runner services, one for the API and one for the dashboard.

## How to Use

1.  **Initialize Terraform:**
    Navigate to this directory and run the `init` command to initialize the Terraform workspace.
    ```bash
    cd terraform
    terraform init
    ```

2.  **Create a `terraform.tfvars` file:**
    Create a file named `terraform.tfvars` in this directory and add the following content:
    ```hcl
    aws_region  = "us-east-1"
    db_password = "your-secure-password"
    ```
    Replace `"your-secure-password"` with a strong password for your database.

3.  **Plan the deployment:**
    Run the `plan` command to see what resources will be created.
    ```bash
    terraform plan
    ```

4.  **Apply the changes:**
    If the plan looks correct, apply the changes to provision the infrastructure.
    ```bash
    terraform apply
    ```

5.  **Destroy the infrastructure:**
    When you are done, you can destroy all the created resources to avoid incurring further costs.
    ```bash
    terraform destroy
    ```

**Note:** The App Runner services are configured with placeholder Docker images. To deploy the actual applications, you will need to build and push your Docker images to a container registry (like Amazon ECR) and update the `image_identifier` in `main.tf`. This process will be automated in the CI/CD pipeline.

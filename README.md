# squareboat-media-service AWS ECR Setup Guide

This document outlines the steps to build, tag, and push the squareboat-media-service Docker image to AWS ECR (Elastic Container Registry).

## Prerequisites

- AWS CLI installed and configured
- Docker installed
- Access to your AWS account
- Valid AWS credentials with permissions to create and push to ECR repositories

## Setup Instructions

### 1. Create an AWS ECR Repository

First, create an ECR repository in your AWS account:

```bash
aws ecr create-repository --repository-name squareboat-media-service --region us-east-1
```

Take note of the repository URI provided in the response. It will look something like:
`{account-id}.dkr.ecr.us-east-1.amazonaws.com/squareboat-media-service`

### 2. Authenticate Docker with AWS ECR

Run the following command to authenticate your Docker client with your AWS ECR registry:

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {your-repository-uri}
```

> **Note:** If you receive an error, ensure that you have the latest versions of both AWS CLI and Docker installed.

### 3. Build the Docker Image

Build your Docker image using:

```bash
docker build -t squareboat-media-service .
```

> Skip this step if your image has already been built.

### 4. Tag the Docker Image

Tag your image with the ECR repository URI:

```bash
docker tag squareboat-media-service:latest {your-repository-uri}:latest
```

### 5. Push the Image to AWS ECR

Push your tagged image to the ECR repository:

```bash
docker push {your-repository-uri}:latest
```

### 6. Update Serverless Configuration

After successfully pushing the image, update the URI and tag in your serverless configuration file:

Open `apps/media-service/serverless.yml` and update the image reference to:

```yaml
# Example location in serverless.yml
functions:
  mediaService:
    image: {your-repository-uri}:latest
```

## Troubleshooting

- Ensure your AWS CLI is properly configured with the correct credentials
- Verify Docker is running correctly on your system
- Check that you have the necessary permissions to push to the ECR repository
- If you encounter authentication issues, try running the authentication command again

## Next Steps

Once the image is successfully pushed to ECR and your serverless.yml is updated, you can deploy your service using the appropriate deployment commands for your infrastructure.
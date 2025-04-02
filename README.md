1. Create a AWS ECR Repository and copy the URI

2. Retrieve an authentication token and authenticate your Docker client to your registry. Use the AWS CLI:
   `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin uri`

   > Note: if you receive an error using the AWS CLI, make sure that you have the latest version of the AWS CLI and Docker installed.

3. Build your Docker image using the following command. For information on building a Docker file from scratch, see the instructions here . You can skip this step if your image has already been built:

`docker build -t qyubic-media-service .`

4. After the build is completed, tag your image so you can push the image to this repository:

`docker tag qyubic-media-service:latest uri:latest`

5. Run the following command to push this image to your newly created AWS repository:
   `docker push uri:latest`

6. Now Update the uri and tag in the apps/media-service/serverless.yml example:- uri:tag

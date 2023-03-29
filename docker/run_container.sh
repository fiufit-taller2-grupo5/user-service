# This runs the docker container with the image user-service
# -it is used to run the container in interactive mode
# -d is used to run the container in detached mode (in the background)
# -p is used to map the port 7878 of the container to the port 7878 of the host
# --name is used to name the container user-service (the second user-service is the name of the image)
docker run -it -d -p 7878:7878 --name user-service user-service

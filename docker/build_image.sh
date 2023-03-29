# --no-cache is used to force a rebuild of the image
# --progress=plain is used to show the build progress in the terminal
# -t is used to tag the image with the name user-service (same as using --tag param)
docker build --no-cache --progress=plain -t user-service .

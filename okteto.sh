#!/bin/bash

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Please provide an argument (build or deploy)."
    exit 1
fi

# Check the argument value and execute the corresponding command
if [ $1 == "build" ] || [ $1 == "b" ]; then
    okteto build -t okteto.dev/user-service:latest --namespace prod2-szwtomas
elif [ $1 == "deploy" ] || [ $1 == "d" ]; then
    okteto deploy --namespace prod2-szwtomas
else
    echo "Invalid argument. Please use either 'build' or 'deploy'."
    exit 1
fi

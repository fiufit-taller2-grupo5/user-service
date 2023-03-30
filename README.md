# User Service

Microservice for managing users.

## Running the project as a dependency for other service

If you need this as a dependency, you can run the script `build_image.sh` and then `run_container.sh` to create the image and run the container respecively. It will run on port 7878. (You can run it manually using a different port if you need to).

## Running this project locally for developing

You need node 18 as a requirement. First, run `npm install` in the project's root directory. Once all dependencies are installed, run `npm run dev` for running the project in dev mode. You can change environment variables in the `.env` file as needed.

## Running Tests

For running tests, first install dependencies as instructed in the previous section. Then, just run `npm run tests`. This will run all tests and collect code coverage for the files _with_ test files. If you want to see code coverage for the whole project, run `npm run test:coverage`, and the generated report will also take into account classes without test files.

Good Luck!

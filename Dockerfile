# We start from a node 18 image using alpine
FROM node:18-alpine

# The workdir inside the container where the following commands will be executed
WORKDIR /app

# Copy the package.json and package-lock.json files into the workdir
COPY package*.json ./

# Installs typescript globally inside the container
RUN npm i -g typescript

# Installs dependencies
RUN npm install

RUN npx prisma generate

# Copies the rest of the files into the workdir
COPY . .

# Builds the app
RUN npm run build

# Exposes the port 7878
EXPOSE 7878

# Runs the app
CMD [ "npm", "start" ]

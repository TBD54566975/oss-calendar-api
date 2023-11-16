# Use an official Node runtime as a parent image
FROM node:20-alpine3.17

# Set the working directory in the container
WORKDIR /workspace/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "app.js" ]

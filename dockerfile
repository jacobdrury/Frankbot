# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file
COPY .env .env

# Build the TypeScript code
RUN npm run build

# Define the command to run the application
CMD ["npm", "start"]

# Use a Node.js base image (adjust the version as needed)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install   
RUN npm install

# Copy the rest of your project files
COPY . .

# Expose the port your application will listen on (replace 3000 with your actual port)
EXPOSE 8999

# Define the command to start your application
CMD ["npm", "start"]
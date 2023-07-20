
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY package.json package-lock.jso[n] ./

# Install the application dependencies
RUN npm install

COPY . .

EXPOSE 3006

# Define the entry point for the container
CMD ["npm", "start"]
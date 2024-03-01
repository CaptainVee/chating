# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Expose port 3000 (or any other port your React app is configured to use)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]


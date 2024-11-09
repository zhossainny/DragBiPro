# Use Node.js 16.17.0 as base image
FROM node:16.17.0

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 (assuming your React app runs on port 3000)
EXPOSE 3500

# Start the React app
CMD ["npm", "start"]

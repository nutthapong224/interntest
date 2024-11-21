# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app for production
RUN npm run build

# Expose the port that Vite will run on
EXPOSE 80

# Start the Vite server in preview (production) mode
CMD ["npm", "run", "preview"]

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose the app port
EXPOSE 5000

# Set environment to development
ENV NODE_ENV=development

# Run the app
CMD ["node", "server.js"]

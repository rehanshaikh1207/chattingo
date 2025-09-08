# Multi-stage Docker build for React frontend
# Stage 1: Node.js base image for building dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build React application
FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# STAGE 3: SERVE WITH NGINX
# Use Nginx Alpine for serving static files (very small image)
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
# Copy built React app from builder stage to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (HTTP)
EXPOSE 80

# Start Nginx server
# daemon off keeps Nginx running in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]

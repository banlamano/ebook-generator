# Multi-stage build for production

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine AS backend
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend files
COPY server/ ./server/
COPY .env.example ./.env

# Copy built frontend
COPY --from=frontend-build /app/client/build ./client/build

# Create necessary directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "server/index.js"]

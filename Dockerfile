# Multi-stage build for production

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true
ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine AS backend
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

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

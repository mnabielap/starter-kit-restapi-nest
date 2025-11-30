# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy node_modules and built assets from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Create directory for media uploads (for volume mapping)
RUN mkdir -p uploads

# Set environment to production
ENV NODE_ENV=production

# Expose the port defined in .env.docker
EXPOSE 5005

# Define Entrypoint
ENTRYPOINT ["./entrypoint.sh"]
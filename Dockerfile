# Stage 1: Build stage
FROM oven/bun:1.2-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json bun.lock ./

# Install dependencies strictly matching the lockfile
RUN bun install

# Copy the rest of the application files
COPY . .

# Build both frontend and backend
RUN bun run build

# Stage 2: Serve stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and needed runtime packages
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.cjs"]

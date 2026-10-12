# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better cache layer)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build Vite frontend & Express bundle
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/database ./database

EXPOSE 3000

CMD ["node", "dist/server.cjs"]

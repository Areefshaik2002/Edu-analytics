# Base image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for building TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client and build the TypeScript application
RUN npx prisma generate
RUN npm run build

# Production runtime stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built code and prisma files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5001

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

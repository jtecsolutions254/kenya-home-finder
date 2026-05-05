# -------- Stage 1: Build --------
FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /app

# Copy only package files first
COPY package.json package-lock.json ./

# Install exact versions
RUN npm ci

# Copy rest of the project
COPY . .

# Build app
RUN npm run build


# -------- Stage 2: Serve --------
FROM nginx:1.25.3-alpine3.18

# Remove default files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
FROM node:22-alpine AS deps

WORKDIR /app

# Install dependencies needed for some native packages
RUN apk add --no-cache libc6-compat

# Copy lock files first (better layer caching)
COPY package.json package-lock.json* ./

# Install only production deps for smaller image
RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

# Reuse installed node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variable
ARG NEXT_PUBLIC_API_URL_DEV
ENV NEXT_PUBLIC_API_URL_DEV=${NEXT_PUBLIC_API_URL_DEV}
ENV NODE_ENV=production

# Build Next.js (must use output: "standalone" in next.config.js)
RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -S nodejs -g 1001 \
  && adduser -S nextjs -u 1001 -G nodejs

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

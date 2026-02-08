# Stage 1: Dependencies
FROM node:22-alpine AS deps 
RUN apk add --no-cache libc6-compat 
WORKDIR /app 
COPY package.json package-lock.json ./  
RUN npm ci 

# Stage 2: Builder 
FROM node:22-alpine AS builder 
WORKDIR /app 
COPY --from=deps /app/node_modules ./node_modules 
COPY . .

# Add ALL 4 environment variables here
ARG NEXT_PUBLIC_API_URL_DEV

ENV NEXT_PUBLIC_API_URL_DEV=${NEXT_PUBLIC_API_URL_DEV}

RUN npm run build 

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs 
RUN adduser --system --uid 1001 nextjs 

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# ALSO add them here for runtime
ENV NEXT_PUBLIC_API_URL_DEV=${NEXT_PUBLIC_API_URL_DEV}

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

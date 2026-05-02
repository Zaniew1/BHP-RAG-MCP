# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

# 3. Build stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# generate prisma client
RUN npx prisma generate

# build TS -> JS
RUN npm run build

# 4. Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=dev

# only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# prisma client runtime
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]
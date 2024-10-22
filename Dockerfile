# Stage 1: Build react static assets
FROM node:20-alpine as base
LABEL author="Dusan"
WORKDIR /app
ENV NODE_ENV=$NODE_ENV

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm install

# stage 2
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Stage 3
FROM node:20-alpine as production 
RUN npm i -g npm

EXPOSE 80
ENV PORT 80
WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/

RUN npm install --omit=optional
RUN npm update browserslist
# RUN npm run next telemetry disable

# need to install linux specific swc builds
RUN npm install -D @swc/cli @swc/core
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD [ "npm", "start" ]

# Stage 4
FROM node:20-alpine as development 
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/
COPY --from=deps /app/node_modules ./node_modules

COPY . .
EXPOSE 3000 443

CMD ["npm", "run", "dev"]

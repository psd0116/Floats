FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install || npm install

COPY . .

FROM base AS dev
EXPOSE 4000
CMD ["npm", "run", "dev"]

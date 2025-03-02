FROM node:lts-alpine3.20 AS base
WORKDIR /home/node/app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /home/node/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /home/node/app
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .
RUN pnpm run build
ENV NODE_ENV production
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner
WORKDIR /home/node/app
RUN mkdir -p /home/node/app/logs
COPY --from=builder /home/node/app/package.json ./
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/.env ./.env
RUN mkdir -p logs && chown -R node:node logs
USER node
CMD ["node", "dist/main.js"]
# Build
FROM node:22-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm store prune && rm -rf /root/.cache

# Deploy backend
FROM node:22-alpine AS backend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY --chown=node:node --from=build /usr/src/app/packages/be .
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
ENV NODE_ENV="production"
CMD [ "pnpm", "start" ]

# frontend
FROM georgjung/nginx-brotli:latest AS frontend
COPY --from=build /usr/src/app/packages/fe/dist /usr/share/nginx/html

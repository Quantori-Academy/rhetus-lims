# Build
FROM node:22-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN pnpm install --frozen-lockfile

ENV NODE_ENV="production"

RUN pnpm run build

# Export Frontend Artifacts
FROM alpine AS frontend-export

RUN mkdir -p /usr/share/nginx/html

COPY --from=build /usr/src/app/packages/fe/dist /usr/share/nginx/html

# Deploy backend
FROM node:22-alpine AS backend

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --chown=node:node --from=build /usr/src/app/packages/be .
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]

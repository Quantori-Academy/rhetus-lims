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

# Deploy Frontend
FROM georgjung/nginx-brotli:latest AS fe

COPY .github/workflows/nginx.conf /etc/nginx/nginx.conf
COPY --chown=node:node --from=build /usr/src/app/packages/fe/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# Deploy backend
FROM node:22-alpine AS be

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --chown=node:node --from=build /usr/src/app/packages/be .
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

ENV NODE_ENV="production"

CMD [ "pnpm", "start" ]

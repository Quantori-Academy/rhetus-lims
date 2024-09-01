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
FROM nginx:alpine AS fe

COPY --chown=node:node --from=build /usr/src/app/packages/fe/dist /usr/share/nginx/html

EXPOSE 80

# Deploy backend
FROM node:22-alpine AS be

COPY --chown=node:node --from=build /usr/src/app/packages/be ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/packages/be/node_modules ./node_modules

CMD [ "node", "dist/src/server.js" ]

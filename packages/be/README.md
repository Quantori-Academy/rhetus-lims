# Rhetus BE

_See the [full doc](../README.md) first._

- [Rhetus BE](#rhetus-be)
  - [Project Structure](#project-structure)
  - [Style Guide](#style-guide)
    - [Naming](#naming)
  - [Tools](#tools)
  - [Scripts](#scripts)

## Project Structure

We use **fastify** as the server.

- [`src/`](./src): app entry point.
  - [`app.js`](./src/app.js): application instance.
  - [`server.js`](./src/server.js): server file.
- [`src/lib/`](./src/lib): common parts of app.
  - [`plugins/`](./src/lib/plugins/): global plugins.
  - [`config/`](./src/lib/config/): env and configs.
  - [`utils/`](./src/lib/utils/): common utils.
- [`src/models/`](./src/models): defines data structure and database interactions.
- [`src/routes/`](./src/routes): handles request with file base routing.
- [`src/services/`](./src/services): implements core business logic.
- [`drizzle/`](./drizzle): drizzle internal working dir.

## Style Guide

### Naming

Files, folder name — kebab-case.

## Tools

- [Fastify](https://fastify.dev/) - Fast and low overhead web framework.
- [drizzle](https://orm.drizzle.team/) - ORM for you to ship ship ship

## Scripts

- `pnpm dev`: run server in watch mode
- `pnpm start`: start server
- `pnpm lint`: check code style and rules.

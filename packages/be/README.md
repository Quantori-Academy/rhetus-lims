# Rhetus BE

_See the [full doc](../README.md) first._

- [Project Structure](#project-structure)
- [Style Guide](#style-guide)
- [Tools](#tools)
- [Scripts](#scripts)

## Project Structure

We use **fastify** as the server.

- [`src/`](./src): app entry point.
  - [`app.js`](./src/app.js): application instance.
  - [`server.js`](./src/server.js): server file.
  - [`runtimeEnv.js`](./src/runtimeEnv.js): all envs available in up at runtime
- [`src/lib/`](./src/lib): common parts of app.
  - [`plugins/`](./src/lib/plugins/): global plugins.
  - [`config/`](./src/lib/config/): env and configs.
  - [`utils/`](./src/lib/utils/): common utils.
- [`src/models/`](./src/models): defines data structure and database interactions.
- [`src/routes/`](./src/routes): handles request with file base routing.
- [`src/services/`](./src/services): implements core business logic.
- [`knex/`](./knex): list of migrations.

## Style Guide

### Naming

Files, folder name — kebab-case.

## Tools

- [Fastify](https://fastify.dev/) - Fast and low overhead web framework.
- [knex](https://knexjs.org/) - SQL query builder

## Scripts

- `pnpm dev`: run server in watch mode
- `pnpm start`: start server
- `pnpm lint`: check code style and rules.

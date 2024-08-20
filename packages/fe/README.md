# Rhetus FE

_See the [full doc](../README.md) first._

- [Project Structure](#project-structure)
- [Style Guide](#style-guide)
- [Tools](#tools)
- [Scripts](#scripts)
- [Design System](#design-system)

## Project Structure

We use **Vue.js** as the UI framework and **Vite** as the builder.

- [`src/`](./src): app entry point.
  - [`main.js`](./src/main.js): JS entry point.
  - [`app.vue`](./src/app.vue): index vue component.
  - [`runtimeEnv.js`](./src/runtimeEnv.js): all envs available in up at runtime
- [`src/lib/`](./src/lib): common parts of app.
  - [`assets/`](./src/lib/assets/): global stylesheets and images.
  - [`components/`](./src/lib/components/): common components.
  - [`utils/`](./src/lib/utils/): common utils.
  - [`router/`](./src/lib/router/): router of app and routes list.

**Feature folders**

- [`src/`](./src):
  - [`featureA/`](): featureA.
  - [`featureB/`](): featureA.

Sliced File Architecture (not Feature Sliced File Architecture).

In this approach, all files related to a specific element, function, or feature are stored in a single directory dedicated to that feature. This means that components, styles, and logic associated with the feature are kept together. This makes the code more understandable and manageable. Everything else is unnecessary complexity.

## Style Guide

### Naming

Files, folder name, components — kebab-case

### Vue

General Vue.js style guide — [style guide](https://vuejs.org/style-guide/) (A, B, C)

Prefix for internal common components — `rh-`  (example: `rh-form`)

**Composables**

Using Composables only in exceptional cases. For all basic cases, use the components, slots, scoped-slots and other forms of code reuse in Vue

## Tools

- [Element Plus](https://github.com/element-plus/element-plus) - UI Library
- [date-fns](https://date-fns.org/) - for date operation and formating
- [ofetch](https://github.com/unjs/ofetch) - better fetch API

## Scripts

- `pnpm dev`: run app in dev mode.
- `pnpm dev:tools`: run app with [vue devtools](https://devtools-next.vuejs.org/).
- `pnpm build`: build production files.
- `pnpm lint`: check code style and rules.

## Design System

All **colors** must be declared in [`colors.css`](src/lib/assets/stylesheets/colors.css).

**Fonts** are declared in [`fonts.css`](src/lib/assets/stylesheets/fonts.css.css).

For **icons**, we use [Prime Icons](https://github.com/primefaces/primeicons) and [`<rh-icon>`](src/lib/components/rh-icon.vue) component.

```vue
<rh-icon name="dollar"></rh-icon>
```

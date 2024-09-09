> This document contains everything you need to get started on our project

## Getting started

### Install deps

We use `node.js` and `pnpm`. It is necessary to install them to get started.

My suggestion is to use [asdf](https://asdf-vm.com/). Asdf It's a manager of all your runtime versions with one tool.

To install `node.js` correct version just pass [Getting Started Guide](https://asdf-vm.com/guide/getting-started.html) in docs.

After that to install `pnpm` just run this commands

```bash
asdf plugin-add pnpm
asdf install pnpm latest
```

### Fill envs

Each project package has an `env.example` in it, you need to fill it out. Ask teamlead or the mentors for the correct values for all variables.

### Start project

The project launch of our project is standard.

Install deps.

    pnpm install

Run one of scripts in `package.json`. For example

    pnpm dev:be

Also, if you use only one package, you can run it directly from the package. For example, while in FE, you can run it like this.

    pnpm dev

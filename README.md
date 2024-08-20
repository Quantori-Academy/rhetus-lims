![](static/banner.png)

Rhetus LIMS is a repository for a efficient system that stores, manages, and analyzes laboratory data.

Prototype link: `TBD`

---

- [Principles](#principles)
  - [Collaboration](#collaboration)
  - [Efficiency](#efficiency)
  - [Iterativeness](#iterativeness)
  - [Transparency](#transparency)
- [Project Structure](#project-structure)
- [Tools](#tools)
- [Scripts](#scripts)
- [Git](#git)

  - [Branches](#branches)
  - [Code Review](#code-review)

- [Test Strategy](#test-strategy)
- [Visual Language](#visual-language)
- [Dependencies](#dependencies)
- [Guides](#guides)

## Principles

We believe in kindness and collaborate to achieve results. Results enable us to do everything else.

We achieve results as efficiently as possible, without wasting time.

This is a subset of the rules taken from: [Gitlab Values](https://handbook.gitlab.com/handbook/values/#:~:text=GitLab's%20six%20core%20values%20are,other%20by%20assuming%20good%20intent.)

### Collaboration

**Kindness** — We don't need [jerks](https://bobsutton.typepad.com/my_weblog/2006/10/the_no_asshole_.html) on our team. Feedback should be as positive and public as possible.

**Say thank you** — Publicly thank people for their help.

**Apologize.**

**Support the success of others.**

**People are not their work** — Talk about the work, not the person doing it (“You didn’t send feedback on the new design” instead of “You never listen to me”).

**Make an effort to know each other better** — Get to know the person behind the lines of text in chats and emails. Encourage people to learn more about each other on a personal level.

### Efficiency

It's important to us to work on what is needed, do no more than what is necessary, and avoid doing the same thing multiple times. This allows us to achieve more and better fulfill our potential.

**Boring solutions** — Use the simplest and most boring solutions. If needed, they can always be made more complex later. Our ability to innovate quickly is limited by the overall complexity at any given time, so any reduction in complexity is beneficial.

Don’t choose an interesting technology just because you want to work with it. Using widely adopted solutions means that many bugs have already been fixed, and it will be easier for others to contribute to the project.

**Short verbal responses** — Give brief answers to verbal questions so that the other person can either ask more or move on quickly.

**Be your own manager** — We want our team members to be their own managers, who don’t need daily check-ins to achieve their goals.

**Mistakes are acceptable.**

### Iterativeness

We break tasks into the smallest possible parts and start working on them as quickly as possible.

If something can be excluded from the first iteration, create a new task and link it to the current one.

**Don’t write large plans** — the first step is enough.

You’ll have a much clearer understanding of what to do next after something is already released.

If you feel a bit uneasy about the small number of features in the first iteration, you’re doing it right.

At first, quick decision-making and realizing that things change with less consultation can be challenging.

**But often the simplest version turns out to be the best.**

**Shorten cycle times. Short iterations reduce our cycle time.**

**Minimum Viable Change (MVC)**. To improve the outcome, always aim for the quickest change. If you believe the new idea is better than the existing one, there’s no need to spend time polishing it.

**Create a proposal**. If a team decision needs to be made, instead of holding a meeting, create a proposal — this is a much more efficient use of everyone’s time. Don’t let your ego or desire to see your solution implemented get in the way of finding the best outcome.

### Transparency

**Public by default**

**Straightforwardness** — We are open with each other.

**Everything and everyone can be questioned**. Any past decisions and guidelines are open to reconsideration, but you follow them until they are changed.

**Disagree, but commit**. Everything can be questioned, but if a decision is not overturned, it must be followed — this is a general principle.

## Project Structure

- **Development**
  - [`be/`](./packages/be/): server's logic and UI.
    - See **[`packages/be/README.md`](./packages/be/README.md)** for BE docs.
  - [`fe/`](./packages/fe/): client’s logic and UI.
    - See **[`./packages/fe/README.md`](./packages/fe/README.md)** for FE docs.
- [`docs/`](./docs/): guides for developers.
- [`static/`](./static/): images for guides.
- [`.github/`](./.github/): scripts to test projects on CI.
- [`.vscode/`](./.vscode/): VS Code settings and extensions.

We are using [pnpm monorepo](https://pnpm.io/workspaces). Each project has its dependencies, tools, and configs. Read `README.md` in each project for project’s files and architecture.

## Tools

Global development tools:

- `Editor Config` - Config to use the same code style formatting.
- `Prettier` - to use the same code style formatting.
- `ESLint` - to check for popular mistakes in JavaScript.

Each project has its own tools, too.

## Scripts

- `pnpm dev`: run BE and FE.
- `pnpm build`: build BE and FE.

## Git

How to work with repo in git:

1. Clone the repository.
2. Create a new branch for your feature or fix [{ISSUE_NUMBER}-{SOME_FEATURE}] (example: 4-storage-dashboard-filters).
3. Edit the files as needed.
4. Stage your changes.
5. Commit your changes.
6. Push your branch to the remote repository
7. Create a pull request (PR)

**Important:** We use squash merging only!

- Ensure your PR has a clear, concise commit history.
- When merging, select "Squash and merge" to combine all commits into a single one.
- This keeps the main branch clean and easy to follow.

### Branches

- main - the branch that is deployed to production.
- all other branches are short-lived feature branches.

### Code Review

- Target your pull-requests to main branch
- Request code review using GitHub
- Rebase your work if there are many new changes in main
- Get at least 1 approval from mentors or team lead
- Squash commits and merge PR

## Test Strategy

If any mistake happens a few times, we should add an automatic tool to **prevent mistakes** in the future.

We are using unit tests for **BE** and **FE**. We mock network requests and the platform environment.

`TBD in 2 or 3 milestone`

## Visual Language

### Keyboard accessible

This means you can navigate between fields and controls using **entirely your** keyboard. Create a correct outline for visibly focused elements.

Made it actually usable from the keyboard It's **not enough** to just create an outline and correct tab index. The app must be fully keyboard accessible and have clear guidelines.

### Tried to make input parsing friendly

I always try to make parsing crystal clear and help users input data as accurately as possible without breaking the ability to copy/paste.

### Made error messages actually useful

Instead of displaying vague error messages such as "Oh, we have a problem. Please try again in a minute", which are of little help in fixing the problem caused by them. Errors should be informative and trying to **help user** resolve a problem **he caused**

## Dependencies

How we choose dependencies:

1. Always checking alternatives from npm search, not just take the most popular one.
2. By project activity looking at their repository/issues/PR.
3. By JS bundle size for web client dependency.
4. By `node_modules` size and number of subdependencies.

You can use [pkg-size.dev](https://pkg-size.dev) to get bundle, `node_modules`, and subdependencies.

We put to `dependencies` only dependencies we need for production deploy. All other dependencies you should put to `devDependencies`.

To update specific dependency use:

```sh
pnpm update DEPENDENCY
```

To update all dependencies:

```sh
pnpm update --interactive --latest -r --include-workspace-root
pnpm update -r --include-workspace-root
```

We can update all dependencies at least once per week.

## Guides

- [Team Onboarding](./docs/onboarding.md)

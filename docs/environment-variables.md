# How add new new environment variable

This is explanation about how to add environment variable to CI and code.

To add a new variable, follow these steps:

1. Add it to `.env` or `.env.local` if it contains sensitive information, such as API keys, passwords, or database access.
2. Don't forget to include it in `.env.example` with an appropriate fake value.

3. Add the variable to `build.yml` so that it becomes available during the build process.

4. Notify the person with access so they can add it to GitHub Secrets or GitHub Vars.

5. Only after all this, you can merge your PR with the new variable.

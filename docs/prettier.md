# Setting up Prettier

This is a guide for setting up Prettier using VS Code (inform your tech lead about this).

1. Install the Prettier plugin (if it’s not already installed).
2. Set Prettier as the default formatter in VS Code settings.
3. Enable the «Format on save» option.
4. Enable the «Auto save» — I recommend the `onFocusChange` option.

## Settings in json format

If you're configuring VS Code through the settings file, these additional settings are not necessary:

```json
"editor.formatOnSave": true,
"files.autoSave": "onFocusChange",
"editor.defaultFormatter": "esbenp.prettier-vscode",
```

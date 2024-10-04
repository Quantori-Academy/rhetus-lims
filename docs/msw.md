# MSW Settings and Explanation

This is explanation about how MSW works.

```
VITE_MSW_BROWSER=false
VITE_API_URL=http://vm3.quantori.academy:3000/
```

After that, you need to run `pnpm dev:msw`. This script will override `VITE_MSW_BROWSER`, allowing MSW to run in the browser context and giving you the ability to intercept requests.

Next, add the necessary handlers in the `handlers.js` file. The `api()` function is there just to avoid hardcoding the API path, pulling it from `.env` instead.

Also, This is not necessary to adding `/api` to the backend path — that part is already included in the `VITE_API_URL` variable.

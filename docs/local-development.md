# How to run the local Backend (BE) or Frontend (FE):

This is explanation about how to setup local development.

## How to Set Up the Backend for Local Development

**Important:** This is necessary only if you are developing both the frontend and backend at the same time. In all other cases, use the real backend and MSW.

1. Change `VITE_API_URL` to the local version, for example, `http://127.0.0.1:3000`.

2. Fill in all the required environment variables:

   **2.1** Some of them are already listed in `.env`. You need to add the same values that you set for the backend. For example:

   ```
   API_HOST=127.0.0.1
   API_PORT=3000
   ```

   **2.2** Some secrets are in `.env.example` but without values. You can get the values for these secrets from colleagues, but it’s best not to share them in public chats.

3. After this, your local backend will work.

## How to Set Up the Frontend for Local Development

1. Fill in all the required environment variables:

   **1.1** Some of them are already listed in `.env`. You need to add the same values that you set for the backend. For example:

   ```
   API_HOST=127.0.0.1
   API_PORT=3000
   ```

   **1.2** Some secrets are in `.env.example` but without values. You can get the values for these secrets from colleagues, but it’s best not to share them in public chats.

2. Make sure that CORS for the backend and your frontend are on the same URL.

3. After this, your local frontend will work.

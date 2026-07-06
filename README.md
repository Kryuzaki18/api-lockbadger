# api-lockbadger

This is the backend service for LockBadger, built with Fastify and TypeScript.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Start the application:
   ```bash
   npm start
   ```

## Available scripts

- `npm run build` - compile the TypeScript source
- `npm start` - start the application entrypoint

## Notes

- The API uses Fastify with plugins for authentication, CORS, security headers, rate limiting, and MongoDB support.
- PM2 is included for process management in production-like environments.
- Keep environment-specific values in a local `.env` file and do not commit secrets.

# Simple Web API

Express + Paseto + Zod + Helmet starter. Auto route loading, auth, validation, structured logging, and graceful shutdown.

## Features

- **Express 5** — modern async HTTP framework
- **Paseto v4** — stateless access & refresh tokens
- **Zod** — request body validation
- **Helmet** — security headers
- **Winston** — structured logging (dev console / prod file)
- **Auto route loader** — drop `.route.ts` files into `src/routes/`
- **Auth middleware** — `authenticate` for protected routes
- **Body validation** — automatic empty body check
- **Graceful shutdown** — SIGTERM/SIGINT handler
- **Husky** — pre-commit lint + typecheck

## Quick Start

```bash
# 1. Clone & install
npm install

# 2. Copy env file
cp .env.example .env.development

# 3. Generate Paseto key pair
npm run generate:key

# 4. Paste the keys into .env.development
#    (ACCESS_TOKEN_SECRET, ACCESS_TOKEN_PUBLIC,
#     REFRESH_TOKEN_SECRET, REFRESH_TOKEN_PUBLIC)

# 5. Start dev server
npm run dev
```

Server runs at `http://localhost:3306`.

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start dev server with hot reload |
| `npm run build`        | Build to `dist/`                 |
| `npm start`            | Run production build             |
| `npm run typecheck`    | TypeScript check                 |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier format                  |
| `npm run generate:key` | Generate Paseto key pair         |

## Environment

Copy `.env.example` to `.env.development`:

```bash
cp .env.example .env.development
```

`.env.development` is gitignored — safe for local secrets.
If already tracked, remove from git:

```bash
git rm --cached .env.development
```

Required vars (from `npm run generate:key`):

```
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_PUBLIC=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_PUBLIC=
```

## Routes

Auto-loaded from `src/routes/*.route.ts` → `/api/{name}`.

### Built-in

| Endpoint             | Method | Auth   | Description           |
| -------------------- | ------ | ------ | --------------------- |
| `/api/health`        | GET    | —      | Health check          |
| `/api/auth/register` | POST   | —      | Register user         |
| `/api/auth/login`    | POST   | —      | Login, returns tokens |
| `/api/auth/me`       | GET    | Bearer | Current user profile  |

## Project Structure

```
src/
  index.ts                 entry point + graceful shutdown
  app.ts                   express app (helmet, cors, middleware)
  routes.ts                auto route loader
  config/index.ts          all env config
  types/index.ts           shared types
  logger/index.ts          winston logger
  lib/                     helpers (errors, response, token, password)
  middlewares/             auth, validate, error handler
  routes/                  drop your .route.ts files here
scripts/
  generate-key.ts          paseto key generator
```

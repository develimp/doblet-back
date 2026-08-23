# Doblet-back

API for the Doblet project, built with LoopBack 4.

## 🚀 Installation

Install dependencies using [pnpm](https://pnpm.io/):

```bash
pnpm install
```

> If you don't have pnpm installed, you can install it globally with:
> npm install -g pnpm

## ⚙️ Environment configuration

This project uses environment variables defined in `.env` files.

### Files:
- `.env`: for local development, Docker Compose, and production deployment

This file is excluded from version control. Do not commit it to Git.
Create your own copy based on the example.

### Create your environment file:

```bash
cp .env.example .env
```

### Example .env.example structure:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## 🗄️ Database

This project includes a `db` folder containing:
- a main script that creates the database and all tables
- a `triggers` subfolder with the required triggers
- a `procedures` subfolder with stored procedures

## ▶️ Running the application

### Development (local):

```bash
pnpm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

### Development (Docker Compose)

Start the backend and MariaDB containers with:

```bash
pnpm run back
```

The backend is available at http://127.0.0.1:3001. Docker Compose reads the
database and application settings from `.env`.

### Production (uses .env):

```bash
NODE_ENV=production pnpm start
```

Or use the npm script:

```bash
pnpm run start:prod
```

## 🔁 Rebuild the project

### To incrementally build the project:

```bash
pnpm run build
```

### To force a full build by cleaning up cached artifacts:

```bash
pnpm run rebuild
```

## ✅ Lint and format

### Check for style errors:

```bash
pnpm run lint
```

### Automatically fix issues:

```bash
pnpm run lint:fix
pnpm run prettier:fix
```

## 🧪 Tests

```bash
pnpm run test
```
## 🛠️ Other useful commands

- `pnpm run migrate`: Migrate database schemas for models
- `pnpm run openapi-spec`: Generate OpenAPI spec into a file
- `pnpm run db:schema`: Apply the database schema in the MariaDB container
- `pnpm run seed`: Seed the database from the LoopBack container
- `pnpm run docker:build`: Build a Docker image for this application
- `pnpm run docker:run`: Run this application inside a Docker container

## 📚 More information

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

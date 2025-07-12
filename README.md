# Doblet-back

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## 🚀 Installation

Install dependencies using [pnpm](https://pnpm.io/):

```bash
pnpm install
```

> If you don't have pnpm installed, you can install it globally with:
> npm install -g pnpm

## ⚙️ Environment configuration

This project uses environment variables defined in .env files.

### Files:
- .env.local: for local development
- .env.production: for production deployment

> ⚠️ Both files are excluded from version control (.gitignore).
Do not commit them to Git. Create your own copies based on the example.

### Create your environment file:

```bash
cp .env.example .env.local
```

### Example .env.example structure:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## ▶️ Running the application

### Development (uses .env.local):

```bash
pnpm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

### Production (uses .env.production):

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

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## 📚 More information

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

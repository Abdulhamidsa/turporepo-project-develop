# Turborepo Monorepo

This is a full-stack monorepo built with **Turborepo** and **pnpm workspaces**, supporting multiple applications and shared packages with blazing fast performance and clean developer experience.

---

## Tech Stack

- **Turborepo** – task runner & caching
- **pnpm** – package manager
- **TypeScript**
- **Prettier + Tailwind plugin**
- **ESLint (shared config)**
- **Zod** – schema validation
- **shadcn/ui** – component library used in the `ui` package

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Abdulhamidsa/turporepo-project-develop.git
cd turporepo-project-develop
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run all apps in dev mode

```bash
pnpm dev
```

You can also filter specific apps during development:

```bash
pnpm dev --filter vite-app
pnpm dev --filter next-app
```

---

## Available Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Run all apps in development mode     |
| `pnpm dev --filter` | Run specific app only                |
| `pnpm build`        | Clean and build all apps/packages    |
| `pnpm clean`        | Run `clean` across all packages/apps |
| `pnpm lint`         | Run linter across the repo           |
| `pnpm format`       | Format code with Prettier            |
| `pnpm check-format` | Check if formatting is correct       |

---

## Linting & Formatting

- Shared ESLint config: `@repo/eslint-config`
- Prettier plugins:
  - Tailwind CSS plugin
  - Import sorting

Run manually:

```bash
pnpm lint
pnpm format
```

---

## Monorepo Tips

- Add new apps inside `/apps`
- Add shared code inside `/packages`
- Use workspace imports like `@repo/ui` or `@repo/config`

---

## UI Components (shadcn/ui)

This repo uses **shadcn/ui** in the `ui` package.  
To add new components:

```bash
cd packages/ui
npx shadcn-ui@latest add [component-name]
```

---

## License

MIT © Abdulhamid Alsaati

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run test`            | Ejecuta la suite de tests (Vitest)               |

## 🔐 Entorno (.env)

Crea un archivo `.env` en `web/` con estas variables (no commit):

```
PUBLIC_SANITY_PROJECT_ID=tu_project_id
PUBLIC_SANITY_DATASET=production
# Opcional, debe coincidir con el cliente en `src/lib/sanityClient.ts`
PUBLIC_SANITY_API_VERSION=2024-03-18
```

Notas:
- Las variables `PUBLIC_*` son accesibles en cliente con Astro.
- No hardcodees credenciales en código; usa `.env` local y secretos en CI/CD.
- También puedes copiar `web/.env.example` como base: `cp .env.example .env`.

## 🧪 Tests

- Las pruebas se ejecutan con Vitest: `npm run test`
- Cobertura actual:
  - `src/lib/sanityClient.ts` (fetch + fallbacks)
  - `src/lib/head.ts` (`buildHeadMeta` y `buildLayoutProps`)

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

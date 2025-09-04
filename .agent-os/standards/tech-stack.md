# Tech Stack for JAMStack Projects

## Context

Tech stack tailored for JAMStack projects using AstroJS, TypeScript, TailwindCSS, Shoelace, and Sanity CMS. Overridable in project-specific `.agent-os/product/tech-stack.md`.

- **App Framework**: AstroJS latest stable
- **Language**: TypeScript latest stable
- **CSS Framework**: TailwindCSS latest stable
- **UI Components**: Shoelace latest stable
- **CMS**: Sanity CMS
- **Monorepo Structure**: Separate `web` and `cms` directories, each with its own `package.json`
- **Hosting**: Cloudflare, Vercel or Netlify for static site hosting
- **CI/CD Platform**: GitHub Actions
- **CI/CD Trigger**: Sanity CMS webhooks
- **Image Formats**: Modern formats (e.g., WebP, AVIF)
- **SEO Optimization**: Metadata, structured data, and semantic HTML
- **Performance Tools**: AstroJS utilities, TailwindCSS optimizations, lazy loading, and prefetching
- **Testing**: Unit and integration tests for both `web` and `cms` projects
- **Testing**:  
  - Unit tests con Vitest + Testing Library for ambos `web` y `cms`
  - Integration tests con Playwright/Cypress for ambos `web` y `cms`
  - E2E tests con Playwright for `web`
  - Visual regression tests con Percy/Chromatic o Playwright + loki for `web`
  - Accessibility tests con axe-core o Pa11y CI for `web`
  - Performance tests con Lighthouse CI for `web`
  - (Opcional) Contract tests para esquemas de Sanity for `cms`
- **Version Control**: Git with GitHub
- **Node Version**: Latest LTS
- **Package Manager**: npm or pnpm

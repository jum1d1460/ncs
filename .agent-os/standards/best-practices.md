# Development Best Practices for JAMStack Projects

## Context

Guidelines tailored for JAMStack projects using AstroJS, TypeScript, TailwindCSS, Shoelace, and Sanity CMS.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple

- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones

### Optimize for Readability

- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"

### Keep It Modular

- Build reusable blocks (modules) for pages.
- Ensure blocks are self-contained and portable.

### Optimize for JAMStack

- Prioritize static site generation (SSG).
- Use modern image formats and responsive images.
- Leverage AstroJS utilities for performance optimizations.

### Mobile-First Design

- Design and test for mobile devices first.
- Ensure layouts adapt gracefully to larger screens.

### SEO and LLM Optimization

- Optimize metadata for search engines and language models.
- Use semantic HTML and structured data.

### Performance Focus

- Use TailwindCSS utilities for efficient styling.
- Prefetch resources where applicable.
- Minimize JavaScript and leverage lazy loading.

### CI/CD Integration

- Automate rebuilds and deployments via GitHub Actions.
- Trigger builds on Sanity CMS webhooks.

## Progress Sync After Task Completion

- Upon completing a task, update checkboxes in:
  - `.agent-os/specs/**/tasks.md` for the relevant feature
  - `.agent-os/product/roadmap.md` for impacted items
- Keep `[ ]` / `[x]` checkboxes as the single source of truth.
- Avoid rewriting titles/descriptions unless minor corrections.
- Local verification:
  - Script: `web/scripts/sync-progress.cjs`
  - NPM script: `npm run verify:progress` in `web/`
  - Optional hook: configure `git config core.hooksPath .githooks` and make it executable

### DRY (Don't Repeat Yourself)

- Extract repeated logic into reusable utilities.
- Share common configurations across the monorepo.

### File Structure

- Organize the monorepo into `web` and `cms` directories.
- Ensure each project has its own `package.json`.
- Group related functionality together within each project.
</conditional-block>

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Prefer actively maintained libraries with strong community support.
- Ensure compatibility with TypeScript and JAMStack principles.
- Evaluate libraries for performance and bundle size impact.
</conditional-block>

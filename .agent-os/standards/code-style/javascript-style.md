# JavaScript/TypeScript Style Guide

## General Rules

- Use TypeScript for all new codebases.
- Follow the latest ECMAScript standards.
- Use `strict` mode in TypeScript configurations.
- Prefer `const` and `let` over `var`.
- Use arrow functions for anonymous functions.
- Always use semicolons.

## Code Formatting

- Use 2 spaces for indentation.
- Use single quotes for strings, except to avoid escaping.
- Place a single blank line between class methods.
- Use trailing commas in multi-line objects and arrays.

## TypeScript Specific Rules

- Always define return types for functions.
- Use `interface` for object type definitions.
- Prefer `readonly` for immutability.
- Avoid `any` type; use `unknown` or `never` where applicable.

## AstroJS Integration

- Use `.astro` files for component definitions.
- Example:

```typescript
---
import { defineComponent } from 'astro';
---

<template>
  <div>
    <h1>Hello, Astro!</h1>
  </div>
</template>
```

## Example Code

```typescript
interface User {
  readonly id: number;
  name: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

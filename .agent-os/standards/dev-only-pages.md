---
title: Páginas de demo y test solo en desarrollo
summary: Las páginas bajo `web/src/pages/demo/` y `web/src/pages/test/` deben prerenderizarse solo en dev y no existir en producción.
owners:
- web
severity: medium
---

## Estándar

- Ubicar demos en `web/src/pages/demo/` y pruebas en `web/src/pages/test/`.
- En cada página agregar en la primera línea: `export const prerender = import.meta.env.DEV;`.
- Estas rutas no deben desplegarse en producción (404 fuera de dev).

## Motivación

Evita exponer rutas internas de prueba o demo en entornos productivos y mantiene el código organizado.

## Verificación

- En `build` de producción no deben generarse rutas bajo `/demo/*` ni `/test/*`.
- Revisar que todas las páginas afectadas contengan la bandera de `prerender` arriba.



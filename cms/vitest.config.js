const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  define: {
    global: 'globalThis',
  },
})

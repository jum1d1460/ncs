// Polyfill para WebCrypto en entornos Node.js que no lo tienen habilitado
const { webcrypto } = require('crypto')

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto
}

// Asegurar que getRandomValues esté disponible
if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto)
}

// También configurar en global para compatibilidad
if (!global.crypto) {
  global.crypto = webcrypto
}

// Polyfill para WebCrypto en entornos Node.js que no lo tienen habilitado
import { webcrypto } from 'crypto'

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any
}

// Asegurar que getRandomValues esté disponible
if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto)
}

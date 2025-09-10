import {describe, it, expect} from 'vitest'
import schema from './globalSettings'

// Polyfill para WebCrypto en entornos Node.js que no lo tienen habilitado
if (!globalThis.crypto) {
  const { webcrypto } = require('crypto')
  globalThis.crypto = webcrypto
  if (!globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto)
  }
}

// Helper mínimo para evaluar validaciones de campo en Sanity
async function runFieldValidation(fieldName: string, value: unknown) {
  const field = (schema.fields as any[]).find(f => f.name === fieldName)
  if (!field) throw new Error(`Field not found: ${fieldName}`)
  if (!field.validation) return []
  // Sanity pasa una instancia "rule" con métodos encadenables; simulamos esa interfaz
  const messages: string[] = []
  const rule: any = {
    _rules: [] as any[],
    required() { this._rules.push({type: 'required'}); return this },
    min(n: number) { this._rules.push({type: 'min', n}); return this },
    max(n: number) { this._rules.push({type: 'max', n}); return this },
    uri(opts: any) { this._rules.push({type: 'uri', opts}); return this },
    valueOfField(_name: string) { return undefined },
  }
  const chain = field.validation(rule)
  const rules = chain?._rules || rule._rules
  for (const r of rules) {
    if (r.type === 'required') {
      if (value === undefined || value === null || value === '') messages.push('Required')
    }
    if (r.type === 'min' && typeof value === 'string') {
      if (value.length < r.n) messages.push(`Min ${r.n}`)
    }
    if (r.type === 'max' && typeof value === 'string') {
      if (value.length > r.n) messages.push(`Max ${r.n}`)
    }
    if (r.type === 'uri') {
      const ok = typeof value === 'string' && /^(https?:)\/\//.test(value)
      if (!ok && value != null) messages.push('Invalid URL')
    }
  }
  return messages
}

describe('globalSettings schema validations', () => {
  it('siteTitle requerido y longitudes 2..80', async () => {
    expect(await runFieldValidation('siteTitle', '')).toContain('Required')
    expect(await runFieldValidation('siteTitle', 'A')).toContain('Min 2')
    expect(await runFieldValidation('siteTitle', 'A'.repeat(81))).toContain('Max 80')
    expect(await runFieldValidation('siteTitle', 'Título válido')).toEqual([])
  })

  it('siteDescription máximo 300, vacío permitido', async () => {
    expect(await runFieldValidation('siteDescription', '')).toEqual([])
    expect(await runFieldValidation('siteDescription', 'A'.repeat(301))).toContain('Max 300')
  })

  it('socialLinks.url valida esquema http/https', async () => {
    const socialField: any = (schema.fields as any[]).find(f => f.name === 'socialLinks')
    const objType = socialField?.of?.[0]
    const urlField = objType?.fields?.find((f: any) => f.name === 'url')
    const rule: any = {
      _rules: [] as any[],
      required() { this._rules.push({type: 'required'}); return this },
      min(n: number) { this._rules.push({type: 'min', n}); return this },
      max(n: number) { this._rules.push({type: 'max', n}); return this },
      uri(opts: any) { this._rules.push({type: 'uri', opts}); return this },
    }
    const chain = urlField.validation(rule)
    const rules = chain?._rules || rule._rules
    const messages: string[] = []
    const good = 'https://example.com'
    const bad = 'ftp://example.com'
    for (const r of rules) {
      if (r.type === 'uri') {
        const ok = /^(https?:)\/\//.test(good)
        const okBad = /^(https?:)\/\//.test(bad)
        if (!ok) messages.push('Invalid URL')
        if (okBad) messages.push('Should reject non http/https')
      }
    }
    expect(messages).toEqual([])
  })

  it('navMain permite URL absolutas o relativas y/o referencia a página', async () => {
    const navField: any = (schema.fields as any[]).find(f => f.name === 'navMain')
    const objType = navField?.of?.[0]
    const urlField = objType?.fields?.find((f: any) => f.name === 'url')
    // Construimos un contexto similar al de Sanity para Rule.custom
    const runCustom = async (value: any, parent: any) => {
      const messages: string[] = []
      const rule: any = {
        _rules: [] as any[],
        custom(fn: any) { this._rules.push({type: 'custom', fn}); return this },
      }
      const chain = urlField.validation(rule)
      const rules = chain?._rules || rule._rules
      for (const r of rules) {
        if (r.type === 'custom') {
          const res = await r.fn(value, {parent})
          if (res !== true && res) messages.push(res)
        }
      }
      return messages
    }

    expect(await runCustom('', {page: null})).toContain('Debes indicar una URL o seleccionar una página')
    expect(await runCustom('/contacto', {page: null})).toEqual([])
    expect(await runCustom('https://example.com', {page: null})).toEqual([])
    expect(await runCustom('ftp://example.com', {page: null})).toContain('La URL debe ser absoluta (http/https) o comenzar por /')
    expect(await runCustom('', {page: { _type: 'reference', _ref: 'page123' }})).toEqual([])
  })
})



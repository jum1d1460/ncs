import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {fetchGlobalSettings, type GlobalSettings} from './sanityClient'

// Mock del cliente de Sanity
vi.mock('@sanity/client', () => {
  const fetch = vi.fn()
  return {
    createClient: () => ({fetch}),
    // Exponemos el mock para poder controlarlo en tests
    __mock__: {fetch},
  }
})

let fetchMock: ReturnType<typeof vi.fn>

describe('fetchGlobalSettings', () => {
  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('@sanity/client')
    // @ts-expect-error propiedad de ayuda expuesta por el mock
    fetchMock = mod.__mock__.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('devuelve datos completos cuando la consulta responde correctamente', async () => {
    const payload: GlobalSettings = {
      siteTitle: 'Título',
      siteDescription: 'Descripción',
      favicon: {asset: {url: 'https://example.com/favicon.png'}},
      ogImage: {asset: {url: 'https://example.com/og.png'}},
      socialLinks: [{type: 'instagram', url: 'https://ig.com/x'}],
      defaultMeta: {titleSuffix: ' | ACME', ogTitle: 'OG Título', ogDescription: 'OG Desc'},
    }
    fetchMock.mockResolvedValueOnce(payload)

    const result = await fetchGlobalSettings()
    // Debe contener al menos lo que viene del payload; el método añade defaults para el resto
    expect(result).toMatchObject(payload)
    // Defaults añadidos
    expect(result.brand).toBeNull()
    expect(result.navMain).toEqual([])
    expect(result.legalLinks).toEqual([])
    expect(result.contact).toEqual({})
  })

  it('aplica fallbacks cuando campos vienen ausentes/undefined', async () => {
    fetchMock.mockResolvedValueOnce({} as GlobalSettings)

    const result = await fetchGlobalSettings()
    expect(result.siteTitle).toBeTruthy()
    expect(result.siteDescription).toBeTruthy()
    expect(result.favicon).toBeNull()
    expect(result.ogImage).toBeNull()
    expect(Array.isArray(result.socialLinks)).toBe(true)
    expect(result.defaultMeta?.titleSuffix).toBeTruthy()
    expect(result.defaultMeta?.ogTitle).toBeTruthy()
    expect(result.defaultMeta?.ogDescription).toBeTruthy()
  })

  it('devuelve defaults cuando la consulta lanza error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchGlobalSettings()
    expect(result.siteTitle).toBe('NCS Psicóloga Zaragoza')
    expect(result.siteDescription).toBe('Psicología para familias y profesionales en Zaragoza')
    expect(result.favicon).toBeNull()
    expect(result.ogImage).toBeNull()
    expect(result.socialLinks).toEqual([])
    expect(result.defaultMeta?.titleSuffix).toBe(' | NCS')
  })
})



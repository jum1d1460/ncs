import {describe, it, expect} from 'vitest'
import {buildHeadMeta, buildLayoutProps} from './head'

describe('buildHeadMeta', () => {
  it('usa props explícitas cuando están presentes', () => {
    const res = buildHeadMeta({
      title: 'Título P',
      description: 'Desc P',
      faviconUrl: 'https://example.com/icon.png',
      ogImageUrl: 'https://example.com/og.png',
    })
    expect(res.computedTitle).toBe('Título P')
    expect(res.computedDescription).toBe('Desc P')
    expect(res.faviconHref).toBe('https://example.com/icon.png')
    expect(res.faviconType).toBe('image/png')
    expect(res.ogImageUrl).toBe('https://example.com/og.png')
  })

  it('hace fallback a siteTitle/siteDescription cuando faltan props', () => {
    const res = buildHeadMeta({
      siteTitle: 'Título Site',
      siteDescription: 'Desc Site',
      faviconUrl: null,
    })
    expect(res.computedTitle).toBe('Título Site')
    expect(res.computedDescription).toBe('Desc Site')
    expect(res.faviconHref).toBe('/favicon.svg')
    expect(res.faviconType).toBe('image/svg+xml')
  })

  it('aplica defaults globales cuando no hay datos', () => {
    const res = buildHeadMeta({})
    expect(res.computedTitle).toBe('NCS Psicóloga Zaragoza')
    expect(res.computedDescription).toBe('Psicóloga en Zaragoza - Nelly Castro Sanchez')
    expect(res.faviconHref).toBe('/favicon.svg')
    expect(res.faviconType).toBe('image/svg+xml')
    expect(res.ogImageUrl).toBeNull()
  })

  it('buildLayoutProps integra page y settings correctamente', () => {
    const page = {title: 'Página X'}
    const settings = {
      siteTitle: 'Sitio',
      siteDescription: 'Desc Sitio',
      favicon: {asset: {url: 'https://example.com/fav.svg'}},
      ogImage: {asset: {url: 'https://example.com/og.png'}},
    }
    const props = buildLayoutProps(page, settings)
    expect(props.title).toBe('Página X')
    expect(props.siteTitle).toBe('Sitio')
    expect(props.siteDescription).toBe('Desc Sitio')
    expect(props.faviconUrl).toBe('https://example.com/fav.svg')
    expect(props.ogImageUrl).toBe('https://example.com/og.png')
  })
})



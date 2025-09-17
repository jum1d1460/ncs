import { describe, it, expect } from 'vitest'
import serviceCarouselSchema from '../schemaTypes/blockServiceCarousel'

describe('ServiceCarousel Schema', () => {
  it('debe incluir campo title como string requerido', () => {
    const titleField = serviceCarouselSchema.fields?.find(field => field.name === 'title')
    
    expect(titleField).toBeDefined()
    expect(titleField?.type).toBe('string')
    expect(titleField?.validation).toBeDefined()
  })

  it('debe mantener campos existentes intactos', () => {
    const fieldNames = serviceCarouselSchema.fields?.map(field => field.name) || []
    
    expect(fieldNames).toContain('items')
    expect(fieldNames).toContain('autoplay')
    expect(fieldNames).toContain('intervalMs')
    expect(fieldNames).toContain('showPrice')
  })

  it('debe tener función de preview actualizada', () => {
    const mockData = {
      title: 'Mi Carrusel de Servicios',
      items: [
        { _ref: 'service1' },
        { _ref: 'service2' }
      ]
    }

    const preview = serviceCarouselSchema.preview?.prepare?.(mockData)
    
    expect(preview?.title).toBe('Mi Carrusel de Servicios')
    expect(preview?.subtitle).toBe('2 elementos')
  })

  it('debe usar fallback cuando title está ausente', () => {
    const mockData = {
      items: [{ _ref: 'service1' }]
    }

    const preview = serviceCarouselSchema.preview?.prepare?.(mockData)
    
    expect(preview?.title).toBe('Carrusel de servicios')
    expect(preview?.subtitle).toBe('1 elementos')
  })
})

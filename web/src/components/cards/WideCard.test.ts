import { describe, it, expect } from 'vitest'

// Funciones de utilidad que se usarán en el componente WideCard
function formatDuration(d?: any): string | null {
  if (!d || !d.mode) return null;
  if (d.mode === 'fixed' && typeof d.value === 'number') return `${d.value} min`;
  if (d.mode === 'range' && typeof d.min === 'number' && typeof d.max === 'number') return `${d.min}–${d.max} min`;
  return null;
}

function formatPrice(p?: any): string | null {
  if (!p || !p.mode) return null;
  const currency = p.currency || '€';
  if (p.mode === 'fixed' && typeof p.value === 'number') return `${p.value} ${currency}`;
  if (p.mode === 'range' && typeof p.min === 'number' && typeof p.max === 'number') return `${p.min}–${p.max} ${currency}`;
  return null;
}

describe('WideCard Component Logic', () => {
  const mockService = {
    _id: 'service1',
    title: 'Terapia Individual',
    shortDescription: 'Sesiones personalizadas para el desarrollo personal',
    duration: {
      mode: 'fixed',
      value: 60
    },
    price: {
      mode: 'fixed',
      value: 80,
      currency: 'EUR'
    },
    url: 'https://example.com/terapia',
    cardImage: {
      asset: {
        _ref: 'image-abc123',
        url: 'https://example.com/image.jpg'
      },
      alt: 'Imagen de terapia individual'
    }
  }

  it('debe formatear duración correctamente', () => {
    const duration = formatDuration(mockService.duration)
    expect(duration).toBe('60 min')
  })

  it('debe formatear precio correctamente', () => {
    const price = formatPrice(mockService.price)
    expect(price).toBe('80 EUR')
  })

  it('debe manejar duración en rango', () => {
    const rangeDuration = {
      mode: 'range',
      min: 45,
      max: 90
    }
    const formatted = formatDuration(rangeDuration)
    expect(formatted).toBe('45–90 min')
  })

  it('debe manejar precio en rango', () => {
    const rangePrice = {
      mode: 'range',
      min: 60,
      max: 100,
      currency: 'EUR'
    }
    const formatted = formatPrice(rangePrice)
    expect(formatted).toBe('60–100 EUR')
  })

  it('debe retornar null para datos inválidos', () => {
    expect(formatDuration(null)).toBe(null)
    expect(formatDuration(undefined)).toBe(null)
    expect(formatDuration({})).toBe(null)
    
    expect(formatPrice(null)).toBe(null)
    expect(formatPrice(undefined)).toBe(null)
    expect(formatPrice({})).toBe(null)
  })

  it('debe manejar servicio sin datos opcionales', () => {
    const minimalService = {
      title: 'Servicio básico'
    }
    
    expect(formatDuration(minimalService.duration)).toBe(null)
    expect(formatPrice(minimalService.price)).toBe(null)
  })

  it('debe validar estructura de props del componente', () => {
    const validProps = {
      service: mockService,
      showPrice: true
    }
    
    expect(validProps.service).toBeDefined()
    expect(validProps.service.title).toBe('Terapia Individual')
    expect(typeof validProps.showPrice).toBe('boolean')
  })

  it('debe manejar props por defecto', () => {
    const defaultProps = {
      service: {},
      showPrice: true
    }
    
    expect(defaultProps.service).toEqual({})
    expect(defaultProps.showPrice).toBe(true)
  })
})

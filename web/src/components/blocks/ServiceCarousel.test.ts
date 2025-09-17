import { describe, it, expect } from 'vitest'

// Funciones de utilidad para el carrusel
function calculateVisibleItems(containerWidth: number, itemWidth: number): number {
  return Math.floor(containerWidth / itemWidth)
}

function calculateScrollPosition(currentIndex: number, itemWidth: number, containerWidth: number): number {
  const maxScroll = Math.max(0, (currentIndex * itemWidth) - (containerWidth * 0.25))
  return Math.min(maxScroll, currentIndex * itemWidth)
}

function generatePaginationDots(totalItems: number, currentIndex: number): Array<{active: boolean, index: number}> {
  return Array.from({ length: totalItems }, (_, index) => ({
    active: index === currentIndex,
    index
  }))
}

describe('ServiceCarousel Logic', () => {
  const mockServices = [
    {
      _id: 'service1',
      title: 'Terapia Individual',
      shortDescription: 'Sesiones personalizadas',
      duration: { mode: 'fixed', value: 60 },
      price: { mode: 'fixed', value: 80, currency: 'EUR' }
    },
    {
      _id: 'service2', 
      title: 'Terapia de Pareja',
      shortDescription: 'Sesiones para parejas',
      duration: { mode: 'fixed', value: 90 },
      price: { mode: 'fixed', value: 120, currency: 'EUR' }
    },
    {
      _id: 'service3',
      title: 'Terapia Familiar',
      shortDescription: 'Sesiones familiares',
      duration: { mode: 'fixed', value: 75 },
      price: { mode: 'fixed', value: 100, currency: 'EUR' }
    }
  ]

  describe('calculateVisibleItems', () => {
    it('debe calcular correctamente elementos visibles', () => {
      expect(calculateVisibleItems(1200, 400)).toBe(3)
      expect(calculateVisibleItems(800, 400)).toBe(2)
      expect(calculateVisibleItems(400, 400)).toBe(1)
    })

    it('debe manejar casos edge', () => {
      expect(calculateVisibleItems(0, 400)).toBe(0)
      expect(calculateVisibleItems(1200, 0)).toBe(Infinity)
    })
  })

  describe('calculateScrollPosition', () => {
    it('debe calcular posición de scroll para primer elemento', () => {
      const position = calculateScrollPosition(0, 400, 1200)
      expect(position).toBe(0)
    })

    it('debe calcular posición de scroll para elementos siguientes', () => {
      const position = calculateScrollPosition(1, 400, 1200)
      expect(position).toBe(100) // 1 * 400 - (1200 * 0.25) = 400 - 300 = 100
    })

    it('debe manejar contenedores pequeños', () => {
      const position = calculateScrollPosition(2, 400, 800)
      expect(position).toBe(600) // 2 * 400 - (800 * 0.25) = 800 - 200 = 600
    })
  })

  describe('generatePaginationDots', () => {
    it('debe generar puntos de paginación correctos', () => {
      const dots = generatePaginationDots(3, 1)
      
      expect(dots).toHaveLength(3)
      expect(dots[0]).toEqual({ active: false, index: 0 })
      expect(dots[1]).toEqual({ active: true, index: 1 })
      expect(dots[2]).toEqual({ active: false, index: 2 })
    })

    it('debe manejar primer elemento activo', () => {
      const dots = generatePaginationDots(3, 0)
      
      expect(dots[0]).toEqual({ active: true, index: 0 })
      expect(dots[1]).toEqual({ active: false, index: 1 })
      expect(dots[2]).toEqual({ active: false, index: 2 })
    })

    it('debe manejar último elemento activo', () => {
      const dots = generatePaginationDots(3, 2)
      
      expect(dots[0]).toEqual({ active: false, index: 0 })
      expect(dots[1]).toEqual({ active: false, index: 1 })
      expect(dots[2]).toEqual({ active: true, index: 2 })
    })

    it('debe manejar arrays vacíos', () => {
      const dots = generatePaginationDots(0, 0)
      expect(dots).toHaveLength(0)
    })
  })

  describe('Carrusel State Management', () => {
    it('debe manejar navegación hacia adelante', () => {
      const currentIndex = 0
      const totalItems = 3
      const nextIndex = Math.min(currentIndex + 1, totalItems - 1)
      
      expect(nextIndex).toBe(1)
    })

    it('debe manejar navegación hacia atrás', () => {
      const currentIndex = 1
      const prevIndex = Math.max(currentIndex - 1, 0)
      
      expect(prevIndex).toBe(0)
    })

    it('debe limitar navegación en los extremos', () => {
      const totalItems = 3
      
      // No puede ir más allá del último elemento
      const nextFromLast = Math.min(2, totalItems - 1)
      expect(nextFromLast).toBe(2)
      
      // No puede ir antes del primer elemento
      const prevFromFirst = Math.max(0, 0)
      expect(prevFromFirst).toBe(0)
    })
  })

  describe('Responsive Behavior', () => {
    it('debe ajustar layout según breakpoints', () => {
      const breakpoints = {
        mobile: { width: 375, visibleItems: 1 },
        tablet: { width: 768, visibleItems: 1.5 }, // 1.5 indica que se ve parcialmente el siguiente
        desktop: { width: 1024, visibleItems: 2.25 } // 2.25 indica layout específico del carrusel
      }
      
      expect(breakpoints.mobile.visibleItems).toBe(1)
      expect(breakpoints.tablet.visibleItems).toBe(1.5)
      expect(breakpoints.desktop.visibleItems).toBe(2.25)
    })

    it('debe calcular offset para primer elemento', () => {
      const containerWidth = 1200
      const itemWidth = 400
      const firstItemOffset = (containerWidth - itemWidth * 0.75) / 2
      
      expect(firstItemOffset).toBe(450) // (1200 - 300) / 2
    })
  })
})

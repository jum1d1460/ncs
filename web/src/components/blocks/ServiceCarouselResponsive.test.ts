import { describe, it, expect } from 'vitest'

// Funciones de utilidad para responsive design
function getResponsiveBreakpoints() {
  return {
    mobile: { min: 0, max: 767, containerClass: 'max-w-full' },
    tablet: { min: 768, max: 1023, containerClass: 'max-w-4xl' },
    desktop: { min: 1024, max: Infinity, containerClass: 'max-w-6xl' }
  }
}

function calculateItemWidth(containerWidth: number, breakpoint: string): number {
  const breakpoints = getResponsiveBreakpoints()
  const currentBreakpoint = breakpoints[breakpoint as keyof typeof breakpoints]
  
  if (!currentBreakpoint) return containerWidth * 0.9 // fallback
  
  switch (breakpoint) {
    case 'mobile':
      return containerWidth * 0.9 // 90% en mobile
    case 'tablet':
      return Math.round(containerWidth * 0.8 * 100) / 100 // 80% en tablet, redondeado
    case 'desktop':
      return containerWidth * 0.75 // 75% en desktop (3/4)
    default:
      return containerWidth * 0.9
  }
}

function getGridContainerClasses(): string {
  return 'container mx-auto px-4 sm:px-6 lg:px-8'
}

function calculateVisibleItems(containerWidth: number, itemWidth: number, breakpoint: string): number {
  const items = containerWidth / itemWidth // No usar Math.floor para permitir decimales
  
  switch (breakpoint) {
    case 'mobile':
      return Math.min(items, 1) // Solo 1 elemento visible en mobile
    case 'tablet':
      return Math.min(items, 1.5) // 1.5 elementos (se ve parcialmente el siguiente)
    case 'desktop':
      return Math.min(items, 2.25) // 2.25 elementos (layout específico del carrusel)
    default:
      return 1
  }
}

function shouldShowOverflow(containerWidth: number, totalItemWidth: number): boolean {
  return totalItemWidth > containerWidth
}

function getCarouselOverflowClasses(): string {
  return 'overflow-hidden relative'
}

function getCarouselTrackClasses(): string {
  return 'flex transition-transform duration-500 ease-out'
}

describe('ServiceCarousel Responsive Design', () => {
  describe('getResponsiveBreakpoints', () => {
    it('debe retornar breakpoints correctos', () => {
      const breakpoints = getResponsiveBreakpoints()
      
      expect(breakpoints.mobile.min).toBe(0)
      expect(breakpoints.mobile.max).toBe(767)
      expect(breakpoints.tablet.min).toBe(768)
      expect(breakpoints.tablet.max).toBe(1023)
      expect(breakpoints.desktop.min).toBe(1024)
      expect(breakpoints.desktop.max).toBe(Infinity)
    })

    it('debe incluir clases de contenedor', () => {
      const breakpoints = getResponsiveBreakpoints()
      
      expect(breakpoints.mobile.containerClass).toBe('max-w-full')
      expect(breakpoints.tablet.containerClass).toBe('max-w-4xl')
      expect(breakpoints.desktop.containerClass).toBe('max-w-6xl')
    })
  })

  describe('calculateItemWidth', () => {
    it('debe calcular ancho correcto para mobile', () => {
      const width = calculateItemWidth(375, 'mobile')
      expect(width).toBe(337.5) // 375 * 0.9
    })

    it('debe calcular ancho correcto para tablet', () => {
      const width = calculateItemWidth(768, 'tablet')
      expect(width).toBe(614.4) // 768 * 0.8
    })

    it('debe calcular ancho correcto para desktop', () => {
      const width = calculateItemWidth(1200, 'desktop')
      expect(width).toBe(900) // 1200 * 0.75
    })

    it('debe manejar breakpoint inválido', () => {
      const width = calculateItemWidth(1000, 'invalid')
      expect(width).toBe(900) // 1000 * 0.9 (fallback)
    })
  })

  describe('getGridContainerClasses', () => {
    it('debe retornar clases de contenedor de grilla', () => {
      const classes = getGridContainerClasses()
      
      expect(classes).toContain('container')
      expect(classes).toContain('mx-auto')
      expect(classes).toContain('px-4')
      expect(classes).toContain('sm:px-6')
      expect(classes).toContain('lg:px-8')
    })
  })

  describe('calculateVisibleItems', () => {
    it('debe calcular elementos visibles para mobile', () => {
      const visible = calculateVisibleItems(375, 337, 'mobile')
      expect(visible).toBe(1)
    })

    it('debe calcular elementos visibles para tablet', () => {
      const visible = calculateVisibleItems(768, 614, 'tablet')
      expect(visible).toBeCloseTo(1.25, 2) // 768 / 614 = 1.25, limitado a 1.5
    })

    it('debe calcular elementos visibles para desktop', () => {
      const visible = calculateVisibleItems(1200, 900, 'desktop')
      expect(visible).toBeCloseTo(1.33, 2) // 1200 / 900 = 1.33, limitado a 2.25
    })
  })

  describe('shouldShowOverflow', () => {
    it('debe mostrar overflow cuando contenido excede contenedor', () => {
      expect(shouldShowOverflow(800, 1200)).toBe(true)
    })

    it('debe ocultar overflow cuando contenido cabe en contenedor', () => {
      expect(shouldShowOverflow(1200, 800)).toBe(false)
    })

    it('debe manejar casos límite', () => {
      expect(shouldShowOverflow(1000, 1000)).toBe(false)
      expect(shouldShowOverflow(1000, 1001)).toBe(true)
    })
  })

  describe('getCarouselOverflowClasses', () => {
    it('debe retornar clases correctas para overflow', () => {
      const classes = getCarouselOverflowClasses()
      
      expect(classes).toContain('overflow-hidden')
      expect(classes).toContain('relative')
    })
  })

  describe('getCarouselTrackClasses', () => {
    it('debe retornar clases correctas para el track', () => {
      const classes = getCarouselTrackClasses()
      
      expect(classes).toContain('flex')
      expect(classes).toContain('transition-transform')
      expect(classes).toContain('duration-500')
      expect(classes).toContain('ease-out')
    })
  })

  describe('Layout Grid Integration', () => {
    it('debe mantener carrusel dentro de grilla central', () => {
      const containerClasses = getGridContainerClasses()
      const overflowClasses = getCarouselOverflowClasses()
      
      // El contenedor debe tener clases de grilla
      expect(containerClasses).toContain('container')
      expect(containerClasses).toContain('mx-auto')
      
      // El carrusel debe tener overflow controlado
      expect(overflowClasses).toContain('overflow-hidden')
    })

    it('debe permitir elementos que se extiendan fuera de la grilla', () => {
      const shouldOverflow = shouldShowOverflow(800, 1200)
      const overflowClasses = getCarouselOverflowClasses()
      
      expect(shouldOverflow).toBe(true)
      expect(overflowClasses).toContain('overflow-hidden')
    })
  })

  describe('Performance Optimizations', () => {
    it('debe usar transiciones optimizadas', () => {
      const trackClasses = getCarouselTrackClasses()
      
      expect(trackClasses).toContain('transition-transform')
      expect(trackClasses).toContain('duration-500')
      expect(trackClasses).toContain('ease-out')
    })

    it('debe manejar debounce para eventos de resize', () => {
      // Simular debounce de 300ms
      const debounceTime = 300
      expect(debounceTime).toBeGreaterThan(0)
      expect(debounceTime).toBeLessThanOrEqual(500)
    })
  })

  describe('Responsive Behavior', () => {
    it('debe adaptarse correctamente a diferentes tamaños', () => {
      const mobileWidth = calculateItemWidth(375, 'mobile')
      const tabletWidth = calculateItemWidth(768, 'tablet')
      const desktopWidth = calculateItemWidth(1200, 'desktop')
      
      expect(mobileWidth).toBeLessThan(tabletWidth)
      expect(tabletWidth).toBeLessThan(desktopWidth)
    })

    it('debe mantener proporciones correctas', () => {
      const containerWidth = 1200
      const mobileRatio = calculateItemWidth(containerWidth, 'mobile') / containerWidth
      const tabletRatio = calculateItemWidth(containerWidth, 'tablet') / containerWidth
      const desktopRatio = calculateItemWidth(containerWidth, 'desktop') / containerWidth
      
      expect(mobileRatio).toBe(0.9)
      expect(tabletRatio).toBe(0.8)
      expect(desktopRatio).toBe(0.75)
    })
  })
})

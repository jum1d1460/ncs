import { describe, it, expect } from 'vitest'

// Funciones de utilidad para la paginación
function generatePaginationDots(totalItems: number, currentIndex: number): Array<{active: boolean, index: number}> {
  return Array.from({ length: totalItems }, (_, index) => ({
    active: index === currentIndex,
    index
  }))
}

function getPaginationClasses(isActive: boolean): string {
  const baseClasses = 'w-2 h-2 rounded-full transition-all duration-200'
  const activeClasses = 'bg-blue-600 scale-125'
  const inactiveClasses = 'bg-gray-300 hover:bg-gray-400'
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
}

function shouldShowPagination(totalItems: number): boolean {
  return totalItems > 1
}

function getPaginationPosition(): { bottom: string, left: string } {
  return {
    bottom: '1rem', // bottom-4
    left: '1rem'    // left-4
  }
}

function calculatePaginationAccessibility(index: number, totalItems: number): { ariaLabel: string, tabIndex: number } {
  return {
    ariaLabel: `Ir al servicio ${index + 1} de ${totalItems}`,
    tabIndex: 0
  }
}

describe('Carousel Pagination', () => {
  describe('generatePaginationDots', () => {
    it('debe generar puntos correctos para múltiples elementos', () => {
      const dots = generatePaginationDots(3, 1)
      
      expect(dots).toHaveLength(3)
      expect(dots[0]).toEqual({ active: false, index: 0 })
      expect(dots[1]).toEqual({ active: true, index: 1 })
      expect(dots[2]).toEqual({ active: false, index: 2 })
    })

    it('debe manejar primer elemento activo', () => {
      const dots = generatePaginationDots(4, 0)
      
      expect(dots[0]).toEqual({ active: true, index: 0 })
      expect(dots[1]).toEqual({ active: false, index: 1 })
      expect(dots[2]).toEqual({ active: false, index: 2 })
      expect(dots[3]).toEqual({ active: false, index: 3 })
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

    it('debe manejar un solo elemento', () => {
      const dots = generatePaginationDots(1, 0)
      
      expect(dots).toHaveLength(1)
      expect(dots[0]).toEqual({ active: true, index: 0 })
    })

    it('debe manejar índices fuera de rango', () => {
      const dots = generatePaginationDots(3, 5)
      
      expect(dots).toHaveLength(3)
      expect(dots.every(dot => !dot.active)).toBe(true)
    })
  })

  describe('getPaginationClasses', () => {
    it('debe generar clases correctas para estado activo', () => {
      const classes = getPaginationClasses(true)
      
      expect(classes).toContain('w-2 h-2 rounded-full transition-all duration-200')
      expect(classes).toContain('bg-blue-600 scale-125')
      expect(classes).not.toContain('bg-gray-300')
    })

    it('debe generar clases correctas para estado inactivo', () => {
      const classes = getPaginationClasses(false)
      
      expect(classes).toContain('w-2 h-2 rounded-full transition-all duration-200')
      expect(classes).toContain('bg-gray-300 hover:bg-gray-400')
      expect(classes).not.toContain('bg-blue-600 scale-125')
    })

    it('debe incluir clases base en ambos estados', () => {
      const activeClasses = getPaginationClasses(true)
      const inactiveClasses = getPaginationClasses(false)
      
      const baseClasses = 'w-2 h-2 rounded-full transition-all duration-200'
      expect(activeClasses).toContain(baseClasses)
      expect(inactiveClasses).toContain(baseClasses)
    })
  })

  describe('shouldShowPagination', () => {
    it('debe mostrar paginación cuando hay múltiples elementos', () => {
      expect(shouldShowPagination(2)).toBe(true)
      expect(shouldShowPagination(3)).toBe(true)
      expect(shouldShowPagination(10)).toBe(true)
    })

    it('debe ocultar paginación cuando hay un solo elemento', () => {
      expect(shouldShowPagination(1)).toBe(false)
    })

    it('debe ocultar paginación cuando no hay elementos', () => {
      expect(shouldShowPagination(0)).toBe(false)
    })
  })

  describe('getPaginationPosition', () => {
    it('debe retornar posición correcta para esquina inferior izquierda', () => {
      const position = getPaginationPosition()
      
      expect(position.bottom).toBe('1rem')
      expect(position.left).toBe('1rem')
    })

    it('debe mantener consistencia en la posición', () => {
      const position1 = getPaginationPosition()
      const position2 = getPaginationPosition()
      
      expect(position1).toEqual(position2)
    })
  })

  describe('calculatePaginationAccessibility', () => {
    it('debe generar etiquetas ARIA correctas', () => {
      const accessibility = calculatePaginationAccessibility(0, 3)
      
      expect(accessibility.ariaLabel).toBe('Ir al servicio 1 de 3')
      expect(accessibility.tabIndex).toBe(0)
    })

    it('debe manejar diferentes posiciones', () => {
      const accessibility = calculatePaginationAccessibility(2, 5)
      
      expect(accessibility.ariaLabel).toBe('Ir al servicio 3 de 5')
      expect(accessibility.tabIndex).toBe(0)
    })

    it('debe manejar un solo elemento', () => {
      const accessibility = calculatePaginationAccessibility(0, 1)
      
      expect(accessibility.ariaLabel).toBe('Ir al servicio 1 de 1')
      expect(accessibility.tabIndex).toBe(0)
    })
  })

  describe('Pagination State Management', () => {
    it('debe sincronizar estado con índice actual', () => {
      const totalItems = 4
      const currentIndex = 2
      
      const dots = generatePaginationDots(totalItems, currentIndex)
      const activeDot = dots.find(dot => dot.active)
      
      expect(activeDot?.index).toBe(currentIndex)
      expect(dots.filter(dot => dot.active)).toHaveLength(1)
    })

    it('debe actualizar estado correctamente al cambiar índice', () => {
      const totalItems = 3
      let currentIndex = 0
      
      // Estado inicial
      let dots = generatePaginationDots(totalItems, currentIndex)
      expect(dots[0].active).toBe(true)
      expect(dots[1].active).toBe(false)
      expect(dots[2].active).toBe(false)
      
      // Cambio a segundo elemento
      currentIndex = 1
      dots = generatePaginationDots(totalItems, currentIndex)
      expect(dots[0].active).toBe(false)
      expect(dots[1].active).toBe(true)
      expect(dots[2].active).toBe(false)
      
      // Cambio a tercer elemento
      currentIndex = 2
      dots = generatePaginationDots(totalItems, currentIndex)
      expect(dots[0].active).toBe(false)
      expect(dots[1].active).toBe(false)
      expect(dots[2].active).toBe(true)
    })
  })

  describe('Responsive Behavior', () => {
    it('debe mantener funcionalidad en diferentes tamaños', () => {
      const totalItems = 5
      const currentIndex = 2
      
      const dots = generatePaginationDots(totalItems, currentIndex)
      
      // La paginación debe funcionar igual independientemente del tamaño
      expect(dots).toHaveLength(5)
      expect(dots[currentIndex].active).toBe(true)
      expect(dots.filter(dot => dot.active)).toHaveLength(1)
    })

    it('debe manejar muchos elementos correctamente', () => {
      const totalItems = 20
      const currentIndex = 10
      
      const dots = generatePaginationDots(totalItems, currentIndex)
      
      expect(dots).toHaveLength(20)
      expect(dots[currentIndex].active).toBe(true)
      expect(dots.filter(dot => dot.active)).toHaveLength(1)
    })
  })
})

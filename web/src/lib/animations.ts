// Configuración centralizada de animaciones
export const ANIMATION_CONFIG = {
  // Configuración de scroll suave
  smoothScroll: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
    damping: 0.1
  },
  
  // Configuración de parallax
  parallax: {
    background: { speed: 0.5, offset: 0 },
    silhouette: { speed: 0.3, offset: 0 },
    text: { speed: 0.1, offset: 0 },
    // Parallax personalizado para diferentes elementos
    custom: {
      slow: { speed: 0.2, offset: 0 },
      medium: { speed: 0.4, offset: 0 },
      fast: { speed: 0.6, offset: 0 }
    }
  },
  
  // Configuración de atractores de scroll
  attractors: {
    strength: 0.3,
    range: 200,
    // Diferentes tipos de atractores
    types: {
      gentle: { strength: 0.2, range: 150 },
      medium: { strength: 0.3, range: 200 },
      strong: { strength: 0.5, range: 250 }
    }
  },
  
  // Configuración de transiciones de página
  pageTransition: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1],
    // Diferentes tipos de transición
    types: {
      fade: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      slide: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      scale: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  },
  
  // Configuración de animaciones de entrada
  entrance: {
    duration: 0.6,
    delay: 0,
    ease: [0.25, 0.1, 0.25, 1],
    // Diferentes tipos de animación
    types: {
      fadeInUp: { duration: 0.6, delay: 0 },
      fadeInLeft: { duration: 0.6, delay: 0 },
      fadeInRight: { duration: 0.6, delay: 0 },
      scaleIn: { duration: 0.5, delay: 0 },
      slideInUp: { duration: 0.7, delay: 0 },
      slideInDown: { duration: 0.7, delay: 0 }
    }
  },
  
  // Configuración de stagger (animaciones en secuencia)
  stagger: {
    delay: 0.1,
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Utilidades para crear animaciones
export const createAnimation = (type: keyof typeof ANIMATION_CONFIG.entrance.types, delay = 0) => {
  const config = ANIMATION_CONFIG.entrance.types[type];
  return {
    ...config,
    delay: delay * ANIMATION_CONFIG.stagger.delay
  };
};

// Utilidades para crear parallax
export const createParallax = (speed: number, offset = 0) => ({
  speed,
  offset
});

// Utilidades para crear atractores
export const createAttractor = (strength: number, range = 200) => ({
  strength,
  range
});

// Configuración de breakpoints para animaciones responsivas
export const RESPONSIVE_ANIMATIONS = {
  mobile: {
    parallax: { speed: 0.3 },
    entrance: { duration: 0.4 }
  },
  tablet: {
    parallax: { speed: 0.4 },
    entrance: { duration: 0.5 }
  },
  desktop: {
    parallax: { speed: 0.5 },
    entrance: { duration: 0.6 }
  }
};

// Función para obtener configuración responsiva
export const getResponsiveConfig = (breakpoint: keyof typeof RESPONSIVE_ANIMATIONS) => {
  return RESPONSIVE_ANIMATIONS[breakpoint];
};

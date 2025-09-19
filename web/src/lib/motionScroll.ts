// Sistema de animaciones basado en la API oficial de Motion.dev
import { animate, scroll, inView } from "motion";

// Configuración de animaciones
const CONFIG = {
  parallax: {
    background: { speed: 0.5 },
    silhouette: { speed: 0.3 },
    text: { speed: 0.1 }
  },
  entrance: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Sistema de parallax usando scroll() de Motion
class MotionParallaxManager {
  private animations: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupParallax());
    } else {
      this.setupParallax();
    }
  }

  private setupParallax() {
    // Parallax para backgrounds de hero
    document.querySelectorAll('.hero-background').forEach((element, index) => {
      const animation = scroll(
        animate(element, 
          { y: [0, -100] },
          { ease: "linear" }
        ),
        { target: element }
      );
      this.animations.push(animation);
    });

    // Parallax para siluetas de hero
    document.querySelectorAll('.hero-silhouette').forEach((element, index) => {
      const animation = scroll(
        animate(element, 
          { y: [0, -60] },
          { ease: "linear" }
        ),
        { target: element }
      );
      this.animations.push(animation);
    });

    // Parallax para contenido de hero
    document.querySelectorAll('.hero-content').forEach((element, index) => {
      const animation = scroll(
        animate(element, 
          { y: [0, -20] },
          { ease: "linear" }
        ),
        { target: element }
      );
      this.animations.push(animation);
    });

    // Parallax para imágenes de bloques
    document.querySelectorAll('.block-image, .service-image').forEach((element, index) => {
      const animation = scroll(
        animate(element, 
          { y: [50, -50] },
          { ease: "linear" }
        ),
        { target: element }
      );
      this.animations.push(animation);
    });
  }

  public destroy() {
    this.animations.forEach(cancel => cancel());
    this.animations = [];
  }
}

// Sistema de animaciones de entrada usando inView
class MotionEntranceAnimations {
  private animations: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEntranceAnimations());
    } else {
      this.setupEntranceAnimations();
    }
  }

  private setupEntranceAnimations() {
    // Animaciones para elementos con data-animate
    document.querySelectorAll('[data-animate]').forEach((element, index) => {
      const animationType = element.getAttribute('data-animate') || 'fadeInUp';
      const delay = parseInt(element.getAttribute('data-delay') || '0') * 100;
      const duration = parseFloat(element.getAttribute('data-duration') || '0.6') * 1000;

      const animation = inView(element, () => {
        this.animateElement(element as HTMLElement, animationType, delay, duration);
      }, { margin: "-10% 0px -10% 0px" });

      this.animations.push(animation);
    });

    // Animaciones automáticas para bloques de contenido
    document.querySelectorAll('.block-content, .service-block, .testimonial-block').forEach((element, index) => {
      const animation = inView(element, () => {
        this.animateElement(element as HTMLElement, 'fadeInUp', index * 100, 600);
      }, { margin: "-10% 0px -10% 0px" });

      this.animations.push(animation);
    });
  }

  private async animateElement(element: HTMLElement, animationType: string, delay: number, duration: number) {
    // Marcar como animando
    element.classList.add('motion-animating');
    
    // Asegurar que el elemento esté visible inicialmente
    element.style.opacity = '0';
    
    await new Promise(resolve => setTimeout(resolve, delay));

    switch (animationType) {
      case 'fadeInUp':
        await animate(element, 
          { opacity: [0, 1], y: [30, 0] },
          { duration, ease: CONFIG.entrance.ease }
        );
        break;
      case 'fadeInLeft':
        await animate(element, 
          { opacity: [0, 1], x: [-30, 0] },
          { duration, ease: CONFIG.entrance.ease }
        );
        break;
      case 'fadeInRight':
        await animate(element, 
          { opacity: [0, 1], x: [30, 0] },
          { duration, ease: CONFIG.entrance.ease }
        );
        break;
      case 'scaleIn':
        await animate(element, 
          { opacity: [0, 1], scale: [0.8, 1] },
          { duration, ease: CONFIG.entrance.ease }
        );
        break;
    }
    
    // Remover clase de animación
    element.classList.remove('motion-animating');
  }

  public destroy() {
    this.animations.forEach(cancel => cancel());
    this.animations = [];
  }
}

// Sistema de scroll suave usando scroll() de Motion
class MotionScrollSmooth {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Aplicar scroll suave nativo
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Interceptar clicks en enlaces para scroll suave
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    this.isInitialized = true;
  }

  private handleLinkClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement;
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    const targetElement = document.querySelector(href);
    if (!targetElement) return;
    
    e.preventDefault();
    
    // Scroll suave a elemento
    targetElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  public scrollToElement(selector: string, offset = 0) {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;
    
    const targetY = element.offsetTop - offset;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  public destroy() {
    document.documentElement.style.scrollBehavior = '';
  }
}

// Instancias globales
let parallaxManager: MotionParallaxManager | null = null;
let entranceAnimations: MotionEntranceAnimations | null = null;
let scrollSmooth: MotionScrollSmooth | null = null;

// Función de inicialización
export function initMotionScroll() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  parallaxManager = new MotionParallaxManager();
  entranceAnimations = new MotionEntranceAnimations();
  scrollSmooth = new MotionScrollSmooth();
  
  console.log('🎬 Sistema Motion Scroll inicializado');
}

// Funciones de utilidad
export function smoothScrollToElement(selector: string, offset = 0) {
  if (scrollSmooth) {
    scrollSmooth.scrollToElement(selector, offset);
  }
}

export function addParallax(element: HTMLElement, speed: number) {
  if (!parallaxManager) return;
  
  const animation = scroll(
    animate(element, 
      { y: [0, -speed * 100] },
      { ease: "linear" }
    ),
    { target: element }
  );
  
  return animation;
}

export function animateElement(element: HTMLElement, animation: string, delay = 0) {
  if (!entranceAnimations) return;
  
  element.setAttribute('data-animate', animation);
  element.setAttribute('data-delay', delay.toString());
  
  // Re-inicializar para capturar el nuevo elemento
  entranceAnimations.setupEntranceAnimations();
}

// Cleanup
export function destroyMotionScroll() {
  parallaxManager?.destroy();
  entranceAnimations?.destroy();
  scrollSmooth?.destroy();
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionScroll);
  } else {
    initMotionScroll();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroyMotionScroll);
}

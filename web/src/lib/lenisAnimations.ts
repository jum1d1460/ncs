// Sistema de animaciones con Lenis para scroll suave profesional
import { animate, inView } from "motion";
import Lenis from "lenis";

// Configuración
const CONFIG = {
  duration: 600,
  ease: [0.25, 0.1, 0.25, 1],
  lenis: {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: true,
    touchMultiplier: 2,
    infinite: false,
    normalizeWheel: true,
    wheelMultiplier: 1
  }
};

// Instancia global de Lenis
let lenis: Lenis | null = null;

// Sistema de parallax optimizado para Lenis
class LenisParallax {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupParallax());
    } else {
      this.setupParallax();
    }
  }

  private setupParallax() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Parallax para backgrounds de hero
    document.querySelectorAll('.hero-background').forEach(element => {
      this.addParallax(element as HTMLElement, 0.5);
    });

    // Parallax para siluetas de hero
    document.querySelectorAll('.hero-silhouette').forEach(element => {
      this.addParallax(element as HTMLElement, 0.3);
    });

    // Parallax para contenido de hero
    document.querySelectorAll('.hero-content').forEach(element => {
      this.addParallax(element as HTMLElement, 0.1);
    });
  }

  private addParallax(element: HTMLElement, speed: number) {
    // Usar el evento de scroll de Lenis para mejor rendimiento
    if (lenis) {
      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        const rate = scroll * -speed;
        element.style.transform = `translateY(${rate}px)`;
      });
    }
  }
}

// Sistema de animaciones de entrada con Lenis
class LenisEntranceAnimations {
  private isInitialized = false;
  private animatedElements = new Set<HTMLElement>();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      this.setupAnimations();
    }
  }

  private setupAnimations() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Solo animar elementos que explícitamente tienen data-animate
    document.querySelectorAll('[data-animate]').forEach((element, index) => {
      const animationType = element.getAttribute('data-animate') || 'fadeInUp';
      const delay = parseInt(element.getAttribute('data-delay') || '0') * 100;
      
      this.animateOnScroll(element as HTMLElement, animationType, delay);
    });

    // Animaciones automáticas para bloques específicos
    document.querySelectorAll('.service-block, .testimonial-block, .block-content').forEach((element, index) => {
      this.animateOnScroll(element as HTMLElement, 'fadeInUp', index * 100);
    });
  }

  private animateOnScroll(element: HTMLElement, animationType: string, delay: number) {
    // Evitar animaciones duplicadas
    if (this.animatedElements.has(element)) return;
    
    // Configurar estado inicial
    element.style.opacity = '1'; // Siempre visible
    element.style.transform = this.getInitialTransform(animationType);

    // Usar inView para detectar cuando el elemento es visible
    inView(element, () => {
      if (this.animatedElements.has(element)) return;
      
      this.animatedElements.add(element);
      
      setTimeout(() => {
        this.animateElement(element, animationType);
      }, delay);
    }, { margin: "-10% 0px -10% 0px" });
  }

  private getInitialTransform(animationType: string): string {
    switch (animationType) {
      case 'fadeInUp':
        return 'translateY(30px)';
      case 'fadeInLeft':
        return 'translateX(-30px)';
      case 'fadeInRight':
        return 'translateX(30px)';
      case 'scaleIn':
        return 'scale(0.8)';
      default:
        return 'translateY(30px)';
    }
  }

  private async animateElement(element: HTMLElement, animationType: string) {
    const duration = CONFIG.duration;
    const ease = CONFIG.ease;

    // Asegurar que el elemento esté completamente visible
    element.style.opacity = '1';

    switch (animationType) {
      case 'fadeInUp':
        await animate(element, 
          { y: [30, 0] },
          { duration, ease }
        );
        break;
      case 'fadeInLeft':
        await animate(element, 
          { x: [-30, 0] },
          { duration, ease }
        );
        break;
      case 'fadeInRight':
        await animate(element, 
          { x: [30, 0] },
          { duration, ease }
        );
        break;
      case 'scaleIn':
        await animate(element, 
          { scale: [0.8, 1] },
          { duration, ease }
        );
        break;
    }
  }
}

// Sistema de scroll suave con Lenis
class LenisScrollSmooth {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Inicializar Lenis
    lenis = new Lenis(CONFIG.lenis);
    
    // Interceptar clicks en enlaces
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    // Función de animación de Lenis
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
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
    
    // Usar Lenis para scroll suave
    if (lenis) {
      lenis.scrollTo(targetElement, {
        offset: 0,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  }

  public scrollToElement(selector: string, offset = 0) {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element || !lenis) return;
    
    lenis.scrollTo(element, {
      offset: -offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  }

  public destroy() {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  }
}

// Instancias globales
let parallax: LenisParallax | null = null;
let entranceAnimations: LenisEntranceAnimations | null = null;
let scrollSmooth: LenisScrollSmooth | null = null;

// Función de inicialización
export function initLenisAnimations() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  scrollSmooth = new LenisScrollSmooth();
  parallax = new LenisParallax();
  entranceAnimations = new LenisEntranceAnimations();
  
  console.log('🎬 Sistema Lenis + Motion inicializado');
}

// Funciones de utilidad
export function smoothScrollToElement(selector: string, offset = 0) {
  if (scrollSmooth) {
    scrollSmooth.scrollToElement(selector, offset);
  }
}

export function getLenisInstance() {
  return lenis;
}

// Cleanup
export function destroyLenisAnimations() {
  scrollSmooth?.destroy();
  parallax = null;
  entranceAnimations = null;
  scrollSmooth = null;
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenisAnimations);
  } else {
    initLenisAnimations();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroyLenisAnimations);
}

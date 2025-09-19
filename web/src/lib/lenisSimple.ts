// Sistema de animaciones con Lenis simplificado - sin bloqueo de scroll
import { animate, inView } from "motion";
import Lenis from "lenis";

// Configuración simplificada de Lenis
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
    touchMultiplier: 1,
    infinite: false,
    normalizeWheel: true,
    wheelMultiplier: 1,
    // Configuración para evitar bloqueo
    prevent: false,
    preventDefault: false
  }
};

// Instancia global de Lenis
let lenis: Lenis | null = null;

// Sistema de parallax simple
class SimpleParallax {
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
    // Usar scroll nativo para parallax si Lenis no está disponible
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      element.style.transform = `translateY(${rate}px)`;
    };

    // Usar eventos de Lenis si está disponible, sino scroll nativo
    if (lenis) {
      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        const rate = scroll * -speed;
        element.style.transform = `translateY(${rate}px)`;
      });
    } else {
      window.addEventListener('scroll', updateParallax, { passive: true });
    }
  }
}

// Sistema de animaciones de entrada
class SimpleEntranceAnimations {
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
class SimpleScrollSmooth {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    try {
      // Inicializar Lenis con configuración que no bloquee el scroll
      lenis = new Lenis({
        ...CONFIG.lenis,
        // Configuración adicional para evitar bloqueo
        prevent: false,
        preventDefault: false,
        // Permitir scroll nativo
        syncTouch: false,
        syncWheel: false
      });
      
      // Función de animación de Lenis
      function raf(time: number) {
        if (lenis) {
          lenis.raf(time);
        }
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
      
      // Interceptar clicks en enlaces
      document.addEventListener('click', this.handleLinkClick.bind(this));
      
      console.log('🎬 Lenis inicializado correctamente');
    } catch (error) {
      console.warn('🎬 Error al inicializar Lenis, usando scroll nativo:', error);
      // Fallback a scroll nativo
      this.initNativeScroll();
    }
  }

  private initNativeScroll() {
    // Fallback a scroll nativo si Lenis falla
    document.documentElement.style.scrollBehavior = 'smooth';
    
    document.addEventListener('click', this.handleLinkClick.bind(this));
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
    
    // Usar Lenis si está disponible, sino scroll nativo
    if (lenis) {
      lenis.scrollTo(targetElement, {
        offset: 0,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  public scrollToElement(selector: string, offset = 0) {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;
    
    if (lenis) {
      lenis.scrollTo(element, {
        offset: -offset,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      const targetY = element.offsetTop - offset;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  }

  public destroy() {
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
  }
}

// Instancias globales
let parallax: SimpleParallax | null = null;
let entranceAnimations: SimpleEntranceAnimations | null = null;
let scrollSmooth: SimpleScrollSmooth | null = null;

// Función de inicialización
export function initLenisSimple() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  scrollSmooth = new SimpleScrollSmooth();
  parallax = new SimpleParallax();
  entranceAnimations = new SimpleEntranceAnimations();
  
  console.log('🎬 Sistema Lenis Simple inicializado');
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
export function destroyLenisSimple() {
  scrollSmooth?.destroy();
  parallax = null;
  entranceAnimations = null;
  scrollSmooth = null;
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenisSimple);
  } else {
    initLenisSimple();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroyLenisSimple);
}

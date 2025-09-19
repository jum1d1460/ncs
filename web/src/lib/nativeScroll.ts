// Sistema de animaciones con scroll nativo - sin Lenis
import { animate, inView } from "motion";

// Configuración
const CONFIG = {
  duration: 600,
  ease: [0.25, 0.1, 0.25, 1],
  parallax: {
    background: 0.5,
    silhouette: 0.3,
    text: 0.1
  }
};

// Sistema de parallax nativo
class NativeParallax {
  private isInitialized = false;
  private parallaxElements: Array<{
    element: HTMLElement;
    speed: number;
    offset: number;
  }> = [];

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
      this.addParallax(element as HTMLElement, CONFIG.parallax.background);
    });

    // Parallax para siluetas de hero
    document.querySelectorAll('.hero-silhouette').forEach(element => {
      this.addParallax(element as HTMLElement, CONFIG.parallax.silhouette);
    });

    // Parallax para contenido de hero
    document.querySelectorAll('.hero-content').forEach(element => {
      this.addParallax(element as HTMLElement, CONFIG.parallax.text);
    });

    // Iniciar loop de parallax
    this.startParallaxLoop();
  }

  private addParallax(element: HTMLElement, speed: number) {
    this.parallaxElements.push({
      element,
      speed,
      offset: 0
    });
  }

  private startParallaxLoop() {
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      this.parallaxElements.forEach(({ element, speed, offset }) => {
        const rate = (scrolled - offset) * -speed;
        element.style.transform = `translateY(${rate}px)`;
      });
      
      requestAnimationFrame(updateParallax);
    };
    
    requestAnimationFrame(updateParallax);
  }
}

// Sistema de animaciones de entrada
class NativeEntranceAnimations {
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

// Sistema de scroll suave nativo
class NativeScrollSmooth {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Configurar scroll suave nativo
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Interceptar clicks en enlaces
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
    
    // Scroll suave nativo
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
}

// Instancias globales
let parallax: NativeParallax | null = null;
let entranceAnimations: NativeEntranceAnimations | null = null;
let scrollSmooth: NativeScrollSmooth | null = null;

// Función de inicialización
export function initNativeScroll() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  scrollSmooth = new NativeScrollSmooth();
  parallax = new NativeParallax();
  entranceAnimations = new NativeEntranceAnimations();
  
  console.log('🎬 Sistema de scroll nativo inicializado');
}

// Funciones de utilidad
export function smoothScrollToElement(selector: string, offset = 0) {
  if (scrollSmooth) {
    scrollSmooth.scrollToElement(selector, offset);
  }
}

export function getLenisInstance() {
  return null; // No hay Lenis en este sistema
}

// Cleanup
export function destroyNativeScroll() {
  parallax = null;
  entranceAnimations = null;
  scrollSmooth = null;
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNativeScroll);
  } else {
    initNativeScroll();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroyNativeScroll);
}

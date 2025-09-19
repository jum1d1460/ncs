// Sistema de animaciones final - simple y funcional
import { animate, inView } from "motion";

// Configuración
const CONFIG = {
  duration: 600,
  ease: [0.25, 0.1, 0.25, 1]
};

// Sistema de parallax simple
class FinalParallax {
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
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      element.style.transform = `translateY(${rate}px)`;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }
}

// Sistema de animaciones de entrada muy simple
class FinalEntranceAnimations {
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

// Sistema de scroll suave
class FinalScrollSmooth {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Aplicar scroll suave nativo
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
let parallax: FinalParallax | null = null;
let entranceAnimations: FinalEntranceAnimations | null = null;
let scrollSmooth: FinalScrollSmooth | null = null;

// Función de inicialización
export function initFinalAnimations() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  parallax = new FinalParallax();
  entranceAnimations = new FinalEntranceAnimations();
  scrollSmooth = new FinalScrollSmooth();
  
  console.log('🎬 Sistema de animaciones final inicializado');
}

// Funciones de utilidad
export function smoothScrollToElement(selector: string, offset = 0) {
  if (scrollSmooth) {
    scrollSmooth.scrollToElement(selector, offset);
  }
}

// Cleanup
export function destroyFinalAnimations() {
  // Los sistemas simples no necesitan cleanup especial
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFinalAnimations);
  } else {
    initFinalAnimations();
  }
}

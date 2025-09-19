// Sistema de animaciones simplificado y confiable
import { animate, inView } from "motion";

// Configuración
const CONFIG = {
  duration: 600,
  ease: [0.25, 0.1, 0.25, 1]
};

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

// Sistema de animaciones de entrada
class SimpleEntranceAnimations {
  private isInitialized = false;

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

    // Animaciones para elementos con data-animate
    document.querySelectorAll('[data-animate]').forEach((element, index) => {
      const animationType = element.getAttribute('data-animate') || 'fadeInUp';
      const delay = parseInt(element.getAttribute('data-delay') || '0') * 100;
      
      this.animateOnScroll(element as HTMLElement, animationType, delay);
    });

    // Animaciones automáticas para bloques
    document.querySelectorAll('.block-content, .service-block, .testimonial-block').forEach((element, index) => {
      this.animateOnScroll(element as HTMLElement, 'fadeInUp', index * 100);
    });
  }

  private animateOnScroll(element: HTMLElement, animationType: string, delay: number) {
    // Configurar estado inicial
    element.style.opacity = '0';
    
    switch (animationType) {
      case 'fadeInUp':
        element.style.transform = 'translateY(30px)';
        break;
      case 'fadeInLeft':
        element.style.transform = 'translateX(-30px)';
        break;
      case 'fadeInRight':
        element.style.transform = 'translateX(30px)';
        break;
      case 'scaleIn':
        element.style.transform = 'scale(0.8)';
        break;
    }

    // Usar inView para detectar cuando el elemento es visible
    inView(element, () => {
      setTimeout(() => {
        this.animateElement(element, animationType);
      }, delay);
    }, { margin: "-10% 0px -10% 0px" });
  }

  private async animateElement(element: HTMLElement, animationType: string) {
    const duration = CONFIG.duration;
    const ease = CONFIG.ease;

    switch (animationType) {
      case 'fadeInUp':
        await animate(element, 
          { opacity: [0, 1], y: [30, 0] },
          { duration, ease }
        );
        break;
      case 'fadeInLeft':
        await animate(element, 
          { opacity: [0, 1], x: [-30, 0] },
          { duration, ease }
        );
        break;
      case 'fadeInRight':
        await animate(element, 
          { opacity: [0, 1], x: [30, 0] },
          { duration, ease }
        );
        break;
      case 'scaleIn':
        await animate(element, 
          { opacity: [0, 1], scale: [0.8, 1] },
          { duration, ease }
        );
        break;
    }
  }
}

// Sistema de scroll suave
class SimpleScrollSmooth {
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
let parallax: SimpleParallax | null = null;
let entranceAnimations: SimpleEntranceAnimations | null = null;
let scrollSmooth: SimpleScrollSmooth | null = null;

// Función de inicialización
export function initSimpleAnimations() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('🎬 Animaciones desactivadas por preferencia del usuario');
    return;
  }
  
  // Inicializar sistemas
  parallax = new SimpleParallax();
  entranceAnimations = new SimpleEntranceAnimations();
  scrollSmooth = new SimpleScrollSmooth();
  
  console.log('🎬 Sistema de animaciones simple inicializado');
}

// Funciones de utilidad
export function smoothScrollToElement(selector: string, offset = 0) {
  if (scrollSmooth) {
    scrollSmooth.scrollToElement(selector, offset);
  }
}

// Cleanup
export function destroySimpleAnimations() {
  // Los sistemas simples no necesitan cleanup especial
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleAnimations);
  } else {
    initSimpleAnimations();
  }
}

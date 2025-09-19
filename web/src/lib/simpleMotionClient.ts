// Sistema simplificado de animaciones que funciona con scroll nativo
import { animate } from "motion";

// Sistema de parallax simplificado
class SimpleParallaxManager {
  private elements: Map<HTMLElement, { speed: number; offset: number }> = new Map();
  private rafId: number | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('scroll', this.updateParallax.bind(this), { passive: true });
    this.updateParallax();
  }

  public addElement(element: HTMLElement, speed: number, offset = 0) {
    this.elements.set(element, { speed, offset });
  }

  public removeElement(element: HTMLElement) {
    this.elements.delete(element);
  }

  private updateParallax() {
    if (this.rafId) return;
    
    this.rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      
      this.elements.forEach((config, element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calcular progreso del elemento en viewport
        const progress = Math.max(0, Math.min(1, 
          (scrollY + viewportHeight - elementTop) / (elementHeight + viewportHeight)
        ));
        
        // Aplicar transformación parallax sutil
        const translateY = (progress - 0.5) * config.speed * 30 + config.offset;
        element.style.transform = `translateY(${translateY}px)`;
      });
      
      this.rafId = null;
    });
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.elements.clear();
  }
}

// Sistema de animaciones de entrada simplificado
class SimpleEntranceAnimations {
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target as HTMLElement);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    // Observar elementos con data-animate
    document.querySelectorAll('[data-animate]').forEach(el => {
      this.observer?.observe(el);
    });
  }

  private async animateElement(element: HTMLElement) {
    const animationType = element.dataset.animate || 'fadeInUp';
    const delay = parseInt(element.dataset.delay || '0');
    const duration = parseFloat(element.dataset.duration || '0.6');
    
    // Aplicar animación según el tipo
    switch (animationType) {
      case 'fadeInUp':
        await animate(element, 
          { opacity: [0, 1], y: [30, 0] },
          { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
        );
        break;
      case 'fadeInLeft':
        await animate(element, 
          { opacity: [0, 1], x: [-30, 0] },
          { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
        );
        break;
      case 'fadeInRight':
        await animate(element, 
          { opacity: [0, 1], x: [30, 0] },
          { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
        );
        break;
      case 'scaleIn':
        await animate(element, 
          { opacity: [0, 1], scale: [0.8, 1] },
          { duration, delay, ease: [0.25, 0.1, 0.25, 1] }
        );
        break;
    }
  }

  public destroy() {
    this.observer?.disconnect();
  }
}

// Instancias globales
let parallaxManager: SimpleParallaxManager | null = null;
let entranceAnimations: SimpleEntranceAnimations | null = null;

// Función de inicialización
export function initSimpleMotionClient() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Inicializar sistemas
  parallaxManager = new SimpleParallaxManager();
  entranceAnimations = new SimpleEntranceAnimations();
  
  // Configurar parallax en heros existentes
  setupHeroParallax();
  
  console.log('🎬 Sistema de animaciones simplificado inicializado');
}

// Configurar parallax en heros
function setupHeroParallax() {
  if (!parallaxManager) return;
  
  // Hero backgrounds
  document.querySelectorAll('.hero-background').forEach(bg => {
    parallaxManager!.addElement(bg as HTMLElement, 0.3);
  });
  
  // Hero silhouettes
  document.querySelectorAll('.hero-silhouette').forEach(sil => {
    parallaxManager!.addElement(sil as HTMLElement, 0.2);
  });
  
  // Hero text
  document.querySelectorAll('.hero-content').forEach(text => {
    parallaxManager!.addElement(text as HTMLElement, 0.1);
  });
}

// Función para scroll suave a elemento
export function smoothScrollToElement(selector: string, offset = 0) {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return;
  
  const targetY = element.offsetTop - offset;
  window.scrollTo({
    top: targetY,
    behavior: 'smooth'
  });
}

// Función para añadir parallax a elemento
export function addParallax(element: HTMLElement, speed: number, offset = 0) {
  if (!parallaxManager) return;
  parallaxManager.addElement(element, speed, offset);
}

// Función para animar elemento
export function animateElement(element: HTMLElement, animation: string, delay = 0) {
  if (!entranceAnimations) return;
  
  element.setAttribute('data-animate', animation);
  element.setAttribute('data-delay', delay.toString());
  entranceAnimations.observer?.observe(element);
}

// Cleanup
export function destroySimpleMotionClient() {
  parallaxManager?.destroy();
  entranceAnimations?.destroy();
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleMotionClient);
  } else {
    initSimpleMotionClient();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroySimpleMotionClient);
}

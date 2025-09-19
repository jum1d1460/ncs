// Sistema completo de animaciones con Framer Motion
import { animate, scroll, inView, stagger } from "motion";
import { ANIMATION_CONFIG } from "./animations";

// Usar configuración centralizada
const CONFIG = ANIMATION_CONFIG;

// Scroll suave similar a Lenis
class SmoothScroll {
  private currentY = 0;
  private targetY = 0;
  private ease = 0.1;
  private isScrolling = false;
  private rafId: number | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // NO prevenir scroll nativo - usar scroll nativo con suavizado
    // document.body.style.overflow = 'hidden';
    // document.documentElement.style.overflow = 'hidden';
    
    // Escuchar eventos de scroll para parallax
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Iniciar loop de animación
    this.animate();
  }

  private handleScroll() {
    // Usar scroll nativo en lugar de scroll personalizado
    this.currentY = window.scrollY;
    this.targetY = window.scrollY;
  }

  private animate() {
    // No aplicar transformación al body - usar scroll nativo
    // document.body.style.transform = `translateY(-${this.currentY}px)`;
    
    // Disparar eventos de scroll personalizados
    this.dispatchScrollEvent();
    
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  private dispatchScrollEvent() {
    const event = new CustomEvent('smoothScroll', {
      detail: { scrollY: this.currentY }
    });
    window.dispatchEvent(event);
  }

  public scrollTo(target: number, duration = 1000) {
    // Usar scroll nativo con behavior smooth
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    // No necesitamos restaurar estilos ya que no los modificamos
  }
}

// Sistema de parallax
class ParallaxManager {
  private elements: Map<HTMLElement, { speed: number; offset: number }> = new Map();
  private rafId: number | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Usar scroll nativo en lugar de smoothScroll
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
        
        // Aplicar transformación parallax más sutil
        const translateY = (progress - 0.5) * config.speed * 50 + config.offset;
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

// Sistema de atractores de scroll
class ScrollAttractors {
  private attractors: Map<HTMLElement, { strength: number; range: number }> = new Map();
  private smoothScroll: SmoothScroll | null = null;

  constructor(smoothScroll: SmoothScroll) {
    this.smoothScroll = smoothScroll;
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Usar scroll nativo en lugar de smoothScroll
    window.addEventListener('scroll', this.updateAttractors.bind(this), { passive: true });
  }

  public addAttractor(element: HTMLElement, strength = 0.3, range = 200) {
    this.attractors.set(element, { strength, range });
  }

  public removeAttractor(element: HTMLElement) {
    this.attractors.delete(element);
  }

  private updateAttractors() {
    // Los atractores no funcionan bien con scroll nativo
    // Los desactivamos por ahora para evitar problemas
    return;
  }

  public destroy() {
    this.attractors.clear();
  }
}

// Sistema de transiciones entre páginas
class PageTransitions {
  private isTransitioning = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    
    // Interceptar clicks en enlaces internos
    document.addEventListener('click', this.handleLinkClick.bind(this));
    
    // Manejar navegación del navegador
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  private handleLinkClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || this.isTransitioning) return;
    
    e.preventDefault();
    this.transitionTo(href);
  }

  private handlePopState() {
    if (this.isTransitioning) return;
    this.transitionTo(window.location.pathname);
  }

  private async transitionTo(url: string) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    try {
      // Fade out
      await animate(document.body, 
        { opacity: 0 }, 
        { duration: CONFIG.pageTransition.duration / 2, ease: CONFIG.pageTransition.ease }
      );
      
      // Navegar
      window.history.pushState(null, '', url);
      
      // Fade in
      await animate(document.body, 
        { opacity: 1 }, 
        { duration: CONFIG.pageTransition.duration / 2, ease: CONFIG.pageTransition.ease }
      );
      
    } catch (error) {
      console.error('Error en transición de página:', error);
    } finally {
      this.isTransitioning = false;
    }
  }

  public destroy() {
    // Cleanup si es necesario
  }
}

// Sistema de animaciones de entrada
class EntranceAnimations {
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
let smoothScroll: SmoothScroll | null = null;
let parallaxManager: ParallaxManager | null = null;
let scrollAttractors: ScrollAttractors | null = null;
let pageTransitions: PageTransitions | null = null;
let entranceAnimations: EntranceAnimations | null = null;

// Función de inicialización
export function initMotionClient() {
  if (typeof window === 'undefined') return;
  
  // Verificar preferencia de movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Inicializar sistemas
  smoothScroll = new SmoothScroll();
  parallaxManager = new ParallaxManager();
  scrollAttractors = new ScrollAttractors(smoothScroll);
  pageTransitions = new PageTransitions();
  entranceAnimations = new EntranceAnimations();
  
  // Configurar parallax en heros existentes
  setupHeroParallax();
  
  // Configurar atractores en bloques
  setupBlockAttractors();
  
  console.log('🎬 Sistema de animaciones Motion inicializado');
}

// Configurar parallax en heros
function setupHeroParallax() {
  if (!parallaxManager) return;
  
  // Hero backgrounds
  document.querySelectorAll('.hero-background').forEach(bg => {
    parallaxManager!.addElement(bg as HTMLElement, CONFIG.parallax.background.speed);
  });
  
  // Hero silhouettes
  document.querySelectorAll('.hero-silhouette').forEach(sil => {
    parallaxManager!.addElement(sil as HTMLElement, CONFIG.parallax.silhouette.speed);
  });
  
  // Hero text
  document.querySelectorAll('.hero-content').forEach(text => {
    parallaxManager!.addElement(text as HTMLElement, CONFIG.parallax.text.speed);
  });
}

// Configurar atractores en bloques
function setupBlockAttractors() {
  if (!scrollAttractors) return;
  
  // Bloques de contenido
  document.querySelectorAll('.block-content, .service-block, .testimonial-block').forEach(block => {
    scrollAttractors!.addAttractor(block as HTMLElement, CONFIG.attractors.strength, CONFIG.attractors.range);
  });
}

// Función para scroll suave a elemento
export function smoothScrollToElement(selector: string, offset = 0) {
  if (!smoothScroll) return;
  
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return;
  
  const targetY = element.offsetTop - offset;
  smoothScroll.scrollTo(targetY);
}

// Función para añadir parallax a elemento
export function addParallax(element: HTMLElement, speed: number, offset = 0) {
  if (!parallaxManager) return;
  parallaxManager.addElement(element, speed, offset);
}

// Función para añadir atractor
export function addAttractor(element: HTMLElement, strength = 0.3, range = 200) {
  if (!scrollAttractors) return;
  scrollAttractors.addAttractor(element, strength, range);
}

// Función para animar elemento
export function animateElement(element: HTMLElement, animation: string, delay = 0) {
  if (!entranceAnimations) return;
  
  element.setAttribute('data-animate', animation);
  element.setAttribute('data-delay', delay.toString());
  entranceAnimations.observer?.observe(element);
}

// Cleanup
export function destroyMotionClient() {
  smoothScroll?.destroy();
  parallaxManager?.destroy();
  scrollAttractors?.destroy();
  pageTransitions?.destroy();
  entranceAnimations?.destroy();
}

// Auto-inicialización
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionClient);
  } else {
    initMotionClient();
  }
  
  // Cleanup al salir
  window.addEventListener('beforeunload', destroyMotionClient);
}



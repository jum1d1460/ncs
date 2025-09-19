import type { GlobalSettings } from './sanityClient';

export interface SEOConfig {
  title?: string;
  description?: string;
  ogImageUrl?: string | null;
  siteTitle?: string;
  siteDescription?: string;
  faviconUrl?: string | null;
  footerTitle?: string;
  seoFooterText?: string;
}

/**
 * Obtiene la configuración SEO por defecto basada en la configuración global del sitio
 * @param globalSettings Configuración global del sitio desde Sanity
 * @param pageConfig Configuración específica de la página (opcional)
 * @returns Configuración SEO completa
 */
export function getDefaultSEOConfig(
  globalSettings: GlobalSettings,
  pageConfig?: SEOConfig
): SEOConfig {
  return {
    // Usar configuración de página si existe, sino usar configuración global
    title: pageConfig?.title,
    description: pageConfig?.description,
    ogImageUrl: pageConfig?.ogImageUrl ?? globalSettings.ogImage?.asset?.url ?? null,
    siteTitle: pageConfig?.siteTitle ?? globalSettings.siteTitle,
    siteDescription: pageConfig?.siteDescription ?? globalSettings.siteDescription,
    faviconUrl: pageConfig?.faviconUrl ?? globalSettings.favicon?.asset?.url ?? null,
    footerTitle: pageConfig?.footerTitle ?? globalSettings.footerTitle ?? globalSettings.siteTitle,
    seoFooterText: pageConfig?.seoFooterText ?? globalSettings.seoFooterText ?? globalSettings.siteDescription,
  };
}

/**
 * Construye las props del Layout con la configuración SEO
 * @param pageConfig Configuración específica de la página
 * @param globalSettings Configuración global del sitio
 * @returns Props para el Layout
 */
export function buildLayoutPropsWithSEO(
  pageConfig: SEOConfig,
  globalSettings: GlobalSettings
) {
  const seoConfig = getDefaultSEOConfig(globalSettings, pageConfig);
  
  return {
    // Props SEO
    title: seoConfig.title,
    description: seoConfig.description,
    siteTitle: seoConfig.siteTitle,
    siteDescription: seoConfig.siteDescription,
    faviconUrl: seoConfig.faviconUrl,
    ogImageUrl: seoConfig.ogImageUrl,
    footerTitle: seoConfig.footerTitle,
    seoFooterText: seoConfig.seoFooterText,
    
    // Props del Layout (mantener compatibilidad)
    brand: globalSettings.brand ?? null,
    navMain: globalSettings.navMain ?? [],
    contact: globalSettings.contact ?? {},
    bookingUrl: globalSettings.bookingUrl,
    legalLinks: globalSettings.legalLinks ?? [],
    socialLinks: globalSettings.socialLinks ?? [],
  };
}

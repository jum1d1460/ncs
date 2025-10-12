import {createClient} from "@sanity/client";

// Crea el cliente de Sanity de forma tolerante: si faltan variables públicas en build,
// exponemos un cliente "no-op" que devuelve resultados vacíos para evitar fallos.
const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined) || "i95g996l";
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || "production";
const apiVersion = (import.meta.env.PUBLIC_SANITY_API_VERSION as string | undefined) || "2024-03-18";

type MinimalClient = { fetch: <T = unknown>(_q: string, _p?: Record<string, unknown>) => Promise<T> };

let sanityClient: MinimalClient;
const isTestEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';
if (projectId || isTestEnv) {
    sanityClient = createClient({
        projectId,
        dataset,
        useCdn: true,
        apiVersion
    }) as unknown as MinimalClient;
} else {
    // Cliente de respaldo: no lanza errores y devuelve estructuras vacías.
    sanityClient = {
        async fetch<T = unknown>() {
            // @ts-expect-error: devolvemos algo razonable según el tipo esperado
            return Array.isArray([] as unknown as T) ? ([] as unknown as T) : ({} as T);
        }
    } as MinimalClient;
}

export { sanityClient };

export type SocialLink = {
    type?: string;
    url?: string;
}

export type GlobalSettings = {
    siteTitle?: string;
    siteDescription?: string;
    favicon?: { asset?: { url?: string } } | null;
    ogImage?: { asset?: { url?: string } } | null;
    socialLinks?: SocialLink[];
    brand?: { logo?: { asset?: { url?: string } } & { alt?: string } } | null;
    navMain?: { label?: string; url?: string; page?: { slug?: { current?: string } }; target?: string }[];
    contact?: { phone?: string; whatsapp?: string; email?: string };
    bookingUrl?: string;
    seoFooterText?: string;
    legalLinks?: { label?: string; url?: string }[];
    defaultMeta?: {
        titleSuffix?: string;
        ogTitle?: string;
        ogDescription?: string;
    };
    blogPage?: {
        heroTitle?: string;
        heroSubtitle?: string;
        heroBackgroundImage?: { asset?: { url?: string } } | null;
        heroOverlaySettings?: {
            overlayType?: 'radial' | 'linear' | 'solid' | 'none';
            overlayColor?: string;
            overlayOpacity?: number;
            secondaryColor?: string;
            secondaryOpacity?: number;
            gradientDirection?: string;
        };
    };
}

export type BlockContact = {
    _type: 'blockContact';
    title?: string;
    subtitle?: string;
    theme?: 'light' | 'dark' | 'brand';
    form?: {
        subjectPlaceholder?: string;
        topicOptions?: string[];
        submitLabel?: string;
        disclaimer?: string;
    };
    contact?: {
        phone?: string;
        email?: string;
        address?: string;
        schedule?: string;
    };
    map?: {
        mapUrl?: string;
        title?: string;
    };
}

const GLOBAL_SETTINGS_QUERY = `*[_type == "globalSettings"][0]{
  siteTitle,
  siteDescription,
  favicon{asset->{url}},
  ogImage{asset->{url}},
  socialLinks[]{type, url},
  brand{logo{asset->{url}, alt}},
  navMain[]{label, url, target, page->{slug}},
  contact{phone, whatsapp, email},
  bookingUrl,
  seoFooterText,
  legalLinks[]{label, url},
  defaultMeta{titleSuffix, ogTitle, ogDescription},
  blogPage{
    heroTitle,
    heroSubtitle,
    heroBackgroundImage{asset->{url}},
    heroOverlaySettings{
      overlayType,
      overlayColor,
      overlayOpacity,
      secondaryColor,
      secondaryOpacity,
      gradientDirection
    }
  }
}`;

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
    siteTitle: "NCS Psicóloga Zaragoza",
    siteDescription: "Psicología para familias y profesionales en Zaragoza",
    favicon: null,
    ogImage: null,
    socialLinks: [],
    defaultMeta: {
        titleSuffix: " | NCS",
        ogTitle: "NCS Psicóloga Zaragoza",
        ogDescription: "Psicología para familias y profesionales en Zaragoza",
    }
};

export async function fetchGlobalSettings(): Promise<GlobalSettings> {
    try {
        const result = await sanityClient.fetch<GlobalSettings>(GLOBAL_SETTINGS_QUERY);
        return {
            siteTitle: result?.siteTitle ?? DEFAULT_GLOBAL_SETTINGS.siteTitle,
            siteDescription: result?.siteDescription ?? DEFAULT_GLOBAL_SETTINGS.siteDescription,
            favicon: result?.favicon ?? DEFAULT_GLOBAL_SETTINGS.favicon,
            ogImage: result?.ogImage ?? DEFAULT_GLOBAL_SETTINGS.ogImage,
            socialLinks: result?.socialLinks ?? DEFAULT_GLOBAL_SETTINGS.socialLinks,
            brand: result?.brand ?? null,
            navMain: result?.navMain ?? [],
            contact: result?.contact ?? {},
            bookingUrl: result?.bookingUrl ?? undefined,
            seoFooterText: result?.seoFooterText ?? undefined,
            legalLinks: result?.legalLinks ?? [],
            defaultMeta: {
                titleSuffix: result?.defaultMeta?.titleSuffix ?? DEFAULT_GLOBAL_SETTINGS.defaultMeta?.titleSuffix,
                ogTitle: result?.defaultMeta?.ogTitle ?? result?.siteTitle ?? DEFAULT_GLOBAL_SETTINGS.defaultMeta?.ogTitle,
                ogDescription: result?.defaultMeta?.ogDescription ?? result?.siteDescription ?? DEFAULT_GLOBAL_SETTINGS.defaultMeta?.ogDescription,
            }
        };
    } catch (_err) {
        return DEFAULT_GLOBAL_SETTINGS;
    }
}

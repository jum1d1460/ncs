import {createClient} from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
    useCdn: true,
    apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || "2024-03-18"
});

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
    defaultMeta?: {
        titleSuffix?: string;
        ogTitle?: string;
        ogDescription?: string;
    };
}

const GLOBAL_SETTINGS_QUERY = `*[_type == "globalSettings"][0]{
  siteTitle,
  siteDescription,
  favicon{asset->{url}},
  ogImage{asset->{url}},
  socialLinks[]{type, url},
  defaultMeta{titleSuffix, ogTitle, ogDescription}
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

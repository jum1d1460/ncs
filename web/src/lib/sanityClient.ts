import {createClient} from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
    useCdn: true,
    apiVersion: "2024-03-18"
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

export async function fetchGlobalSettings(): Promise<GlobalSettings> {
    try {
        const result = await sanityClient.fetch<GlobalSettings>(GLOBAL_SETTINGS_QUERY);
        return {
            siteTitle: result?.siteTitle ?? "NCS Psicóloga Zaragoza",
            siteDescription: result?.siteDescription ?? "Psicología para familias y profesionales en Zaragoza",
            favicon: result?.favicon ?? null,
            ogImage: result?.ogImage ?? null,
            socialLinks: result?.socialLinks ?? [],
            defaultMeta: {
                titleSuffix: result?.defaultMeta?.titleSuffix ?? " | NCS",
                ogTitle: result?.defaultMeta?.ogTitle ?? result?.siteTitle ?? "NCS Psicóloga Zaragoza",
                ogDescription: result?.defaultMeta?.ogDescription ?? result?.siteDescription ?? "Psicología para familias y profesionales en Zaragoza",
            }
        };
    } catch (_err) {
        return {
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
    }
}

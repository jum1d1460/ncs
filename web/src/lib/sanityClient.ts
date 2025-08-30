import {createClient} from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
    useCdn: true,
    apiVersion: "2024-03-18"
});

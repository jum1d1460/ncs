import { sanityClient } from './sanityClient';

export type BlogPost = {
    _id: string;
    title?: string;
    slug?: { current?: string };
    mainImage?: any;
    publishedAt?: string;
};

export type BlockBlogPosts = {
    _type: 'blockBlogPosts';
    title?: string;
    limit?: number;
    category?: { _ref?: string } | null;
    displayMode?: 'grid' | 'carousel';
    featuredPosts?: { _ref?: string }[];
};

const BLOG_POST_PROJECTION = `{
  _id,
  title,
  slug,
  mainImage,
  publishedAt
}`;

export async function fetchBlogPostsForBlock(block: BlockBlogPosts): Promise<BlogPost[]> {
    const n = typeof block?.limit === 'number' && block.limit! > 0 ? Math.min(block.limit!, 24) : 6;
    const cat = block?.category?._ref || null;
    const featured = (block?.featuredPosts || []).map(p => p?._ref).filter(Boolean);

    const params: Record<string, any> = {
        n,
        cat,
        featured
    };

    // Nota: filtramos por categoría si se proporciona, usando references($cat) dado que el post usa categories[]
    const query = `
    {
      "featuredMatched": *[_type == "post" && count((defined($featured) && $featured)[@ in [_id]]) > 0 && (!defined($cat) || references($cat))]
        | order(coalesce(publishedAt, _createdAt) desc) ${BLOG_POST_PROJECTION},
      "filler": *[_type == "post" && (!defined($cat) || references($cat)) && !(_id in $featured)]
        | order(coalesce(publishedAt, _createdAt) desc) ${BLOG_POST_PROJECTION}
    }`;

    const result = await sanityClient.fetch<{ featuredMatched: BlogPost[]; filler: BlogPost[] }>(query, params);

    const featuredMatched = Array.isArray(result?.featuredMatched) ? result.featuredMatched : [];
    const filler = Array.isArray(result?.filler) ? result.filler : [];

    // Combina priorizando destacados y elimina duplicados por _id
    const combined: BlogPost[] = [];
    const seenIds = new Set<string>();
    for (const post of [...featuredMatched, ...filler]) {
        const id = post?._id;
        if (!id || seenIds.has(id)) continue;
        seenIds.add(id);
        combined.push(post);
    }
    return combined.slice(0, n);
}

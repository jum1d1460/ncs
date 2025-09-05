export type HeadInput = {
  title?: string
  description?: string
  siteTitle?: string
  siteDescription?: string
  faviconUrl?: string | null
  ogImageUrl?: string | null
}

export type HeadMeta = {
  computedTitle: string
  computedDescription: string
  faviconHref: string
  faviconType: string
  ogImageUrl?: string | null
}

export function buildHeadMeta(input: HeadInput): HeadMeta {
  const fallbackTitle = 'NCS Psicóloga Zaragoza'
  const fallbackDescription = 'Psicóloga en Zaragoza - Nelly Castro Sanchez'

  const computedTitle = (input.title ?? input.siteTitle) ?? fallbackTitle
  const computedDescription = (input.description ?? input.siteDescription) ?? fallbackDescription

  const faviconHref = input.faviconUrl ?? '/favicon.svg'
  const faviconType = faviconHref.endsWith('.svg') ? 'image/svg+xml' : 'image/png'

  return {
    computedTitle,
    computedDescription,
    faviconHref,
    faviconType,
    ogImageUrl: input.ogImageUrl ?? null,
  }
}

export function buildLayoutProps(page: {title?: string} | null | undefined, settings: {
  siteTitle?: string
  siteDescription?: string
  favicon?: {asset?: {url?: string}} | null
  ogImage?: {asset?: {url?: string}} | null
} | null | undefined) {
  return {
    title: page?.title,
    siteTitle: settings?.siteTitle,
    siteDescription: settings?.siteDescription,
    faviconUrl: settings?.favicon?.asset?.url ?? null,
    ogImageUrl: settings?.ogImage?.asset?.url ?? null,
  }
}



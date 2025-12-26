/**
 * SEO utilities for generating meta tags, Open Graph, Twitter Cards, and Schema.org markup
 */

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "profile" | "article";
  siteName?: string;
  locale?: string;
}

/**
 * Generates Open Graph meta tags
 */
export function generateOpenGraphTags(data: SEOData): Record<string, string> {
  const tags: Record<string, string> = {
    "og:title": data.title,
    "og:description": data.description,
    "og:type": data.type || "website",
  };

  if (data.image) {
    tags["og:image"] = data.image;
    tags["og:image:width"] = "1200";
    tags["og:image:height"] = "630";
    tags["og:image:alt"] = data.title;
  }

  if (data.url) {
    tags["og:url"] = data.url;
  }

  if (data.siteName) {
    tags["og:site_name"] = data.siteName;
  }

  if (data.locale) {
    tags["og:locale"] = data.locale;
  }

  return tags;
}

/**
 * Generates Twitter Card meta tags
 */
export function generateTwitterCardTags(data: SEOData, cardType: "summary" | "summary_large_image" = "summary_large_image"): Record<string, string> {
  const tags: Record<string, string> = {
    "twitter:card": cardType,
    "twitter:title": data.title,
    "twitter:description": data.description,
  };

  if (data.image) {
    tags["twitter:image"] = data.image;
  }

  return tags;
}

/**
 * Generates Schema.org JSON-LD markup
 */
export function generateSchemaMarkup(data: SEOData, userData?: {
  name?: string;
  slug?: string;
  bio?: string;
  avatar?: string;
}): object {
  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": data.type === "profile" ? "ProfilePage" : "WebPage",
    name: data.title,
    description: data.description,
  };

  if (data.url) {
    baseSchema.url = data.url;
  }

  if (data.image) {
    baseSchema.image = data.image;
  }

  if (data.type === "profile" && userData) {
    baseSchema.mainEntity = {
      "@type": "Person",
      name: userData.name || userData.slug,
      description: userData.bio,
      image: userData.avatar,
      url: data.url,
    };
  }

  return baseSchema;
}

/**
 * Generates all SEO meta tags for a page
 */
export function generateAllSEOTags(data: SEOData, userData?: {
  name?: string;
  slug?: string;
  bio?: string;
  avatar?: string;
}): {
  metaTags: Record<string, string>;
  schemaMarkup: object;
} {
  const ogTags = generateOpenGraphTags(data);
  const twitterTags = generateTwitterCardTags(data);
  
  const metaTags: Record<string, string> = {
    title: data.title,
    description: data.description,
    ...ogTags,
    ...twitterTags,
  };

  const schemaMarkup = generateSchemaMarkup(data, userData);

  return {
    metaTags,
    schemaMarkup,
  };
}


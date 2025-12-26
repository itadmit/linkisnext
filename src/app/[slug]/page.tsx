import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicPageClient } from "./PublicPageClient";
import { LinkizTemplate } from "@/components/public/LinkizTemplate";
import { ModernTemplate } from "@/components/public/ModernTemplate";
import { MinimalTemplate } from "@/components/public/MinimalTemplate";
import { CardTemplate } from "@/components/public/CardTemplate";
import { generateAllSEOTags } from "@/lib/seo";
import { cache, cacheKeys } from "@/lib/cache";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const user = await prisma.user.findUnique({
    where: { slug },
    select: { 
      name: true, 
      bio: true, 
      avatar: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  if (!user) {
    return { title: "לא נמצא | Linkis" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com";
  const pageUrl = `${baseUrl}/${slug}`;
  
  const title = user.seoTitle || `${user.name || slug} | Linkis`;
  const description = user.seoDescription || user.bio || `הלינקים של ${user.name || slug}`;
  const image = user.avatar || `${baseUrl}/og-default.png`;

  const seoData = {
    title,
    description,
    image,
    url: pageUrl,
    type: "profile" as const,
    siteName: "Linkis",
    locale: "he_IL",
  };

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Linkis",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "he_IL",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: user.name || undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  // Check cache first
  const cacheKey = cacheKeys.user(slug);
  const cachedUser = cache.get<any>(cacheKey);
  
  let user: any;
  if (cachedUser && cachedUser.id) {
    user = cachedUser;
  } else {
    user = await prisma.user.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      avatar: true,
      backgroundColor: true,
      textColor: true,
      buttonColor: true,
      buttonTextColor: true,
      buttonStyle: true,
      backgroundStyle: true,
      theme: true,
      socialLinks: true,
      seoTitle: true,
      seoDescription: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      links: {
        where: {
          isActive: true,
          AND: [
            {
              OR: [
                { startsAt: null },
                { startsAt: { lte: new Date() } },
              ],
            },
            {
              OR: [
                { endsAt: null },
                { endsAt: { gte: new Date() } },
              ],
            },
          ],
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          couponCode: true,
          discountDescription: true,
        },
      },
    },
  });

    if (!user) {
      notFound();
    }

    // Cache user data for 5 minutes
    cache.set(cacheKey, user, 300);
  }

  // Check if subscription is valid
  const isActive = 
    user.subscriptionStatus === "active" ||
    (user.subscriptionStatus === "trial" && 
      user.trialEndsAt && 
      new Date() < user.trialEndsAt);

  if (!isActive) {
    notFound();
  }

  // Generate Schema.org markup
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://linkhub.com";
  const pageUrl = `${baseUrl}/${slug}`;
  const { schemaMarkup } = generateAllSEOTags(
    {
      title: user.seoTitle || `${user.name || slug} | Linkis`,
      description: user.seoDescription || user.bio || `הלינקים של ${user.name || slug}`,
      image: user.avatar || `${baseUrl}/og-default.png`,
      url: pageUrl,
      type: "profile",
    },
    {
      name: user.name || undefined,
      slug: user.slug,
      bio: user.bio || undefined,
      avatar: user.avatar || undefined,
    }
  );

  // Render based on theme/template
  const schemaScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
    />
  );

  switch (user.theme) {
    case "linkiz":
      return (
        <>
          {schemaScript}
          <LinkizTemplate user={user} />
        </>
      );
    case "modern":
      return (
        <>
          {schemaScript}
          <ModernTemplate user={user} />
        </>
      );
    case "minimal":
      return (
        <>
          {schemaScript}
          <MinimalTemplate user={user} />
        </>
      );
    case "card":
      return (
        <>
          {schemaScript}
          <CardTemplate user={user} />
        </>
      );
    default:
      return (
        <>
          {schemaScript}
          <PublicPageClient user={user} />
        </>
      );
  }
}

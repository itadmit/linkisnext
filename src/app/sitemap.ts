import { MetadataRoute } from "next";

// Mark as dynamic to avoid build-time database calls
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Base pages (static)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Try to get user pages, but don't fail if database is unavailable
  try {
    const { prisma } = await import("@/lib/prisma");
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { subscriptionStatus: "active" },
          { subscriptionStatus: "trial" },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const userPages = users.map((user) => ({
      url: `${baseUrl}/${user.slug}`,
      lastModified: user.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...userPages];
  } catch (error) {
    // Return only static pages if database is unavailable
    return staticPages;
  }
}


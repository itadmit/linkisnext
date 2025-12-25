import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PublicPageClient } from "./PublicPageClient";
import { LinkizTemplate } from "@/components/public/LinkizTemplate";

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

  const title = user.seoTitle || `${user.name || slug} | Linkis`;
  const description = user.seoDescription || user.bio || `הלינקים של ${user.name || slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: user.avatar ? [user.avatar] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: user.avatar ? [user.avatar] : [],
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;

  const user = await prisma.user.findUnique({
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

  // Check if subscription is valid
  const isActive = 
    user.subscriptionStatus === "active" ||
    (user.subscriptionStatus === "trial" && 
      user.trialEndsAt && 
      new Date() < user.trialEndsAt);

  if (!isActive) {
    notFound();
  }

  // Render based on theme/template
  if (user.theme === "linkiz") {
    return <LinkizTemplate user={user} />;
  }

  return <PublicPageClient user={user} />;
}

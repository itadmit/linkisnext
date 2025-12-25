import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LandingPageClient } from "./LandingPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const landingPage = await prisma.landingPage.findFirst({
    where: { slug, status: "published" },
    select: {
      name: true,
      seoTitle: true,
      seoDescription: true,
      seoImage: true,
    },
  });

  if (!landingPage) {
    return { title: "לא נמצא | Linkis" };
  }

  const title = landingPage.seoTitle || landingPage.name;
  const description = landingPage.seoDescription || `דף נחיתה - ${landingPage.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: landingPage.seoImage ? [landingPage.seoImage] : [],
      type: "website",
    },
  };
}

export default async function PublicLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const landingPage = await prisma.landingPage.findFirst({
    where: { slug, status: "published" },
  });

  if (!landingPage) {
    notFound();
  }

  // Track pageview
  try {
    await prisma.landingPageAnalytics.create({
      data: {
        landingPageId: landingPage.id,
        type: "pageview",
      },
    });

    // Update views count
    await prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to track pageview:", error);
  }

  return <LandingPageClient landingPage={landingPage} />;
}


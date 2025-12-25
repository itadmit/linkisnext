import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get a specific landing page
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { id },
    });

    if (!landingPage || landingPage.userId !== session.user.id) {
      return NextResponse.json({ error: "דף נחיתה לא נמצא" }, { status: 404 });
    }

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("Get landing page error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת דף הנחיתה" }, { status: 500 });
  }
}

// Update a landing page
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Check if landing page belongs to user
    const existingPage = await prisma.landingPage.findUnique({
      where: { id },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return NextResponse.json({ error: "דף נחיתה לא נמצא" }, { status: 404 });
    }

    const data = await req.json();

    // If changing slug, check if it's available
    if (data.slug && data.slug !== existingPage.slug) {
      const slugExists = await prisma.landingPage.findUnique({
        where: {
          userId_slug: {
            userId: session.user.id,
            slug: data.slug,
          },
        },
      });

      if (slugExists) {
        return NextResponse.json({ error: "הסלאג כבר תפוס" }, { status: 400 });
      }
    }

    const landingPage = await prisma.landingPage.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sections !== undefined && { sections: typeof data.sections === 'string' ? data.sections : JSON.stringify(data.sections) }),
        ...(data.backgroundColor !== undefined && { backgroundColor: data.backgroundColor }),
        ...(data.textColor !== undefined && { textColor: data.textColor }),
        ...(data.buttonColor !== undefined && { buttonColor: data.buttonColor }),
        ...(data.buttonTextColor !== undefined && { buttonTextColor: data.buttonTextColor }),
        ...(data.fontFamily !== undefined && { fontFamily: data.fontFamily }),
        ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
        ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
        ...(data.seoImage !== undefined && { seoImage: data.seoImage }),
      },
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("Update landing page error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון דף הנחיתה" }, { status: 500 });
  }
}

// Delete a landing page
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
    }

    // Check if landing page belongs to user
    const existingPage = await prisma.landingPage.findUnique({
      where: { id },
    });

    if (!existingPage || existingPage.userId !== session.user.id) {
      return NextResponse.json({ error: "דף נחיתה לא נמצא" }, { status: 404 });
    }

    await prisma.landingPage.delete({
      where: { id },
    });

    return NextResponse.json({ message: "דף הנחיתה נמחק" });
  } catch (error) {
    console.error("Delete landing page error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת דף הנחיתה" }, { status: 500 });
  }
}


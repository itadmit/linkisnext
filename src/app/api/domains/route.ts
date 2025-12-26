import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth, apiHandler } from "@/lib/api/middleware";
import { successResponse, errorResponse } from "@/lib/api/response";
import { isValidDomain, normalizeDomain, generateDNSVerificationRecord } from "@/lib/domains";
import { logger } from "@/lib/logger";

/**
 * Get user's custom domains
 */
export const GET = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  const user = await prisma.user.findUnique({
    where: { id: auth.context.userId },
    select: {
      id: true,
      slug: true,
      // TODO: Add customDomain field to User model
      // customDomain: true,
      // domainVerificationCode: true,
      // domainVerified: true,
    },
  });

  if (!user) {
    return errorResponse("משתמש לא נמצא", 404);
  }

  // For now, return empty array until we add domain fields to schema
  return NextResponse.json(successResponse([]));
});

/**
 * Add/update custom domain
 */
export const POST = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  const body = await req.json();
  const { domain } = body;

  if (!domain) {
    return errorResponse("נדרש domain", 400);
  }

  // Validate domain
  if (!isValidDomain(domain)) {
    return errorResponse("Domain לא תקין", 400);
  }

  const normalizedDomain = normalizeDomain(domain);

  // Check if domain is already in use
  // TODO: Query database for existing domain usage
  // const existingUser = await prisma.user.findFirst({
  //   where: {
  //     customDomain: normalizedDomain,
  //     NOT: { id: auth.context.userId },
  //   },
  // });

  // if (existingUser) {
  //   return errorResponse("Domain כבר בשימוש", 400);
  // }

  // Generate verification code
  const verificationCode = generateDNSVerificationRecord();

  // TODO: Update user with custom domain
  // await prisma.user.update({
  //   where: { id: auth.context.userId },
  //   data: {
  //     customDomain: normalizedDomain,
  //     domainVerificationCode: verificationCode,
  //     domainVerified: false,
  //   },
  // });

  logger.info("Custom domain added", {
    userId: auth.context.userId,
    domain: normalizedDomain,
  });

  return NextResponse.json(
    successResponse(
      {
        domain: normalizedDomain,
        verificationCode,
        verified: false,
        instructions: {
          cname: {
            name: normalizedDomain,
            value: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "") || "linkhub.com",
            type: "CNAME",
          },
          txt: {
            name: `_linkhub-verification.${normalizedDomain}`,
            value: verificationCode,
            type: "TXT",
          },
        },
      },
      "Domain נוסף בהצלחה. יש להגדיר את ה-DNS records ולאמת את ה-domain."
    )
  );
});

/**
 * Verify domain ownership
 */
export const PUT = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  const body = await req.json();
  const { domain } = body;

  if (!domain) {
    return errorResponse("נדרש domain", 400);
  }

  // TODO: Verify domain DNS configuration
  // const user = await prisma.user.findUnique({
  //   where: { id: auth.context.userId },
  // });

  // if (!user || user.customDomain !== normalizeDomain(domain)) {
  //   return errorResponse("Domain לא נמצא", 404);
  // }

  // const validation = await validateDNSConfiguration(domain);
  
  // if (!validation.valid) {
  //   return errorResponse(validation.error || "Domain verification failed", 400);
  // }

  // await prisma.user.update({
  //   where: { id: auth.context.userId },
  //   data: { domainVerified: true },
  // });

  return NextResponse.json(
    successResponse(
      { verified: true },
      "Domain אומת בהצלחה"
    )
  );
});

/**
 * Remove custom domain
 */
export const DELETE = apiHandler(async (req) => {
  const auth = await requireAuth(req);
  if (!auth.success) return auth.response;

  const body = await req.json();
  const { domain } = body;

  // TODO: Remove domain from user
  // await prisma.user.update({
  //   where: { id: auth.context.userId },
  //   data: {
  //     customDomain: null,
  //     domainVerificationCode: null,
  //     domainVerified: false,
  //   },
  // });

  logger.info("Custom domain removed", {
    userId: auth.context.userId,
    domain,
  });

  return NextResponse.json(
    successResponse(null, "Domain הוסר בהצלחה")
  );
});


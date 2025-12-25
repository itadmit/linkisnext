-- CreateTable
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#000000',
    "buttonColor" TEXT NOT NULL DEFAULT '#6366f1',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "fontFamily" TEXT NOT NULL DEFAULT 'rubik',
    "sections" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoImage" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LandingPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "landingPageId" TEXT NOT NULL,
    "formData" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LandingPageAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "landingPageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "eventData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LandingPageAnalytics_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "backgroundColor" TEXT NOT NULL DEFAULT '#1a1a2e',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "buttonColor" TEXT NOT NULL DEFAULT '#6366f1',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "buttonStyle" TEXT NOT NULL DEFAULT 'rounded',
    "backgroundStyle" TEXT NOT NULL DEFAULT 'gradient',
    "fontFamily" TEXT NOT NULL DEFAULT 'rubik',
    "socialLinks" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'basic',
    "trialEndsAt" DATETIME,
    "subscriptionId" TEXT,
    "subscriptionEndsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "backgroundColor", "backgroundStyle", "bio", "buttonColor", "buttonStyle", "buttonTextColor", "createdAt", "email", "fontFamily", "id", "name", "password", "seoDescription", "seoTitle", "slug", "socialLinks", "subscriptionEndsAt", "subscriptionId", "subscriptionStatus", "textColor", "theme", "trialEndsAt", "updatedAt") SELECT "avatar", "backgroundColor", "backgroundStyle", "bio", "buttonColor", "buttonStyle", "buttonTextColor", "createdAt", "email", "fontFamily", "id", "name", "password", "seoDescription", "seoTitle", "slug", "socialLinks", "subscriptionEndsAt", "subscriptionId", "subscriptionStatus", "textColor", "theme", "trialEndsAt", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LandingPage_userId_idx" ON "LandingPage"("userId");

-- CreateIndex
CREATE INDEX "LandingPage_status_idx" ON "LandingPage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_userId_slug_key" ON "LandingPage"("userId", "slug");

-- CreateIndex
CREATE INDEX "Lead_landingPageId_idx" ON "Lead"("landingPageId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "LandingPageAnalytics_landingPageId_idx" ON "LandingPageAnalytics"("landingPageId");

-- CreateIndex
CREATE INDEX "LandingPageAnalytics_type_idx" ON "LandingPageAnalytics"("type");

-- CreateIndex
CREATE INDEX "LandingPageAnalytics_createdAt_idx" ON "LandingPageAnalytics"("createdAt");

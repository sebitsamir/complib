-- Baseline schema for CompLib (fresh databases)

-- Enums
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
CREATE TYPE "ComponentTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');
CREATE TYPE "ComponentLayer" AS ENUM ('primitives', 'patterns', 'sections', 'templates');

-- Users & audit
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT,
    "stripeCustomerId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "ip" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Catalog (filesystem mirror)
CREATE TABLE "CatalogComponent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tier" "ComponentTier" NOT NULL DEFAULT 'FREE',
    "layer" "ComponentLayer" NOT NULL,
    "category" TEXT NOT NULL,
    "problemTags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "defaultStyleId" TEXT NOT NULL DEFAULT 'default',
    "filesystemPath" TEXT NOT NULL,
    "searchText" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CatalogComponent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CatalogComponent_slug_key" ON "CatalogComponent"("slug");
CREATE INDEX "CatalogComponent_layer_category_idx" ON "CatalogComponent"("layer", "category");
CREATE INDEX "CatalogComponent_tier_idx" ON "CatalogComponent"("tier");
CREATE INDEX "CatalogComponent_searchText_idx" ON "CatalogComponent"("searchText");

CREATE TABLE "CatalogVariant" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "filesystemPath" TEXT NOT NULL,
    "manifest" JSONB NOT NULL,
    "searchText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CatalogVariant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CatalogVariant_componentId_styleId_key" ON "CatalogVariant"("componentId", "styleId");
CREATE INDEX "CatalogVariant_styleId_idx" ON "CatalogVariant"("styleId");
CREATE INDEX "CatalogVariant_searchText_idx" ON "CatalogVariant"("searchText");

CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

CREATE TABLE "CatalogComponentTag" (
    "componentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "CatalogComponentTag_pkey" PRIMARY KEY ("componentId","tagId")
);

CREATE INDEX "CatalogComponentTag_tagId_idx" ON "CatalogComponentTag"("tagId");

CREATE TABLE "UserFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserFavorite_userId_componentId_key" ON "UserFavorite"("userId", "componentId");
CREATE INDEX "UserFavorite_userId_createdAt_idx" ON "UserFavorite"("userId", "createdAt");

CREATE TABLE "UserRecent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRecent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserRecent_userId_componentId_key" ON "UserRecent"("userId", "componentId");
CREATE INDEX "UserRecent_userId_lastUsedAt_idx" ON "UserRecent"("userId", "lastUsedAt");

CREATE TABLE "UserCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserCollection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserCollection_userId_slug_key" ON "UserCollection"("userId", "slug");
CREATE INDEX "UserCollection_userId_idx" ON "UserCollection"("userId");

CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CollectionItem_collectionId_componentId_key" ON "CollectionItem"("collectionId", "componentId");
CREATE INDEX "CollectionItem_collectionId_position_idx" ON "CollectionItem"("collectionId", "position");

CREATE TABLE "DownloadEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "componentId" TEXT NOT NULL,
    "styleId" TEXT,
    "framework" TEXT NOT NULL DEFAULT 'vanilla',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DownloadEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DownloadEvent_componentId_createdAt_idx" ON "DownloadEvent"("componentId", "createdAt");
CREATE INDEX "DownloadEvent_userId_createdAt_idx" ON "DownloadEvent"("userId", "createdAt");

CREATE TABLE "ComponentView" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "userId" TEXT,
    "styleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComponentView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ComponentView_componentId_createdAt_idx" ON "ComponentView"("componentId", "createdAt");

-- Foreign keys
ALTER TABLE "CatalogVariant" ADD CONSTRAINT "CatalogVariant_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CatalogComponentTag" ADD CONSTRAINT "CatalogComponentTag_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CatalogComponentTag" ADD CONSTRAINT "CatalogComponentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserRecent" ADD CONSTRAINT "UserRecent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserRecent" ADD CONSTRAINT "UserRecent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "UserCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComponentView" ADD CONSTRAINT "ComponentView_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

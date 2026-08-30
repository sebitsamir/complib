-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ComponentTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ComponentLayer" AS ENUM ('primitives', 'patterns', 'sections', 'templates');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID', 'PAUSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT,
    "stripeCustomerId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogComponentTag" (
    "componentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "CatalogComponentTag_pkey" PRIMARY KEY ("componentId","tagId")
);

-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRecent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "ComponentView" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "userId" TEXT,
    "styleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentRevision" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "manifestHash" TEXT NOT NULL,
    "artifactPath" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedBy" TEXT,
    "notes" TEXT,

    CONSTRAINT "ComponentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDependency" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,

    CONSTRAINT "ComponentDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentFramework" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "generatedPath" TEXT,
    "lastBuiltAt" TIMESTAMP(3),

    CONSTRAINT "ComponentFramework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentExample" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "html" TEXT NOT NULL DEFAULT '',
    "description" TEXT,

    CONSTRAINT "ComponentExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentDocumentation" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT '',
    "accessibility" TEXT NOT NULL DEFAULT '',
    "installation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ComponentDocumentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionEvent" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogComponent_slug_key" ON "CatalogComponent"("slug");

-- CreateIndex
CREATE INDEX "CatalogComponent_layer_category_idx" ON "CatalogComponent"("layer", "category");

-- CreateIndex
CREATE INDEX "CatalogComponent_tier_idx" ON "CatalogComponent"("tier");

-- CreateIndex
CREATE INDEX "CatalogComponent_searchText_idx" ON "CatalogComponent"("searchText");

-- CreateIndex
CREATE INDEX "CatalogVariant_styleId_idx" ON "CatalogVariant"("styleId");

-- CreateIndex
CREATE INDEX "CatalogVariant_searchText_idx" ON "CatalogVariant"("searchText");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogVariant_componentId_styleId_key" ON "CatalogVariant"("componentId", "styleId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "CatalogComponentTag_tagId_idx" ON "CatalogComponentTag"("tagId");

-- CreateIndex
CREATE INDEX "UserFavorite_userId_createdAt_idx" ON "UserFavorite"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_componentId_key" ON "UserFavorite"("userId", "componentId");

-- CreateIndex
CREATE INDEX "UserRecent_userId_lastUsedAt_idx" ON "UserRecent"("userId", "lastUsedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecent_userId_componentId_key" ON "UserRecent"("userId", "componentId");

-- CreateIndex
CREATE INDEX "UserCollection_userId_idx" ON "UserCollection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCollection_userId_slug_key" ON "UserCollection"("userId", "slug");

-- CreateIndex
CREATE INDEX "CollectionItem_collectionId_position_idx" ON "CollectionItem"("collectionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_collectionId_componentId_key" ON "CollectionItem"("collectionId", "componentId");

-- CreateIndex
CREATE INDEX "DownloadEvent_componentId_createdAt_idx" ON "DownloadEvent"("componentId", "createdAt");

-- CreateIndex
CREATE INDEX "DownloadEvent_userId_createdAt_idx" ON "DownloadEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ComponentView_componentId_createdAt_idx" ON "ComponentView"("componentId", "createdAt");

-- CreateIndex
CREATE INDEX "ComponentRevision_componentId_publishedAt_idx" ON "ComponentRevision"("componentId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentRevision_componentId_version_key" ON "ComponentRevision"("componentId", "version");

-- CreateIndex
CREATE INDEX "ComponentDependency_componentId_idx" ON "ComponentDependency"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentFramework_componentId_framework_key" ON "ComponentFramework"("componentId", "framework");

-- CreateIndex
CREATE INDEX "ComponentExample_componentId_idx" ON "ComponentExample"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentDocumentation_componentId_key" ON "ComponentDocumentation"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionEvent_stripeEventId_key" ON "SubscriptionEvent"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_externalId_key" ON "WebhookEvent"("provider", "externalId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogVariant" ADD CONSTRAINT "CatalogVariant_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogComponentTag" ADD CONSTRAINT "CatalogComponentTag_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogComponentTag" ADD CONSTRAINT "CatalogComponentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecent" ADD CONSTRAINT "UserRecent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecent" ADD CONSTRAINT "UserRecent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "UserCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentView" ADD CONSTRAINT "ComponentView_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentRevision" ADD CONSTRAINT "ComponentRevision_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentDependency" ADD CONSTRAINT "ComponentDependency_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentFramework" ADD CONSTRAINT "ComponentFramework_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentExample" ADD CONSTRAINT "ComponentExample_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentDocumentation" ADD CONSTRAINT "ComponentDocumentation_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionEvent" ADD CONSTRAINT "SubscriptionEvent_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Full-text search (catalog explorer ranking)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "CatalogComponent" ADD COLUMN "searchVector" tsvector;

CREATE INDEX "CatalogComponent_searchVector_idx"
  ON "CatalogComponent" USING GIN ("searchVector");

CREATE INDEX "CatalogComponent_name_trgm_idx"
  ON "CatalogComponent" USING GIN ("name" gin_trgm_ops);

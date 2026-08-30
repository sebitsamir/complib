-- Phase 2: Component registry tables (revisions, dependencies, frameworks, examples, docs)

CREATE TABLE "ComponentRevision" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "manifestHash" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedBy" TEXT,
    "notes" TEXT,
    CONSTRAINT "ComponentRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ComponentRevision_componentId_version_key" ON "ComponentRevision"("componentId", "version");
CREATE INDEX "ComponentRevision_componentId_publishedAt_idx" ON "ComponentRevision"("componentId", "publishedAt");

CREATE TABLE "ComponentDependency" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    CONSTRAINT "ComponentDependency_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ComponentDependency_componentId_idx" ON "ComponentDependency"("componentId");

CREATE TABLE "ComponentFramework" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "generatedPath" TEXT,
    "lastBuiltAt" TIMESTAMP(3),
    CONSTRAINT "ComponentFramework_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ComponentFramework_componentId_framework_key" ON "ComponentFramework"("componentId", "framework");

CREATE TABLE "ComponentExample" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "html" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    CONSTRAINT "ComponentExample_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ComponentExample_componentId_idx" ON "ComponentExample"("componentId");

CREATE TABLE "ComponentDocumentation" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT '',
    "accessibility" TEXT NOT NULL DEFAULT '',
    "installation" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "ComponentDocumentation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ComponentDocumentation_componentId_key" ON "ComponentDocumentation"("componentId");

ALTER TABLE "ComponentRevision" ADD CONSTRAINT "ComponentRevision_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComponentDependency" ADD CONSTRAINT "ComponentDependency_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComponentFramework" ADD CONSTRAINT "ComponentFramework_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComponentExample" ADD CONSTRAINT "ComponentExample_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ComponentDocumentation" ADD CONSTRAINT "ComponentDocumentation_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CatalogComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

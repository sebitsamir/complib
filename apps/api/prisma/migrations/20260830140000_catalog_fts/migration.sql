-- Phase 7: weighted full-text search for catalog components

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "CatalogComponent" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

CREATE INDEX IF NOT EXISTS "CatalogComponent_searchVector_idx"
  ON "CatalogComponent" USING GIN ("searchVector");

CREATE INDEX IF NOT EXISTS "CatalogComponent_name_trgm_idx"
  ON "CatalogComponent" USING GIN ("name" gin_trgm_ops);

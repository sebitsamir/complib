-- Phase 3: revision artifact snapshots path on registry revisions

ALTER TABLE "ComponentRevision" ADD COLUMN "artifactPath" TEXT;

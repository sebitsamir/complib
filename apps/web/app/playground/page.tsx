import { Suspense } from "react";
import SiteHeader from "@/layouts/Header";
import PlaygroundClientEnterprise from "./PlaygroundClientEnterpriseV2";

function PlaygroundFallback() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-muted/10">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-blue-600" />
        <p className="text-xs font-medium text-muted-foreground">Loading workbench…</p>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground">
      <SiteHeader title="Playground" />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<PlaygroundFallback />}>
          <PlaygroundClientEnterprise />
        </Suspense>
      </div>
    </div>
  );
}

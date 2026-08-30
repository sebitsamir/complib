export default function LibrarySidebarSkeleton() {
  return (
    <aside className="flex h-full w-[min(100%,22rem)] shrink-0 flex-col border-r border-border bg-background">
      <div className="animate-pulse space-y-3 border-b border-border p-4">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-9 w-full rounded-lg bg-muted" />
        <div className="h-9 w-full rounded-lg bg-muted" />
        <div className="h-8 w-full rounded-lg bg-muted" />
      </div>
      <div className="grid min-h-0 flex-1 animate-pulse grid-cols-[5rem_minmax(0,1fr)]">
        <div className="space-y-2 border-r border-border/70 p-1.5">
          <div className="mx-auto h-9 w-9 rounded-lg bg-muted" />
          <div className="mx-auto h-9 w-9 rounded-lg bg-muted" />
        </div>
        <div className="p-3">
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    </aside>
  );
}

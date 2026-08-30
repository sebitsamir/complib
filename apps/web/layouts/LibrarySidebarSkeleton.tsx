export default function LibrarySidebarSkeleton() {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <div className="animate-pulse space-y-3 border-b border-border p-4">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-9 w-full rounded-lg bg-muted" />
        <div className="h-9 w-full rounded-lg bg-muted" />
        <div className="h-8 w-full rounded-lg bg-muted" />
      </div>
      <div className="flex min-h-0 flex-1 animate-pulse flex-col gap-2 p-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-full rounded-lg bg-muted" />
        ))}
      </div>
    </aside>
  );
}

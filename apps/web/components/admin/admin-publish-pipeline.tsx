import type { PublishPipelineStep } from "@complib/component-validation";

const STEP_LABELS: Record<PublishPipelineStep, string> = {
  metadata: "Metadata",
  taxonomy: "Taxonomy",
  source: "Source",
  variants: "Variants",
  styles: "Styles",
  frameworks: "Frameworks",
  accessibility: "Accessibility",
};

const STEP_ORDER: PublishPipelineStep[] = [
  "metadata",
  "taxonomy",
  "source",
  "variants",
  "styles",
  "frameworks",
  "accessibility",
];

function statusClass(status: string): string {
  switch (status) {
    case "pass":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "warn":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "fail":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
    default:
      return "border-border/60 bg-muted/20 text-muted-foreground";
  }
}

export function AdminPublishPipeline({
  steps,
}: {
  steps?: Record<PublishPipelineStep, "pass" | "fail" | "warn" | "skip">;
}) {
  if (!steps) return null;

  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {STEP_ORDER.map((step) => {
        const status = steps[step];
        if (status === "skip") return null;
        return (
          <li
            key={step}
            className={`rounded-lg border px-3 py-2 text-xs font-medium ${statusClass(status)}`}
          >
            {STEP_LABELS[step]} — {status}
          </li>
        );
      })}
    </ol>
  );
}

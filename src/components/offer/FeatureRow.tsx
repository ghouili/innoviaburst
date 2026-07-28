import type { LucideIcon } from "lucide-react";

/**
 * One icon + (optional bold lead) + body row.
 *
 * Shared by the Included / Out-of-scope columns, "What we need from you" and the
 * metric list so those three read as one system rather than three bespoke list
 * styles (spec P1-7).
 *
 * `title` is optional: the offers whose copy hasn't been rewritten yet supply a
 * single string and render as a plain row, so the component degrades to the
 * simpler shape instead of forcing a lead sentence that doesn't exist.
 */
export function FeatureRow({
  Icon,
  iconClassName = "text-accent",
  title,
  body,
  muted = false,
}: {
  Icon: LucideIcon;
  iconClassName?: string;
  title?: string;
  body: string;
  muted?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconClassName}`} aria-hidden="true" />
      <span className="min-w-0 text-sm leading-snug">
        {title && (
          <span className={muted ? "font-semibold text-muted-foreground" : "font-semibold text-foreground"}>
            {title}{" "}
          </span>
        )}
        <span className="text-muted-foreground">{body}</span>
      </span>
    </li>
  );
}

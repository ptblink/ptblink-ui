/**
 * A folder-style tab that labels the table beneath it. It shares the table's
 * surface colour and border with top corners rounded to match (rounded-2xl), so
 * it reads as a physical tab rising out of the table. Place it immediately before
 * a bordered table/DataTable; its `border-b-0 -mb-px` sit it flush on the table's
 * top edge. Optional `count` renders a small tally badge.
 */
export default function FolderTab({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="relative z-10 flex">
      <div className="-mb-px ml-6 inline-flex items-center gap-2 rounded-t-2xl border border-b-0 border-[var(--color-line)] bg-[var(--color-bg-elev)] px-5 py-2 text-sm font-medium text-[var(--color-brand)]">
        <span>{children}</span>
        {typeof count === "number" && (
          <span className="rounded-full bg-[var(--color-brand)]/15 px-2 py-0.5 text-xs tabular-nums text-[var(--color-brand)]">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}

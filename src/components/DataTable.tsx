/**
 * The staff/admin data-table family — the exact organisation of the
 * tech-centre visitors table, extracted so every list surface (visitors,
 * centres, HubSpot contacts, …) shares one look: mono uppercase section label
 * with a count, a bordered rounded container, a mono uppercase header row,
 * hairline row separators with hover, and row-level pill actions.
 *
 * Composable, not config-driven: `DataTable` owns the container + header,
 * consumers render their own `DataRow`/`DataCell` rows so cells can hold
 * links, pills, forms — anything.
 *
 * All server-safe (no client state).
 */

export type DataColumn = {
  label: string;
  align?: "left" | "right";
  /** Hide the column below this breakpoint (applies to matching cells too). */
  hideBelow?: "md" | "lg";
  /** Header is present for a11y but visually empty (action columns). */
  srOnly?: boolean;
};

const hideClass = (hideBelow?: "md" | "lg") =>
  hideBelow === "md" ? "hidden md:table-cell" : hideBelow === "lg" ? "hidden lg:table-cell" : "";

/** Mono uppercase section label with an optional dimmed count — sits above a DataTable. */
export function SectionLabel({
  children,
  count,
  className = "",
}: {
  children: React.ReactNode;
  count?: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-[11px] font-mono uppercase tracking-widest text-[var(--color-ink-mute)] ${className}`}>
      {children}
      {count !== undefined && <span className="ml-2 text-[var(--color-ink-mute)]/60">{count}</span>}
    </h2>
  );
}

export default function DataTable({
  columns,
  children,
  className = "",
}: {
  columns: DataColumn[];
  /** `DataRow` elements (the tbody content). */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] overflow-hidden ${className}`}
    >
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink-mute)] border-b border-[var(--color-line)]">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-5 py-4 font-light ${col.align === "right" ? "text-right" : ""} ${hideClass(col.hideBelow)}`}
                aria-label={col.srOnly ? col.label : undefined}
              >
                {col.srOnly ? null : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** One table row — hairline separator + hover, matching the visitors table. */
export function DataRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-bg-elev-2)] transition ${className}`}
    >
      {children}
    </tr>
  );
}

/** One cell — standard padding; mirror the column's align/hideBelow here. */
export function DataCell({
  children,
  align,
  hideBelow,
  className = "",
}: {
  children?: React.ReactNode;
  align?: "left" | "right";
  hideBelow?: "md" | "lg";
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 ${align === "right" ? "text-right" : ""} ${hideClass(hideBelow)} ${className}`}>
      {children}
    </td>
  );
}

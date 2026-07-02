/**
 * The one inline banner for success / warning / error notices — kiosk steps and
 * staff pages share it so the tones never drift. Server-safe.
 * (`ErrorBox` is the red kiosk-form variant; this covers the
 * amber/emerald/rose trio used everywhere else.)
 */
const TONES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-200",
} as const;

export default function Notice({
  tone = "warn",
  size = "sm",
  className = "",
  children,
}: {
  tone?: keyof typeof TONES;
  /** sm = kiosk steps (text-body-sm), md = staff pages (text-body). */
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 font-light ${size === "md" ? "text-body" : "text-body-sm"} ${TONES[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

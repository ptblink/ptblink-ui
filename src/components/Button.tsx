import Link from "next/link";

/**
 * The button primitive. Token-driven, restrained sizing — a kiosk action,
 * not a billboard. Renders a Next `Link` when `href` is set, otherwise a
 * native `<button>` (so it works as a form submit). `arrow` adds a trailing
 * chevron that nudges on hover.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
};

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };
type AsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & { href: string };

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-body-sm gap-1.5",
  md: "px-5 py-2.5 text-body-sm gap-2",
  lg: "px-6 py-3 text-body gap-2",
};

const VARIANTS: Record<ButtonVariant, string> = {
  // Filled blue — the key action. A soft brand glow makes it the obvious
  // primary so it never competes with a neighbouring secondary button.
  primary:
    "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-soft)] active:bg-[var(--color-brand-dim)] shadow-[0_12px_30px_-12px_rgba(44,144,207,0.7)]",
  secondary:
    "border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:bg-[var(--color-bg-elev)]",
  ghost: "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]",
};

export default function Button(props: AsButton | AsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    arrow = false,
    className = "",
  } = props;

  const classes = [
    "group inline-flex items-center justify-center rounded-full font-medium",
    "transition active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none",
    SIZES[size],
    VARIANTS[variant],
    className,
  ].join(" ");

  const inner = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, arrow: _a, className: _c, children: _ch, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, arrow: _a, className: _c, children: _ch, href: _h, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

export type DeckSlide = {
  /** The slide body. */
  node: React.ReactNode;
  /** Short label shown in the "ENTER · …" hint pill when this slide is selectable. */
  cta?: string;
  /** Fired when the visitor presses Enter while this slide is current. */
  onEnter?: () => void;
};

export type DeckSection = {
  id: string;
  label?: string;
  slides: DeckSlide[];
};

type Dir = "right" | "left" | "down" | "up";
type Pos = { sec: number; sub: number; dir: Dir };

type Action =
  | { type: "go-section"; n: number; max: number }
  | { type: "go-sub"; n: number; max: number }
  | { type: "roll"; forward: boolean; subCount: number; sectionCount: number }
  | { type: "jump-start" }
  | { type: "jump-end"; lastSec: number; lastSub: number };

function reducer(state: Pos, action: Action): Pos {
  switch (action.type) {
    case "go-section": {
      const clamped = Math.max(0, Math.min(action.max, action.n));
      if (clamped === state.sec) return state;
      return { sec: clamped, sub: 0, dir: clamped > state.sec ? "right" : "left" };
    }
    case "go-sub": {
      const clamped = Math.max(0, Math.min(action.max, action.n));
      if (clamped === state.sub) return state;
      return { ...state, sub: clamped, dir: clamped > state.sub ? "down" : "up" };
    }
    case "roll": {
      if (action.forward) {
        if (state.sub < action.subCount - 1) {
          return { ...state, sub: state.sub + 1, dir: "down" };
        }
        if (state.sec < action.sectionCount - 1) {
          return { sec: state.sec + 1, sub: 0, dir: "right" };
        }
        return state;
      }
      if (state.sub > 0) {
        return { ...state, sub: state.sub - 1, dir: "up" };
      }
      if (state.sec > 0) {
        return { sec: state.sec - 1, sub: 0, dir: "left" };
      }
      return state;
    }
    case "jump-start":
      if (state.sec === 0 && state.sub === 0) return state;
      return { sec: 0, sub: 0, dir: "left" };
    case "jump-end":
      if (state.sec === action.lastSec && state.sub === action.lastSub) return state;
      return { sec: action.lastSec, sub: action.lastSub, dir: "right" };
  }
}

/**
 * 2D slide deck driven by a presentation remote.
 *
 * ← → sections · ↑ ↓ sub-slides · PageUp/Down (and Space) roll through everything
 * Home/End jump to ends · Enter activates the current sub-slide's `onEnter`
 * Escape closes any open dialog, else navigates to the previous page.
 */
export default function SlideDeck({
  sections,
  subDots = true,
}: {
  sections: DeckSection[];
  /** Hide the sub-slide counter pill ("01 / 02" + dots) — e.g. on remote-driven kiosk screens. */
  subDots?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [{ sec, sub, dir }, dispatch] = useReducer(reducer, {
    sec: 0,
    sub: 0,
    dir: "right" as Dir,
  });

  const currentSection = sections[sec];
  const subCount = currentSection?.slides.length ?? 0;
  const currentSlide = currentSection?.slides[sub];

  const goSection = useCallback(
    (n: number) => dispatch({ type: "go-section", n, max: sections.length - 1 }),
    [sections.length]
  );

  const goSub = useCallback(
    (n: number) => dispatch({ type: "go-sub", n, max: subCount - 1 }),
    [subCount]
  );

  const goRoll = useCallback(
    (forward: boolean) =>
      dispatch({
        type: "roll",
        forward,
        subCount,
        sectionCount: sections.length,
      }),
    [subCount, sections.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          goSection(sec + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          goSection(sec - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          goSub(sub + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          goSub(sub - 1);
          break;
        case "PageDown":
        case " ":
        case "Spacebar":
          e.preventDefault();
          goRoll(true);
          break;
        case "PageUp":
          e.preventDefault();
          goRoll(false);
          break;
        case "Home":
          e.preventDefault();
          dispatch({ type: "jump-start" });
          break;
        case "End":
          e.preventDefault();
          dispatch({
            type: "jump-end",
            lastSec: sections.length - 1,
            lastSub: sections[sections.length - 1].slides.length - 1,
          });
          break;
        case "Enter":
          if (currentSlide?.onEnter) {
            e.preventDefault();
            currentSlide.onEnter();
          }
          break;
        case "Escape": {
          if (document.querySelector('[aria-modal="true"]')) return;
          e.preventDefault();
          if (pathname === "/") return;
          router.back();
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sec, sub, sections, goSection, goSub, goRoll, currentSlide, pathname, router]);

  const atFirstSection = sec === 0;
  const atLastSection = sec === sections.length - 1;
  const atFirstSub = sub === 0;
  const atLastSub = sub === subCount - 1;

  return (
    <div className="fixed inset-0 z-40 bg-[var(--color-bg)] overflow-hidden">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={`${sec}-${sub}`}
          custom={dir}
          className="absolute inset-0"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        >
          {currentSlide?.node}
        </motion.div>
      </AnimatePresence>

      <HomePill />

      <SideArrow
        side="left"
        disabled={atFirstSection}
        onClick={() => goSection(sec - 1)}
        label="Previous section"
      />
      <SideArrow
        side="right"
        disabled={atLastSection}
        onClick={() => goSection(sec + 1)}
        label="Next section"
      />

      {subCount > 1 && (
        <>
          <VerticalArrow
            side="top"
            disabled={atFirstSub}
            onClick={() => goSub(sub - 1)}
            label="Previous slide"
          />
          <VerticalArrow
            side="bottom"
            disabled={atLastSub}
            onClick={() => goSub(sub + 1)}
            label="Next slide"
          />
        </>
      )}

      <SectionPills sections={sections} sec={sec} onPick={goSection} />

      {subDots && subCount > 1 && (
        <SubDots
          count={subCount}
          current={sub}
          onPick={goSub}
          label={currentSection.label ?? "Slide"}
        />
      )}

      {currentSlide?.onEnter && (
        <EnterHint label={currentSlide.cta} onClick={currentSlide.onEnter} />
      )}
    </div>
  );
}

const slideVariants: Variants = {
  enter: (d: Dir) =>
    d === "right"
      ? { x: "100%", y: 0 }
      : d === "left"
        ? { x: "-100%", y: 0 }
        : d === "down"
          ? { x: 0, y: "100%" }
          : { x: 0, y: "-100%" },
  center: { x: 0, y: 0 },
  exit: (d: Dir) =>
    d === "right"
      ? { x: "-100%", y: 0 }
      : d === "left"
        ? { x: "100%", y: 0 }
        : d === "down"
          ? { x: 0, y: "-100%" }
          : { x: 0, y: "100%" },
};

function HomePill() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="fixed top-4 md:top-8 left-4 md:left-8 z-50 flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md px-4 py-2 text-eyebrow font-mono uppercase text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:border-[var(--color-brand)] transition select-none"
      style={{ height: "clamp(2.25rem, 3vw, 2.75rem)" }}
    >
      <span aria-hidden>ESC</span>
      <span>Back</span>
    </Link>
  );
}

function EnterHint({ label, onClick }: { label?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Activate"}
      className="fixed top-4 md:top-8 right-4 md:right-8 z-50 flex items-center gap-2 rounded-full border border-[var(--color-brand-dim)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md px-4 py-2 text-eyebrow font-mono uppercase text-[var(--color-brand-soft)] hover:text-[var(--color-ink)] hover:border-[var(--color-brand)] transition select-none"
      style={{ height: "clamp(2.25rem, 3vw, 2.75rem)", maxWidth: "min(28rem, 40vw)" }}
    >
      <span>Enter</span>
      {label && (
        <>
          <span aria-hidden className="text-[var(--color-ink-mute)]">·</span>
          <span className="normal-case tracking-normal font-sans text-[var(--color-ink)] truncate" style={{ letterSpacing: "0.02em" }}>
            {label}
          </span>
        </>
      )}
      <span aria-hidden>→</span>
    </button>
  );
}

function SideArrow({
  side,
  disabled,
  onClick,
  label,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`fixed top-1/2 -translate-y-1/2 z-50 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full border-2 border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md text-[var(--color-ink)] transition active:scale-95 ${
        side === "left" ? "left-4 md:left-8" : "right-4 md:right-8"
      } ${
        disabled
          ? "opacity-20 cursor-not-allowed"
          : "hover:bg-[var(--color-bg-elev-2)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
      }`}
    >
      {side === "left" ? (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function VerticalArrow({
  side,
  disabled,
  onClick,
  label,
}: {
  side: "top" | "bottom";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`fixed left-1/2 -translate-x-1/2 z-50 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border-2 border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md text-[var(--color-ink)] transition active:scale-95 ${
        side === "top" ? "top-4 md:top-8" : "bottom-20 md:bottom-24"
      } ${
        disabled
          ? "opacity-20 cursor-not-allowed"
          : "hover:bg-[var(--color-bg-elev-2)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
      }`}
    >
      {side === "top" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 15l-6-6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function SectionPills({
  sections,
  sec,
  onPick,
}: {
  sections: DeckSection[];
  sec: number;
  onPick: (i: number) => void;
}) {
  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md px-4 py-2.5"
    >
      <span className="text-eyebrow font-mono uppercase text-[var(--color-ink-mute)] mr-2 tabular-nums">
        {(sec + 1).toString().padStart(2, "0")} /{" "}
        {sections.length.toString().padStart(2, "0")}
      </span>
      {sections.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Section ${i + 1}${s.label ? `: ${s.label}` : ""}`}
          aria-current={i === sec ? "true" : undefined}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === sec
              ? "w-10 bg-[var(--color-brand)]"
              : "w-2 bg-[var(--color-line-strong)] hover:bg-[var(--color-ink-mute)]"
          }`}
        />
      ))}
    </nav>
  );
}

function SubDots({
  count,
  current,
  onPick,
  label,
}: {
  count: number;
  current: number;
  onPick: (i: number) => void;
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 z-50 flex flex-col items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/85 backdrop-blur-md px-2.5 py-4"
    >
      <span
        className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-ink-mute)] tabular-nums [writing-mode:vertical-rl] mb-2"
        style={{ transform: "rotate(180deg)" }}
      >
        {(current + 1).toString().padStart(2, "0")} /{" "}
        {count.toString().padStart(2, "0")}
      </span>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Slide ${i + 1}`}
          aria-current={i === current ? "true" : undefined}
          className={`w-2 rounded-full transition-all duration-300 ${
            i === current
              ? "h-10 bg-[var(--color-brand)]"
              : "h-2 bg-[var(--color-line-strong)] hover:bg-[var(--color-ink-mute)]"
          }`}
        />
      ))}
    </nav>
  );
}

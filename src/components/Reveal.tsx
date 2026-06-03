"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ElementType } from "react";

type RevealProps = {
  delay?: number;
  /** How far the element rises during entrance, in px. */
  rise?: number;
  /** Blur radius at entrance, in px. */
  blur?: number;
  /** Render as a different element (h1, h2, p, span, etc). */
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition" | "children">;

/**
 * Wraps its children in a motion element that blurs + fades + rises into
 * place on mount. Because each slide is unmounted/remounted by the deck's
 * AnimatePresence on navigation, every visit to a slide re-plays this.
 */
export default function Reveal({
  delay = 0,
  rise = 14,
  blur = 10,
  as = "div",
  children,
  className,
  ...rest
}: RevealProps) {
  const MotionTag = motion(as);
  return (
    <MotionTag
      initial={{ opacity: 0, y: rise, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 0.84, 0.24, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

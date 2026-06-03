"use client";

import SplitText from "../react-bits/SplitText";
import BlurText from "../react-bits/BlurText";
import CountUp from "../react-bits/CountUp";
import PageHero from "./PageHero";
import Eyebrow from "./Eyebrow";
import StatGrid from "./StatGrid";

const stats = [
  { value: 15, suffix: "%", label: "Cost reduction" },
  { value: 50, suffix: "%", label: "Faster delivery" },
  { value: 6, suffix: "", label: "Market sectors" },
  { value: 0, suffix: "", label: "Rework, by design" },
];

export default function Hero() {
  return (
    <PageHero colors={["#050608", "#2c90cf", "#15181c"]}>
      <div className="max-w-5xl">
        <Eyebrow tone="accent">Tech-Centre · Content Companion</Eyebrow>

        <SplitText
          tag="h1"
          text="Welcome to Blink world."
          splitType="words"
          delay={80}
          duration={1.1}
          ease="power3.out"
          from={{ opacity: 0, y: 60, rotateX: -40 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
          textAlign="left"
          className="font-display font-thin-tight text-6xl md:text-7xl lg:text-8xl kiosk:text-[10rem] leading-[0.95] mt-8"
        />

        <BlurText
          text="Get your entire building — faster, better, safer, with way less waste. Pick a path and we'll personalise the deep dive."
          animateBy="words"
          direction="bottom"
          delay={40}
          className="mt-8 text-lg md:text-xl lg:text-2xl kiosk:text-3xl font-light text-[var(--color-ink-dim)] max-w-3xl"
        />
      </div>

      <StatGrid
        className="mt-16 md:mt-20"
        items={stats.map((s) => ({
          label: s.label,
          value: (
            <>
              <CountUp to={s.value} duration={1.6} />
              <span className="text-[var(--color-brand)]">{s.suffix}</span>
            </>
          ),
          accent: "var(--color-brand)",
        }))}
      />
    </PageHero>
  );
}

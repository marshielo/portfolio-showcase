"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";

export interface ProjectCard {
  id: string;
  title: string;
  year: string;
  role?: string;
  backgroundImage?: string;
  publicationLink?: string;
}

interface ProjectShowcaseProps {
  cards: ProjectCard[];
}

// Accent colour palette — one per card (cycles if more than 5 cards)
const CARD_ACCENTS = [
  {
    glow: "rgba(168,85,247,0.45)",      // purple
    gradient: "rgba(168,85,247,0.55)",
    border: "#a855f7",
    orb: "rgba(168,85,247,0.18)",
  },
  {
    glow: "rgba(249,115,22,0.45)",       // orange
    gradient: "rgba(249,115,22,0.55)",
    border: "#f97316",
    orb: "rgba(249,115,22,0.18)",
  },
  {
    glow: "rgba(6,182,212,0.45)",        // cyan
    gradient: "rgba(6,182,212,0.55)",
    border: "#06b6d4",
    orb: "rgba(6,182,212,0.18)",
  },
  {
    glow: "rgba(244,63,94,0.45)",        // rose
    gradient: "rgba(244,63,94,0.55)",
    border: "#f43f5e",
    orb: "rgba(244,63,94,0.18)",
  },
  {
    glow: "rgba(34,197,94,0.45)",        // green
    gradient: "rgba(34,197,94,0.55)",
    border: "#22c55e",
    orb: "rgba(34,197,94,0.18)",
  },
];

export function ProjectShowcase({ cards }: ProjectShowcaseProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  // No hard cap — all cards render, colours cycle every 5 cards automatically
  const cardCount = cards.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Entrance animation
  const entranceRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: entranceProgress } = useScroll({
    target: entranceRef,
    offset: ["start end", "start 0.2"],
  });
  const titleY = useTransform(entranceProgress, [0, 1], [60, 0]);
  const entranceOpacity = useTransform(entranceProgress, [0, 0.5], [0, 1]);

  return (
    <div id="projects" ref={entranceRef}>
      {/* Tall section that drives card stacking */}
      <div
        ref={sectionRef}
        style={{ height: `${cardCount * 100 + 50}vh` }}
        className="relative"
      >
        {/* Sticky container - title + cards stay centered */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

          {/* Background colour orbs — one per card, each fades in/out on its scroll segment */}
          {cards.map((_, index) => (
            <BackgroundOrb
              key={`orb-${index}`}
              index={index}
              cardCount={cardCount}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Section title */}
          <motion.div
            style={{ opacity: entranceOpacity, y: titleY }}
            className="pb-6 text-center md:pb-8 shrink-0 relative z-10"
          >
            <p className="text-sm uppercase tracking-widest text-foreground/40 mb-2">
              Featured Work
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Projects &amp; Experiments
            </h2>
          </motion.div>

          {/* Card stack area — overflow hidden clips cards sliding from below */}
          <div className="mx-auto w-full max-w-5xl px-4 relative z-10">
            <div
              className="relative overflow-hidden"
              style={{ height: "75vh", maxHeight: "680px" }}
            >
              {cards.map((card, index) => (
                <BrowserCard
                  key={card.id}
                  card={card}
                  index={index}
                  cardCount={cardCount}
                  scrollYProgress={scrollYProgress}
                  onClick={() => router.push(`/portfolio/${card.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundOrb({
  index,
  cardCount,
  scrollYProgress,
}: {
  index: number;
  cardCount: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const isLast = index === cardCount - 1;
  const segmentSize = cardCount > 1 ? 0.8 / (cardCount - 1) : 1;
  const threshold = index === 0 ? 0 : 0.15 + (index - 1) * segmentSize;
  const nextThreshold = 0.15 + index * segmentSize;

  const orbOpacity = useTransform(
    scrollYProgress,
    isLast
      ? [Math.max(0, threshold - 0.05), threshold + 0.15]
      : [Math.max(0, threshold - 0.05), threshold + 0.15, nextThreshold + 0.1, nextThreshold + 0.2],
    isLast ? [0, 1] : [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ opacity: orbOpacity }}
    >
      <div
        className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: accent.orb }}
      />
      <div
        className="absolute -right-32 top-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: accent.orb }}
      />
    </motion.div>
  );
}

function BrowserCard({
  card,
  index,
  cardCount,
  scrollYProgress,
  onClick,
}: {
  card: ProjectCard;
  index: number;
  cardCount: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  onClick: () => void;
}) {
  const isFirst = index === 0;
  const isLast = index === cardCount - 1;
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const segmentSize = cardCount > 1 ? 0.8 / (cardCount - 1) : 1;
  const threshold = isFirst ? 0 : 0.15 + (index - 1) * segmentSize;

  const translateY = useTransform(
    scrollYProgress,
    isFirst ? [0, 1] : [Math.max(0, threshold - 0.01), threshold + 0.15],
    isFirst ? [0, 0] : [500, 0]
  );

  const nextCardThreshold = isFirst ? 0.15 : 0.15 + index * segmentSize;
  const cardScale = useTransform(
    scrollYProgress,
    isLast
      ? [0, 1]
      : [nextCardThreshold - 0.02, nextCardThreshold + 0.1],
    isLast ? [1, 1] : [1, 0.92]
  );

  // Glow intensifies as card slides in, then dims slightly once the next card arrives
  const glowOpacity = useTransform(
    scrollYProgress,
    isFirst
      ? isLast ? [0, 1] : [0, nextCardThreshold + 0.05, nextCardThreshold + 0.15]
      : isLast
        ? [Math.max(0, threshold - 0.01), threshold + 0.15]
        : [Math.max(0, threshold - 0.01), threshold + 0.15, nextCardThreshold + 0.05, nextCardThreshold + 0.15],
    isFirst
      ? isLast ? [1, 1] : [1, 1, 0.35]
      : isLast
        ? [0, 1]
        : [0, 1, 1, 0.35]
  );

  return (
    <motion.div
      className="absolute inset-0 cursor-pointer"
      onClick={onClick}
      style={{
        y: translateY,
        scale: cardScale,
        zIndex: 10 + index * 10,
      }}
    >
      {/* Coloured glow ring behind the card */}
      <motion.div
        className="absolute -inset-1 rounded-[28px] blur-xl pointer-events-none"
        style={{
          background: accent.glow,
          opacity: glowOpacity,
        }}
      />

      {/* Full browser frame */}
      <div className="relative h-full rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#18181b] shadow-2xl overflow-hidden md:rounded-[24px] flex flex-col isolate">

        {/* Coloured top accent line */}
        <div
          className="h-[2px] w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)`,
          }}
        />

        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 px-4 py-2.5 shrink-0 bg-neutral-50 dark:bg-[#18181b]">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="mx-auto flex-1 max-w-sm">
            <div
              className="rounded-md px-3 py-1 text-center text-xs text-foreground/50 truncate"
              style={{ background: `${accent.border}18` }}
            >
              {card.publicationLink
                ? card.publicationLink.replace(/^https?:\/\//, "")
                : card.title}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-neutral-100 dark:bg-[#09090b]">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-[#09090b]" />
          {card.backgroundImage ? (
            <img
              src={card.backgroundImage}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-900" />
          )}

          {/* Bottom gradient — tinted with card accent colour */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/5"
            style={{
              background: `linear-gradient(to top, ${accent.gradient} 0%, rgba(0,0,0,0.6) 50%, transparent 100%)`,
            }}
          />

          {/* Role badge */}
          {card.role && (
            <div className="absolute top-4 right-4 z-10">
              <span
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md border"
                style={{
                  background: `${accent.border}22`,
                  borderColor: `${accent.border}55`,
                }}
              >
                {card.role}
              </span>
            </div>
          )}

          {/* Project info overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
              {card.title}
            </h3>
            <p className="text-sm" style={{ color: accent.border + "cc" }}>
              {card.year}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import type { GlobeConfig } from "./globe";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false }
);

// ─── Tech Stack Marquee Header ──────────────────────────────────────────────

const STACK_ROWS = [
  ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma", "Supabase", "Swift", "SwiftUI"],
  ["Node.js", "PostgreSQL", "Prisma", "Vercel", "Git", "Docker", "REST API", "GraphQL"],
  ["Framer Motion", "Three.js", "Radix UI", "shadcn/ui", "Zod", "tRPC", "Expo", "React Native"],
];

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
      <motion.div
        className="flex shrink-0 gap-3 py-1.5"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-2 text-sm text-foreground/70 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function TechStackHeader() {
  return (
    <div className="flex flex-1 w-full flex-col gap-3 overflow-hidden">
      {STACK_ROWS.map((row, i) => (
        <Marquee key={i} items={row} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}

// ─── Globe Header ───────────────────────────────────────────────────────────

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: -6.2088, lng: 106.8456 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const sampleArcs = [
  { order: 1, startLat: -6.2088, startLng: 106.8456, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.1, color: randomColor() },
  { order: 1, startLat: -6.2088, startLng: 106.8456, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: randomColor() },
  { order: 2, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.5, color: randomColor() },
  { order: 2, startLat: -6.2088, startLng: 106.8456, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.6, color: randomColor() },
  { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 40.7128, endLng: -74.006, arcAlt: 0.7, color: randomColor() },
  { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: randomColor() },
  { order: 4, startLat: -6.2088, startLng: 106.8456, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.4, color: randomColor() },
  { order: 4, startLat: -6.2088, startLng: 106.8456, endLat: 52.52, endLng: 13.405, arcAlt: 0.35, color: randomColor() },
  { order: 5, startLat: -6.2088, startLng: 106.8456, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.3, color: randomColor() },
  { order: 5, startLat: -6.2088, startLng: 106.8456, endLat: 37.5665, endLng: 126.978, arcAlt: 0.2, color: randomColor() },
  { order: 6, startLat: 1.3521, startLng: 103.8198, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.4, color: randomColor() },
  { order: 6, startLat: 35.6762, startLng: 139.6503, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.5, color: randomColor() },
  { order: 7, startLat: 40.7128, startLng: -74.006, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.2, color: randomColor() },
  { order: 7, startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: randomColor() },
];

function GlobeHeader() {
  return (
    <div className="relative flex flex-1 w-full min-h-[14rem] overflow-hidden rounded-xl">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-black z-[5] pointer-events-none" />
      <div className="absolute inset-0">
        <World data={sampleArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}

// ─── CTA Header ─────────────────────────────────────────────────────────────

function CTAHeader() {
  return (
    <div className="flex flex-1 w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 min-h-[6rem]">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white/20 dark:border-black/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/25">
        A
      </div>
    </div>
  );
}

// ─── What You Get Header ────────────────────────────────────────────────────

function WhatYouGetHeader() {
  return (
    <div className="flex flex-1 w-full items-end rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 p-4 min-h-[6rem]">
      <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-300 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
          <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground/80">Scales With You</p>
          <p className="text-xs text-foreground/40">Built to handle your next 10x of growth</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Bento Grid Section ────────────────────────────────────────────────

interface BentoGridSectionProps {
  email?: string;
}

export function BentoGridSection({ email }: BentoGridSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-6xl px-4"
      >
        <BentoGrid className="max-w-6xl md:auto-rows-[20rem] md:grid-cols-3">
          {/* Tech Stack — spans 2 cols */}
          <BentoGridItem
            className="md:col-span-2 border-neutral-200 dark:border-white/[0.1]"
            title="The stack behind everything I ship"
            description={
              <span className="text-xs uppercase tracking-widest text-foreground/40">
                Tech Stack
              </span>
            }
            header={<TechStackHeader />}
          />

          {/* CTA — 1 col */}
          <BentoGridItem
            className="border-neutral-200 dark:border-white/[0.1]"
            title="Let's Build Together"
            description={
              email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-xs"
                >
                  Clear communication, fast iterations, no surprises
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              ) : (
                "Clear communication, fast iterations, no surprises"
              )
            }
            header={<CTAHeader />}
          />

          {/* Globe — spans 2 cols, taller */}
          <BentoGridItem
            className="md:col-span-2 md:row-span-2 border-neutral-200 dark:border-white/[0.1] overflow-hidden"
            title="Based in Indonesia, available globally"
            description={
              <span className="text-xs uppercase tracking-widest text-foreground/40">
                Flexible with Timezones
              </span>
            }
            header={<GlobeHeader />}
          />

          {/* What You Get — 1 col */}
          <BentoGridItem
            className="border-neutral-200 dark:border-white/[0.1]"
            title="Clean code, pixel-perfect UI, deployed & scaling"
            description={
              <span className="text-xs uppercase tracking-widest text-foreground/40">
                What You Get
              </span>
            }
            header={<WhatYouGetHeader />}
          />
        </BentoGrid>
      </motion.div>
    </section>
  );
}

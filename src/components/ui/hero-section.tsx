"use client";

import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "./spotlight";
import { PointerHighlight } from "./pointer-highlight";
import { AuroraBackground } from "./aurora-background";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  name: string;
  email?: string;
}

export function HeroSection({
  name,
  email,
}: HeroSectionProps) {
  return (
    <AuroraBackground className="px-6 md:px-16 lg:px-24 overflow-hidden">
      <Spotlight />

      <div className="relative z-10 max-w-4xl">
        {/* Badge */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/10 bg-neutral-100/80 dark:bg-white/5 px-4 py-1.5 text-sm text-foreground/60 backdrop-blur-sm transition-colors hover:bg-neutral-200/80 dark:hover:bg-white/10"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Available for Remote Work
          <span className="ml-1">&rarr;</span>
        </motion.a>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Adyuta&apos;s 2026
          <br />
          <PointerHighlight
            rectangleClassName="border-purple-400/40"
            pointerClassName="text-purple-400"
            containerClassName="inline-block"
          >
            <span className="bg-gradient-to-r from-purple-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Project Showcase.
            </span>
          </PointerHighlight>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-6 max-w-xl text-base text-foreground/50 sm:text-lg md:text-xl"
        >
          A curated collection of projects, experiments, and creative work
          I&apos;ve been working on throughout 2026.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-neutral-100 dark:hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-lg"
          >
            View Projects
            <ArrowDown className="h-4 w-4" />
          </a>
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-100/80 dark:bg-white/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-neutral-200/80 dark:hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get in Touch
            </a>
          )}
        </motion.div>
      </div>
    </AuroraBackground>
  );
}

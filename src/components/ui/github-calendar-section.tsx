"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface GitHubCalendarSectionProps {
  username: string;
}

const LEVEL_COLORS_DARK: Record<string, string> = {
  "0": "#1e293b",
  "1": "#6d28d9",
  "2": "#7c3aed",
  "3": "#8b5cf6",
  "4": "#a78bfa",
};

const LEVEL_COLORS_LIGHT: Record<string, string> = {
  "0": "#e2e8f0",
  "1": "#c4b5fd",
  "2": "#a78bfa",
  "3": "#8b5cf6",
  "4": "#7c3aed",
};

function isDarkMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyCalendarTheme(container: HTMLElement) {
  const dark = isDarkMode();
  const levelColors = dark ? LEVEL_COLORS_DARK : LEVEL_COLORS_LIGHT;
  const labelColor = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  // Style contribution cells
  container.querySelectorAll<HTMLElement>(".ContributionCalendar-day").forEach((el) => {
    const level = el.getAttribute("data-level") || "0";
    const color = levelColors[level] || levelColors["0"];
    el.style.backgroundColor = color;
    el.style.borderRadius = "3px";
    el.style.outline = "none";
  });

  // Style text labels
  container.querySelectorAll<HTMLElement>("text.ContributionCalendar-label").forEach((el) => {
    el.style.fill = labelColor;
  });

  // Style month/weekday labels
  container.querySelectorAll<HTMLElement>(".calendar-graph text.wday, .calendar-graph text.month").forEach((el) => {
    el.style.fill = labelColor;
  });

  // Hide footer/legend
  container.querySelectorAll<HTMLElement>(".contrib-footer, .float-right, div.px-md-5").forEach((el) => {
    el.style.display = "none";
  });

  // Style text elements
  container.querySelectorAll<HTMLElement>(".text-small, .left.text-muted, .left.text-muted a, .monospace, .monospace a").forEach((el) => {
    el.style.color = labelColor;
  });

  // Remove border from .calendar wrapper
  const cal = container.querySelector<HTMLElement>(".calendar");
  if (cal) {
    cal.style.border = "none";
    cal.style.background = "transparent";
    cal.style.width = "100%";
    cal.style.minHeight = "auto";
  }
}

export function GitHubCalendarSection({ username }: GitHubCalendarSectionProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  useEffect(() => {
    if (!calendarRef.current || initializedRef.current) return;
    initializedRef.current = true;

    import("github-calendar").then((mod) => {
      const GitHubCalendar = mod.default || mod;
      GitHubCalendar(calendarRef.current!, username, {
        responsive: true,
        tooltips: true,
        global_stats: false,
        proxy: (u: string) =>
          fetch(`/api/github-calendar?username=${u}`).then((r) => r.text()),
      });

      // Apply theme once calendar renders
      const observer = new MutationObserver(() => {
        if (calendarRef.current?.querySelector(".ContributionCalendar-day")) {
          applyCalendarTheme(calendarRef.current);
          observer.disconnect();
        }
      });
      observer.observe(calendarRef.current!, { childList: true, subtree: true });
    });
  }, [username]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-5xl px-4"
      >
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-widest text-foreground/40 mb-2">
            Open Source Activity
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            GitHub Contributions
          </h2>
          <p className="mt-3 text-foreground/50 text-sm sm:text-base max-w-md mx-auto">
            A live snapshot of my coding activity on GitHub
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#161b22] p-4 sm:p-6 md:p-8">
          <div
            ref={calendarRef}
            className="github-calendar min-w-[700px]"
          />
        </div>
      </motion.div>
    </section>
  );
}

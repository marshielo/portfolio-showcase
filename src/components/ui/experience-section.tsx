"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
}

interface ExperienceSectionProps {
  experiences?: ExperienceItem[];
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    company: "CIMB Niaga",
    role: "Software Engineer",
    period: "Mar 2026 — Present",
    location: "Jakarta, Indonesia",
    highlights: [],
  },
  {
    company: "Telkom Indonesia",
    role: "AI Engineer — Digital Connectivity & Service",
    period: "Dec 2025 — Mar 2026",
    location: "Jakarta, Indonesia",
    highlights: [
      "Integrated LLMs into the enterprise ecosystem, reducing Analytics Dashboard response time by 75%",
      "Validated data pipelines from Denodoo DV, integrating 40+ tables for multi-modal LLM workflows",
      "Optimized LLM accuracy by aligning 35+ business products and terminologies",
    ],
  },
  {
    company: "Badan Sistem Informasi — Universitas Islam Indonesia",
    role: "Backend Engineer",
    period: "Jan 2025 — Dec 2025",
    location: "Yogyakarta, Indonesia",
    highlights: [
      "Architected UIIRanking data gateway with microservices, REST APIs, and scalable database schemas",
      "Automated institutional data pipelines — from months of manual gathering to real-time retrieval",
      "Developed and managed 30+ Kafka Raft connectors across 4+ database clusters",
      "Automated report generation with JasperReports, increasing efficiency by 90%",
    ],
  },
  {
    company: "Bangkit Academy — Google, GoTo, & Traveloka",
    role: "Machine Learning",
    period: "Feb 2024 — Jun 2024",
    location: "Indonesia",
    highlights: [
      "Distinction Graduate (Top 5%) — Built end-to-end AI food analysis with 90% accuracy",
      "Reduced ML inference latency by 35% through FastAPI optimization and async handling",
    ],
  },
  {
    company: "Laboratorium Terpadu Informatika — UII",
    role: "Assistant Lecturer, Algorithm & Data Structure",
    period: "Feb 2023 — Sep 2023",
    location: "Yogyakarta, Indonesia",
    highlights: [
      "Guided 50+ students in Data Structures and Algorithms",
      "Organized tutorials, developed problem sets, and conducted lab demos",
    ],
  },
];

export function ExperienceSection({
  experiences = DEFAULT_EXPERIENCES,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="experience" ref={sectionRef} className="relative py-24 md:py-32">
      <motion.div style={{ opacity, y }} className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-foreground/40 mb-2">
            Career
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Work Experience
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-neutral-200 dark:bg-white/10 md:left-1/2 md:-translate-x-px" />

          {experiences.map((exp, i) => (
            <TimelineItem key={i} item={exp} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function TimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative mb-10 last:mb-0 pl-10 md:pl-0 md:w-1/2 ${
        isEven ? "md:pr-10 md:ml-0" : "md:pl-10 md:ml-auto"
      }`}
    >
      {/* Dot */}
      <div
        className={`absolute top-2 left-2.5 h-3 w-3 rounded-full border-2 border-amber-700/60 dark:border-amber-600/50 bg-background md:left-auto ${
          isEven ? "md:-right-1.5" : "md:-left-1.5"
        }`}
      />

      {/* Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground/90 text-sm sm:text-base">
              {item.role}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-500/80">{item.company}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-foreground/40">{item.period}</p>
            <p className="text-xs text-foreground/30">{item.location}</p>
          </div>
        </div>

        {item.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {item.highlights.map((h, j) => (
              <li
                key={j}
                className="flex items-start gap-2 text-xs sm:text-sm text-foreground/60"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/20" />
                {h}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

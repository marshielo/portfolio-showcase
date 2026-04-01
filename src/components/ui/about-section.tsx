"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AboutSectionProps {
  bio?: string;
  education?: {
    school: string;
    degree: string;
    gpa: string;
    period: string;
  };
  skills?: string[];
  awards?: string[];
  linkedinUrl?: string;
}

const SKILL_COLORS = [
  { border: "border-purple-400/30 dark:border-purple-400/20", text: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { border: "border-cyan-400/30 dark:border-cyan-400/20", text: "text-cyan-700 dark:text-cyan-300", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
  { border: "border-orange-400/30 dark:border-orange-400/20", text: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { border: "border-blue-400/30 dark:border-blue-400/20", text: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { border: "border-rose-400/30 dark:border-rose-400/20", text: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-500/10" },
];

const DEFAULT_SKILLS = [
  "Go",
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "PHP",
  "Laravel",
  "Kafka",
  "Docker",
  "PostgreSQL",
  "SQL",
  "Supabase",
  "REST APIs",
  "Microservices",
  "TensorFlow",
  "Machine Learning",
  "Git",
  "CI/CD",
  "Agile",
];

const DEFAULT_AWARDS = [
  "Bangkit Academy 2024 — Graduate with Distinction (Top 5%)",
  "Top 58 Teams — HackFest 2023 by GDSC Indonesia",
  "Top 3 Teams — Informatics Expo 2022",
  "3rd Place — Programming & Logic IT Festival",
];

export function AboutSection({
  bio,
  education,
  skills = DEFAULT_SKILLS,
  awards = DEFAULT_AWARDS,
  linkedinUrl,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const defaultBio =
    "Performance-driven Software Engineer with experience in digital platform architecture and process automation. I specialize in building scalable REST APIs and modern web interfaces using Go and Next.js, with expertise in AI-driven solutions, Microservices, and event-driven architectures. Based in Jakarta, available globally for remote work.";

  const defaultEducation = {
    school: "Universitas Islam Indonesia",
    degree: "Bachelor of Informatics",
    gpa: "3.81 / 4.00",
    period: "2021 — 2025",
  };

  const edu = education ?? defaultEducation;

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-5xl px-4"
      >
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-foreground/40 mb-2">
            About Me
          </p>
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Who I Am
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-5">
          {/* Left — Bio & Education */}
          <div className="md:col-span-3 space-y-6">
            <p className="text-foreground/70 leading-relaxed text-sm sm:text-base">
              {bio ?? defaultBio}
            </p>

            {/* Education */}
            <div className="relative rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-purple-500 via-cyan-400 to-orange-400" />
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">
                Education
              </p>
              <p className="font-semibold text-foreground/90">{edu.school}</p>
              <p className="text-sm text-foreground/60">{edu.degree}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-foreground/40">
                <span>GPA: {edu.gpa}</span>
                <span>{edu.period}</span>
              </div>
            </div>

            {/* Awards */}
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">
                Awards & Recognition
              </p>
              <ul className="space-y-2">
                {awards.map((award, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400" />
                    {award}
                  </li>
                ))}
              </ul>
            </div>

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                View full profile on LinkedIn
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Right — Skills */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => {
                const color = SKILL_COLORS[i % SKILL_COLORS.length];
                return (
                  <span
                    key={skill}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${color.border} ${color.bg} ${color.text}`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

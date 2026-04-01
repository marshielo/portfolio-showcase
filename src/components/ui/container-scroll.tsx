"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ContainerScrollProps {
  children: React.ReactNode;
  titleComponent?: React.ReactNode;
}

export function ContainerScroll({
  children,
  titleComponent,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.3], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <div ref={containerRef} className="relative py-20 md:py-40">
      {titleComponent && (
        <motion.div style={{ opacity, translateY }} className="mb-10 md:mb-20 text-center">
          {titleComponent}
        </motion.div>
      )}
      <motion.div
        style={{
          rotateX: rotate,
          scale,
          opacity,
        }}
        className="mx-auto w-full max-w-6xl px-4"
      >
        <div className="relative rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl md:rounded-[30px] md:p-4">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex-1 max-w-md">
              <div className="rounded-md bg-white/5 px-3 py-1 text-center text-xs text-white/40">
                adyuta.dev
              </div>
            </div>
          </div>
          {/* Content area */}
          <div className="overflow-hidden rounded-b-xl md:rounded-b-[22px]">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

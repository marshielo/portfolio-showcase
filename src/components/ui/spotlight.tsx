"use client";

import React from "react";
import { motion } from "framer-motion";

export function Spotlight({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Primary gradient blob */}
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "conic-gradient(from 230deg at 51% 52%, #c084fc 0deg, #f97316 72deg, #facc15 144deg, #c084fc 216deg, #818cf8 288deg, #c084fc 360deg)",
        }}
      />
      {/* Secondary smaller blob */}
      <div
        className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #f97316 0%, #c084fc 50%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

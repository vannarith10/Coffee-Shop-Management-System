"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  classChild?: string;
};

export function LiquidGlass({ children, className, classChild }: Props) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* Distortion + Blur */}
      <div
        className="
          absolute inset-0
          backdrop-blur-[1px]
          filter-[url(#glass-distortion)]
          z-0
          transition-all duration-300 ease-out
        "
      />

      {/* Add edge Fresnel lighting */}
      <div
        className="
            absolute inset-0 z-3
            shadow-[inset_0px_0px_30px_0px_rgba(255,255,255,0.5)]
            pointer-events-none
            transition-all duration-300 ease-out
        "
      />

      {/* Tint */}
      <div
        className="
          absolute inset-0
          bg-background-primary/5
          shadow-[inset_0_0_40px_-10px_rgba(255,255,255,0.8)]
          z-1
          transition-all duration-300 ease-out
        "
      />

      {/* Content */}
      <div className={`relative z-10 ${classChild}`}>{children}</div>
    </div>
  );
}

"use client";

import MagneticButton from "@/components/ui/MagneticButton";

export default function StartButton({
  onStart,
  disabled,
}: {
  onStart: () => void;
  disabled?: boolean;
}) {
  return (
    <MagneticButton
      onClick={onStart}
      ariaLabel="Start the experience"
      className="group relative"
    >
      <span
        className={`relative flex flex-col items-center gap-3 rounded-xl border border-signal/40 bg-signal/[0.06] px-9 py-5 backdrop-blur-sm transition-all duration-500 group-hover:border-signal/80 group-hover:bg-signal/[0.1] ${
          disabled ? "opacity-60" : ""
        }`}
      >
        {/* corner brackets */}
        <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-signal/60" />
        <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-signal/60" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-signal/60" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-signal/60" />

        <span className="flex items-center gap-2 mono text-[0.62rem] tracking-[0.3em] text-signal/80">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-line rounded-full bg-signal" />
          SYSTEM READY
        </span>

        <span className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-chalk">
          START EXPERIENCE
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>

        <span className="h-px w-full max-w-[180px] overflow-hidden bg-white/10">
          <span className="block h-full w-1/3 animate-scan bg-signal/80" />
        </span>

        <span className="mono text-[0.58rem] tracking-[0.28em] text-muted">
          ENTER THE SYSTEM
        </span>
      </span>
    </MagneticButton>
  );
}

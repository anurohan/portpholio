"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useStore } from "@/lib/store";

/**
 * Magnetic hover: the element eases toward the cursor within its bounds.
 * Disabled on reduced-motion and coarse pointers. Renders a <button> or <a>.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  strength = 0.35,
  ariaLabel,
  download,
  target,
  rel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  download?: boolean;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useStore((s) => s.reducedMotion);

  const move = (e: MouseEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  const common = {
    ref: ref as never,
    onMouseMove: move,
    onMouseLeave: reset,
    className: `inline-flex items-center justify-center transition-transform duration-300 ease-out will-change-transform ${className}`,
    "data-cursor": "hover",
  };

  if (href) {
    return (
      <a
        {...common}
        href={href}
        aria-label={ariaLabel}
        download={download}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    );
  }
  return (
    <button {...common} type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

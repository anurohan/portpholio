"use client";

import { profile } from "@/content/profile";
import { scrollToId } from "@/lib/lenis";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/8 bg-ink-900/60 backdrop-blur-md">
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <button
          onClick={() => scrollToId("hero")}
          data-cursor="hover"
          className="mono text-sm tracking-[0.24em] text-chalk transition-colors hover:text-signal"
          aria-label="Back to top"
        >
          {profile.initials} · TOP ↑
        </button>

        <p className="text-center text-xs text-muted">
          © {year} {profile.name}. Built with Next.js, React Three Fiber & GSAP.
        </p>

        <div className="flex items-center gap-5 text-sm">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="text-muted transition-colors hover:text-chalk"
          >
            GitHub
          </a>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="hover"
            className="text-muted transition-colors hover:text-chalk"
          >
            Email
          </a>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-muted transition-colors hover:text-chalk"
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

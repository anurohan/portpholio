"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { navSections, sections } from "@/lib/site";
import { scrollToId } from "@/lib/lenis";
import { profile } from "@/content/profile";
import { cx } from "@/lib/utils";

const labelFor = (id: string) => sections.find((s) => s.id === id)?.label ?? id;

export default function Nav() {
  const phase = useStore((s) => s.phase);
  const active = useStore((s) => s.activeSection);
  const navOpen = useStore((s) => s.navOpen);
  const setNavOpen = useStore((s) => s.setNavOpen);

  const go = (id: string) => {
    setNavOpen(false);
    scrollToId(id);
  };

  const visible = phase === "live";

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        {/* Logo / name */}
        <button
          onClick={() => go("hero")}
          data-cursor="hover"
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-white/15 font-display text-sm font-semibold text-chalk transition-colors group-hover:border-signal group-hover:text-signal">
            {profile.initials}
          </span>
          <span className="hidden font-display text-sm font-medium tracking-tight text-chalk sm:block">
            {profile.name}
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navSections.map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              data-cursor="hover"
              className={cx(
                "relative px-3 py-2 text-[0.82rem] transition-colors",
                active === id ? "text-chalk" : "text-muted hover:text-chalk"
              )}
            >
              {labelFor(id)}
              {active === id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-signal"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="hidden rounded-md border border-white/15 px-3 py-1.5 text-[0.8rem] text-chalk transition-colors hover:border-signal hover:text-signal sm:block"
          >
            GitHub
          </a>
          <a
            href={profile.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="hidden rounded-md border border-white/15 px-3 py-1.5 text-[0.8rem] text-chalk transition-colors hover:border-signal hover:text-signal sm:block"
          >
            Résumé
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setNavOpen(!navOpen)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/15 lg:hidden"
            data-cursor="hover"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={cx(
                  "block h-px w-5 bg-chalk transition-transform",
                  navOpen && "translate-y-[3.5px] rotate-45"
                )}
              />
              <span
                className={cx(
                  "block h-px w-5 bg-chalk transition-transform",
                  navOpen && "-translate-y-[3.5px] -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex flex-col bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-1 px-8">
              {navSections.map((id, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                  onClick={() => go(id)}
                  className="flex items-baseline gap-4 py-2 text-left"
                >
                  <span className="mono text-xs text-signal">
                    {sections.find((s) => s.id === id)?.index}
                  </span>
                  <span className="font-display text-3xl font-medium text-chalk">
                    {labelFor(id)}
                  </span>
                </motion.button>
              ))}
              <div className="mt-8 flex gap-3">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/15 px-4 py-2 text-sm text-chalk"
                >
                  GitHub
                </a>
                <a
                  href={profile.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink-900"
                >
                  Résumé
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

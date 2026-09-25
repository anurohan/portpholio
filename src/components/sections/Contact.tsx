"use client";

import { motion } from "framer-motion";
import { Section, Eyebrow, Reveal, revealItem } from "./Section";
import MagneticButton from "@/components/ui/MagneticButton";
import { profile } from "@/content/profile";

type Channel = { label: string; value: string; href: string; external?: boolean };

function buildChannels(): Channel[] {
  const list: Channel[] = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    {
      label: "GitHub",
      value: `@${profile.github}`,
      href: profile.githubUrl,
      external: true,
    },
  ];
  if (profile.phone) {
    list.push({
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s+/g, "")}`,
    });
  }
  if (profile.linkedin) {
    list.push({
      label: "LinkedIn",
      value: profile.linkedinHandle,
      href: profile.linkedin,
      external: true,
    });
  }
  return list;
}

export default function Contact() {
  const channels = buildChannels();

  return (
    <Section id="contact" scrim="center" min="min-h-screen">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow index="10">Contact</Eyebrow>
          <motion.h2
            variants={revealItem}
            className="display-xl text-chalk"
          >
            Let&apos;s build something.
          </motion.h2>
          <motion.p
            variants={revealItem}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Open to internships, collaborations and interesting problems in AI,
            software and systems that touch the physical world. The fastest way
            to reach me is email.
          </motion.p>

          <motion.div
            variants={revealItem}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton
              href={`mailto:${profile.email}`}
              className="rounded-md bg-signal px-6 py-3 text-sm font-semibold text-ink-900"
              ariaLabel="Email Raushan Kumar"
            >
              {profile.email} ↗
            </MagneticButton>
            <MagneticButton
              href={profile.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-chalk hover:border-white/45"
              ariaLabel="Open résumé"
            >
              Résumé
            </MagneticButton>
          </motion.div>
        </Reveal>

        <Reveal className="mt-14">
          <motion.div
            variants={revealItem}
            className="mx-auto grid max-w-2xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8 sm:grid-cols-2"
          >
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                data-cursor="hover"
                className="group flex flex-col gap-1 bg-ink-900/70 px-6 py-5 text-left transition-colors hover:bg-ink-800/70"
              >
                <span className="mono text-[0.62rem] tracking-[0.22em] text-muted">
                  {c.label.toUpperCase()}
                </span>
                <span className="text-chalk transition-colors group-hover:text-signal">
                  {c.value}
                </span>
              </a>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </Section>
  );
}

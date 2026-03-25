"use client";

import { motion } from "motion/react";
import { Shield, FileWarning, Eye, Box, GitMerge } from "lucide-react";

const principles = [
  {
    title: "Zero-trust by default",
    description: "Do not assume packages, artifacts, images, or even scanners are safe.",
    icon: Shield,
  },
  {
    title: "Policy before convenience",
    description: "Pinning, provenance, and trust rules come before installation speed.",
    icon: FileWarning,
  },
  {
    title: "Explainable decisions",
    description: "Every decision should be reviewable and defensible.",
    icon: Eye,
  },
  {
    title: "Isolation for uncertainty",
    description: "If something is not safe enough to trust, it belongs in a sandbox.",
    icon: Box,
  },
  {
    title: "Promotion is a security event",
    description: "Artifacts and images should be verified before they move deeper into the enterprise.",
    icon: GitMerge,
  },
];

export function SecurityPrinciples() {
  return (
    <section id="principles" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Core Philosophy</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security Design Principles
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            TrustGate is built around these five core principles to ensure a robust and uncompromising approach to supply chain security.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-start p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <principle.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {index + 1}. {principle.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

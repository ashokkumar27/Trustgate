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
    <section id="principles" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Core Philosophy</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Security Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Principles</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            TrustGate is built around these five core principles to ensure a robust and uncompromising approach to supply chain security.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex flex-col items-start p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all min-w-0 group ${
                  index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
                }`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <principle.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {index + 1}. {principle.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
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

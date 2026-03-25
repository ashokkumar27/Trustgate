"use client";

import { motion } from "motion/react";
import { ShieldAlert, PackageCheck, Lock, GitBranch, TerminalSquare, SearchCode } from "lucide-react";

const features = [
  {
    name: "Dependency Discipline",
    description: "Enforce exact package version pins, validate requirements.txt files, and mandate hash pin support to ensure deterministic builds.",
    icon: GitBranch,
  },
  {
    name: "Package Trust Analysis",
    description: "Inspect metadata, detect yanked releases, analyze archives for startup-hooks (.pth, sitecustomize.py), and flag suspicious code patterns or native binaries.",
    icon: SearchCode,
  },
  {
    name: "External Trust Signals",
    description: "Automatically look up OSV advisories and integrate OpenSSF Scorecard signals with explainable weak-check evidence.",
    icon: ShieldAlert,
  },
  {
    name: "Enterprise Supply-Chain Controls",
    description: "Enforce internal mirrors, approved container registries, Sigstore/Cosign verification, and SLSA provenance validation hooks.",
    icon: Lock,
  },
  {
    name: "Isolation Controls",
    description: "Generate hardened Docker sandbox commands with non-root execution, read-only filesystems, dropped capabilities, and disabled networking.",
    icon: PackageCheck,
  },
  {
    name: "CI/CD Behavior",
    description: "Automation-friendly CLI output with strict exit codes (0=ALLOW, 1=SANDBOX, 2=BLOCK) for policy-driven gate decisions in your pipelines.",
    icon: TerminalSquare,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Enterprise Controls</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for a secure supply chain
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            TrustGate provides a comprehensive suite of tools to analyze, verify, and control the code that enters your organization.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-start p-8 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <feature.icon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-7 text-white mb-3">
                  {feature.name}
                </h3>
                <p className="text-base leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

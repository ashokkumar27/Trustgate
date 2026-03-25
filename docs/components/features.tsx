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
    <section id="features" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Enterprise Controls</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">secure supply chain</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            TrustGate provides a comprehensive suite of tools to analyze, verify, and control the code that enters your organization.
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col items-start p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all min-w-0 overflow-hidden group ${
                  index === 0 || index === 3 || index === 4 ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold leading-7 text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-base leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

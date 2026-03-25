"use client";

import { motion } from "motion/react";
import { Terminal } from "lucide-react";

const commands = [
  {
    title: "Analyze a single package locally",
    command: "trustgate analyze requests==2.32.3 --policy policies/local_analysis_policy.json",
    output: `[INFO] Loading local_analysis_policy.json...
[INFO] Analyzing package: requests==2.32.3
[PASS] Risk score: 15/100
[DECISION] ALLOW`
  },
  {
    title: "Validate a requirements file",
    command: "trustgate analyze-requirements requirements.txt --policy policies/local_analysis_policy.json",
    output: `[INFO] Analyzing 12 dependencies...
[WARN] Package 'malicious-pkg' flagged by threat intel
[FAIL] Risk score: 95/100
[DECISION] BLOCK`
  },
  {
    title: "Verify a built artifact",
    command: "trustgate verify-artifact --artifact dist/pkg.whl --bundle dist/pkg.sigstore.json --provenance dist/pkg.provenance.json --policy policies/enterprise_policy.json",
    output: `[INFO] Checking artifact signature...
[INFO] Verifying provenance...
[PASS] Artifact verified successfully
[DECISION] ALLOW`
  },
  {
    title: "Verify a container image",
    command: "trustgate verify-image --image registry.internal/app:1.2.3 --provenance prov.json --policy policies/enterprise_policy.json",
    output: `[INFO] Checking approved registry rules...
[INFO] Verifying Cosign signature...
[INFO] Validating SLSA provenance...
[PASS] Image verified successfully
[DECISION] ALLOW`
  },
  {
    title: "Show the active built-in policy",
    command: "trustgate policy-show",
    output: `[INFO] Active Policy: local_analysis_policy.json
- exact_pins_required: true
- signatures_mandatory: false
- provenance_required: false
- sandbox_on_weak_scorecard: false`
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Quick Start</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple CLI, Powerful Results
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            TrustGate is designed to be easy to use locally and seamless to integrate into your CI/CD pipelines.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {commands.map((cmd, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl border border-slate-200 bg-slate-900 overflow-hidden shadow-xl min-w-0 ring-1 ring-white/10 hover:shadow-2xl hover:ring-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/80 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80 border border-rose-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80 border border-amber-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-500/50"></div>
                </div>
                <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                  <Terminal className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-400">{cmd.title}</span>
                </div>
                <div className="w-12"></div> {/* Spacer for centering */}
              </div>
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
                <div className="flex mb-4">
                  <span className="text-blue-400 mr-2">$</span>
                  <span className="text-white whitespace-pre">{cmd.command}</span>
                </div>
                <pre className="text-slate-400 whitespace-pre-wrap">
                  {cmd.output.split('\n').map((line, i) => {
                    if (line.includes('[PASS]')) return <span key={i} className="text-emerald-400 block">{line}</span>;
                    if (line.includes('[FAIL]') || line.includes('[WARN]')) return <span key={i} className="text-rose-400 block">{line}</span>;
                    if (line.includes('[DECISION] ALLOW')) return <span key={i} className="text-blue-400 font-bold block">{line}</span>;
                    if (line.includes('[DECISION] BLOCK')) return <span key={i} className="text-rose-500 font-bold block">{line}</span>;
                    return <span key={i} className="block">{line}</span>;
                  })}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

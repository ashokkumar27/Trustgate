"use client";

import { motion } from "motion/react";
import { FileCode, Activity, ShieldAlert, CheckCircle } from "lucide-react";

export function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Architecture</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How TrustGate Makes Decisions
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            A transparent, policy-driven approach to evaluating risk.
          </p>
        </div>

        <div className="mx-auto max-w-5xl relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                step: "1",
                title: "Policy Loaded",
                desc: "Local or enterprise policy defines acceptable risk thresholds (pins, signatures, provenance).",
                icon: FileCode,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20"
              },
              {
                step: "2",
                title: "Signals Collected",
                desc: "Analyzers inspect metadata, archives, OSV advisories, Scorecards, and signatures.",
                icon: Activity,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
              },
              {
                step: "3",
                title: "Risk Scored",
                desc: "Signals are evaluated against the policy. Missing provenance or startup hooks increase risk.",
                icon: ShieldAlert,
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                border: "border-rose-500/20"
              },
              {
                step: "4",
                title: "Decision Made",
                desc: "A final ALLOW, BLOCK, or SANDBOX (isolated review) decision is enforced.",
                icon: CheckCircle,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl"
              >
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${item.bg} border ${item.border}`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <div className="text-sm font-bold text-slate-500 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

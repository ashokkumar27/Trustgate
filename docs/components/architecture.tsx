"use client";

import { motion } from "motion/react";
import { FileCode, Activity, ShieldAlert, CheckCircle } from "lucide-react";

export function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Architecture</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How TrustGate Makes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Decisions</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A transparent, policy-driven approach to evaluating risk.
          </p>
        </div>

        <div className="mx-auto max-w-5xl relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                step: "1",
                title: "Policy Loaded",
                desc: "Local or enterprise policy defines acceptable risk thresholds (pins, signatures, provenance).",
                icon: FileCode,
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100"
              },
              {
                step: "2",
                title: "Signals Collected",
                desc: "Analyzers inspect metadata, archives, OSV advisories, Scorecards, and signatures.",
                icon: Activity,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-100"
              },
              {
                step: "3",
                title: "Risk Scored",
                desc: "Signals are evaluated against the policy. Missing provenance or startup hooks increase risk.",
                icon: ShieldAlert,
                color: "text-rose-600",
                bg: "bg-rose-50",
                border: "border-rose-100"
              },
              {
                step: "4",
                title: "Decision Made",
                desc: "A final ALLOW, BLOCK, or SANDBOX (isolated review) decision is enforced.",
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 min-w-0 group"
              >
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full ${item.bg} border ${item.border} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <div className="text-sm font-bold text-slate-400 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

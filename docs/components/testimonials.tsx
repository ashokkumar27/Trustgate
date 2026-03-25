"use client";

import { motion } from "motion/react";
import { ShieldAlert, Quote, AlertTriangle } from "lucide-react";

const testimonials = [
  {
    quote: "We almost pulled in a compromised LiteLLM dependency update during a routine CI run. TrustGate's sandbox analysis flagged anomalous network exfiltration to an unknown IP before it ever reached our dev environment. Saved our entire AI infrastructure.",
    author: "Sarah Jenkins",
    role: "Lead DevSecOps @ AI Startup",
    threat: "LiteLLM Supply Chain Compromise",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200"
  },
  {
    quote: "When the xz-utils backdoor hit, our team was panicking. We checked our TrustGate logs and realized our enterprise policy had automatically blocked the compromised version weeks ago due to anomalous maintainer trust signals.",
    author: "Marcus T.",
    role: "Principal Security Engineer",
    threat: "XZ Utils Backdoor (CVE-2024-3094)",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  {
    quote: "Caught a typosquatted requests package ('requessts') that a junior dev accidentally added to requirements.txt. TrustGate blocked the build immediately and suggested the correct package. Zero-trust actually working in practice.",
    author: "Alex K.",
    role: "Platform Architect",
    threat: "PyPI Typosquatting",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  }
];

export function Testimonials() {
  return (
    <section id="impact" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-blue-50 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 mb-6">
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Real-World Impact</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Threats Neutralized in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-500">Wild</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Don&apos;t just take our word for it. See how TrustGate&apos;s zero-trust architecture has actively prevented catastrophic supply chain attacks for real engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col justify-between p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative group hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 min-w-0"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-100 group-hover:text-slate-200 transition-colors" />
              
              <div>
                <div className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-6 ${testimonial.bg} ${testimonial.color} ${testimonial.border}`}>
                  <ShieldAlert className="mr-1.5 h-3 w-3" />
                  Prevented: {testimonial.threat}
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-8 relative z-10">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{testimonial.author}</div>
                  <div className="text-xs text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

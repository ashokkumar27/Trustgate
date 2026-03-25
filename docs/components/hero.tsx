"use client";

import { motion } from "motion/react";
import { ArrowRight, Terminal, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-6">
              <Shield className="mr-2 h-4 w-4" />
              <span>Zero-trust supply chain security</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">software supply chain</span> with confidence.
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
              TrustGate Enterprise is an open-source tool for package trust analysis, artifact verification, and CI/CD gating. Stop malicious dependencies before they reach production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="https://github.com/ashokkumar27/Trustgate"
                target="_blank"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                View on GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all"
              >
                How it works
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Python-based</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>CI/CD Ready</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg"
          >
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="flex items-center border-b border-slate-800 px-4 py-3 bg-slate-950/50">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="mx-auto flex items-center text-xs text-slate-500 font-mono">
                  <Terminal className="mr-2 h-3 w-3" />
                  bash
                </div>
              </div>
              <div className="p-5 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
                <div className="flex">
                  <span className="text-emerald-400 mr-2">$</span>
                  <span className="text-white">git clone https://github.com/ashokkumar27/Trustgate.git</span>
                </div>
                <div className="flex mt-2">
                  <span className="text-emerald-400 mr-2">$</span>
                  <span className="text-white">cd Trustgate && pip install .</span>
                </div>
                <div className="flex mt-4">
                  <span className="text-emerald-400 mr-2">$</span>
                  <span className="text-white">trustgate analyze requests==2.32.3 --policy policies/local_analysis_policy.json</span>
                </div>
                <div className="mt-2 text-slate-400">
                  [INFO] Loading local_analysis_policy.json...<br/>
                  [INFO] Analyzing package: requests==2.32.3<br/>
                  [INFO] Checking external trust signals...<br/>
                  <span className="text-emerald-400">[PASS] Risk score: 15/100 (Low Risk)</span><br/>
                  <span className="text-indigo-400">[DECISION] ALLOW</span>
                </div>
              </div>
            </div>
            
            {/* Decorative floating elements */}
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md p-4 shadow-xl flex items-center justify-center transform rotate-6">
              <Shield className="h-10 w-10 text-indigo-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

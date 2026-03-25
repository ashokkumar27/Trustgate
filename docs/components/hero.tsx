"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Terminal, Shield, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [typingText, setTypingText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const fullText = "trustgate analyze requests==2.32.3 --policy policies/local_analysis_policy.json";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypingText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setTimeout(() => setShowOutput(true), 500);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-full max-w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl min-w-0"
          >
            <Link 
              href="https://github.com/ashokkumar27/Trustgate/releases" 
              target="_blank"
              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-6 shadow-sm hover:bg-blue-100 transition-colors cursor-pointer"
            >              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              <span>TrustGate v1.0 is now available</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Secure your <span className="text-blue-600">software supply chain</span> with confidence.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
              TrustGate is an enterprise-grade open-source tool for package trust analysis, artifact verification, and CI/CD gating. Stop malicious dependencies before they reach production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="https://github.com/ashokkumar27/Trustgate"
                target="_blank"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all w-full sm:w-auto"
              >
                View on GitHub
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all w-full sm:w-auto"
              >
                How it works
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>Python-based</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>CI/CD Ready</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mt-8 lg:mt-0 min-w-0"
          >
            <div className="rounded-xl border border-slate-200 bg-slate-900 shadow-2xl overflow-hidden ring-1 ring-white/10">
              <div className="flex items-center border-b border-slate-800 px-4 py-3 bg-slate-950/80 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80 border border-rose-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80 border border-amber-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 border border-emerald-500/50"></div>
                </div>
                <div className="mx-auto flex items-center text-xs text-slate-400 font-mono">
                  <Terminal className="mr-2 h-3 w-3" />
                  bash
                </div>
              </div>
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 overflow-x-auto whitespace-pre min-h-[220px]">
                <div className="flex">
                  <span className="text-blue-400 mr-2">$</span>
                  <span className="text-white">git clone https://github.com/ashokkumar27/Trustgate.git</span>
                </div>
                <div className="flex mt-2">
                  <span className="text-blue-400 mr-2">$</span>
                  <span className="text-white">cd Trustgate && pip install .</span>
                </div>
                <div className="flex mt-4 items-center">
                  <span className="text-blue-400 mr-2">$</span>
                  <span className="text-white">{typingText}</span>
                  {!showOutput && <span className="w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>}
                </div>
                {showOutput && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-slate-400"
                  >
                    [INFO] Loading local_analysis_policy.json...<br/>
                    [INFO] Analyzing package: requests==2.32.3<br/>
                    [INFO] Checking external trust signals...<br/>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-emerald-400">[PASS] Risk score: 15/100 (Low Risk)</span><br/>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="text-blue-400 font-bold">[DECISION] ALLOW</span>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Decorative floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hidden sm:flex absolute -right-6 -bottom-6 h-24 w-24 rounded-xl border border-slate-200 bg-white p-4 shadow-xl items-center justify-center transform rotate-6"
            >
              <Shield className="h-10 w-10 text-blue-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

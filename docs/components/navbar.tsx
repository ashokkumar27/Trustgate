"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Github, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 origin-left" 
        style={{ scaleX }} 
      />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold tracking-tight text-slate-900">TrustGate</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#architecture" className="hover:text-slate-900 transition-colors">Architecture</Link>
          <Link href="#principles" className="hover:text-slate-900 transition-colors">Principles</Link>
          <Link href="#impact" className="hover:text-slate-900 transition-colors">Real-World Impact</Link>
          <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="https://github.com/ashokkumar27/Trustgate" 
            target="_blank" 
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white pl-2 pr-3 py-1.5 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-center bg-slate-100 rounded-full p-1 group-hover:bg-slate-200 transition-colors">
              <Github className="h-4 w-4" />
            </div>
            <span>Star on GitHub</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-500 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</Link>
              <Link href="#architecture" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Architecture</Link>
              <Link href="#principles" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Principles</Link>
              <Link href="#impact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">Real-World Impact</Link>
              <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-slate-900">How it Works</Link>
              <div className="pt-4 border-t border-slate-200">
                <Link 
                  href="https://github.com/ashokkumar27/Trustgate" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <Github className="h-5 w-5" />
                  <span>Star on GitHub</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

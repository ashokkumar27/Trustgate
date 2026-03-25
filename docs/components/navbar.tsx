"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Github, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-indigo-500" />
          <span className="text-lg font-bold tracking-tight">TrustGate</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#architecture" className="hover:text-white transition-colors">Architecture</Link>
          <Link href="#principles" className="hover:text-white transition-colors">Principles</Link>
          <Link href="#impact" className="hover:text-white transition-colors">Real-World Impact</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="https://github.com/ashokkumar27/Trustgate" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Star on GitHub</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white"
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
            className="md:hidden border-t border-slate-800 bg-slate-950 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white">Features</Link>
              <Link href="#architecture" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white">Architecture</Link>
              <Link href="#principles" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white">Principles</Link>
              <Link href="#impact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white">Real-World Impact</Link>
              <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-300 hover:text-white">How it Works</Link>
              <div className="pt-4 border-t border-slate-800">
                <Link 
                  href="https://github.com/ashokkumar27/Trustgate" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
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

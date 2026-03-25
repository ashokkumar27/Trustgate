import Link from "next/link";
import { ShieldCheck, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
              <span className="text-lg font-bold tracking-tight text-white">TrustGate</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Zero-trust supply chain security, package analysis, and CI/CD gating. Open source and built for the enterprise.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/ashokkumar27/Trustgate" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/issues" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/pulls" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/blob/main/LICENSE" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">
                  License
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/security" target="_blank" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Security Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TrustGate Contributors. Released under the Apache 2.0 License.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Built for the open source community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

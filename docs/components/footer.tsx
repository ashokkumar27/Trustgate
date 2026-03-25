import Link from "next/link";
import { ShieldCheck, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold tracking-tight text-slate-900">TrustGate</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm mb-6">
              Zero-trust supply chain security, package analysis, and CI/CD gating. Open source and built for the enterprise.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/ashokkumar27/Trustgate" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate" target="_blank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/issues" target="_blank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/pulls" target="_blank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/blob/main/LICENSE" target="_blank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  License
                </Link>
              </li>
              <li>
                <Link href="https://github.com/ashokkumar27/Trustgate/security" target="_blank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  Security Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
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

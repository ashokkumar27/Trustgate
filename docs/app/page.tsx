import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Architecture } from "@/components/architecture";
import { Testimonials } from "@/components/testimonials";
import { SecurityPrinciples } from "@/components/security-principles";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Architecture />
        <SecurityPrinciples />
        <Testimonials />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

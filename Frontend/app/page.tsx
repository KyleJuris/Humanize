import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TrustSection } from "@/components/trust-section"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <TrustSection />
      <FAQSection />
    </main>
  )
}

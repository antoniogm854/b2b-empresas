import OnboardingWizard from "@/components/cdb2b/onboarding/OnboardingWizard";
import ThemeToggle from "@/components/theme/ThemeToggle";

export const metadata = {
  title: "Onboarding | CATALOGO DIGITAL B2B",
  description: "Crea tu propio catálogo digital B2B en menos de un minuto.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)]/30 transition-colors duration-300 industrial-bg">
      <div className="fixed top-8 right-8 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 relative z-10">
        <OnboardingWizard />
      </div>
    </div>
  );
}

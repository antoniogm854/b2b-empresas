import OnboardingWizard from "@/components/cdb2b/onboarding/OnboardingWizard";
import AuthLayout from "@/components/layout/AuthLayout";

export const metadata = {
  title: "Onboarding | CATALOGO DIGITAL B2B",
  description: "Crea tu propio catálogo digital B2B en menos de un minuto.",
};

export default function OnboardingPage() {
  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto py-12 md:py-24">
        <OnboardingWizard />
      </div>
    </AuthLayout>
  );
}

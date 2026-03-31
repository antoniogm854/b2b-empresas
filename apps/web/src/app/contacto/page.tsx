import PublicLayout from "@/components/layout/PublicLayout";
import ContactoClient from "./ContactoClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto Industrial | B2B EMPRESAS",
  description: "¿Dudas sobre digitalización? Conecta con nuestro equipo técnico y obtén asesoría personalizada para tu empresa.",
};

export default function ContactoPage() {
  return (
    <PublicLayout>
       <ContactoClient />
    </PublicLayout>
  );
}

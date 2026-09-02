import { HeroSection } from "@/sections/home/HeroSection";
import { ManifestoSection } from "@/sections/home/ManifestoSection";
import { SelectedProjectsSection } from "@/sections/home/SelectedProjectsSection";
import { StudioIntroSection } from "@/sections/home/StudioIntroSection";
import { FeaturedProjectSection } from "@/sections/home/FeaturedProjectSection";
import { ServicesSection } from "@/sections/home/ServicesSection";
import { MethodSection } from "@/sections/home/MethodSection";
import { ContactSection } from "@/sections/home/ContactSection";

/**
 * Home Page — Ordem oficial Studio AM V2.5
 *
 * 1. Hero
 * 2. Manifesto
 * 3. Projetos Selecionados
 * 4. Anne Martins (Sobre)
 * 5. Casa Andreia e Marco (Caso de Estudo)
 * 6. Serviços (Nossa Atuação)
 * 7. Processo (O Processo)
 * 8. Contato
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ManifestoSection />
      <SelectedProjectsSection />
      <StudioIntroSection />
      <FeaturedProjectSection />
      <ServicesSection />
      <MethodSection />
      <ContactSection />
    </>
  );
}

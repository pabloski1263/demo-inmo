import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPropertiesSection from "@/components/FeaturedPropertiesSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const content = getContent();

  return (
    <>
      <Navbar />
      <HeroSection
        agent={content.agent}
        phone={content.contact.phone}
        email={content.contact.email}
      />
      <FeaturedPropertiesSection
        title_en={content.featured.title_en}
        title_es={content.featured.title_es}
        subtitle_en={content.featured.subtitle_en}
        subtitle_es={content.featured.subtitle_es}
      />
      <AboutSection content={content} />
      <ServicesSection
        title_en={content.services.title_en}
        title_es={content.services.title_es}
        items={content.services.items}
      />
      <ContactSection
        title_en={content.contact.title_en}
        title_es={content.contact.title_es}
        address={content.contact.address}
        phone={content.contact.phone}
        email={content.contact.email}
        hours_en={content.contact.hours_en}
        hours_es={content.contact.hours_es}
        whatsapp={content.agent.social.whatsapp}
        review_link={content.agent.review_link}
        review_text_en={content.agent.review_text_en}
        review_text_es={content.agent.review_text_es}
      />
      <Footer content={content} />
    </>
  );
}

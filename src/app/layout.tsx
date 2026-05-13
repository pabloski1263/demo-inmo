import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent();
  return {
    title: content.site.name,
    description: content.hero.title_es,
    icons: content.site.favicon ? { icon: content.site.favicon } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen bg-white text-gray-900 font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://studioam.com.br'),
  title: {
    default: 'Studio AM — Arquitetura + Engenharia',
    template: '%s | Studio AM',
  },
  description: 'Arquitetura que conecta. Engenharia que sustenta. Projetos residenciais, comerciais e interiores com acompanhamento técnico completo.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Studio AM',
    title: 'Studio AM — Arquitetura + Engenharia',
    description: 'Arquitetura que conecta. Engenharia que sustenta.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio AM — Arquitetura + Engenharia',
    description: 'Arquitetura que conecta. Engenharia que sustenta.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

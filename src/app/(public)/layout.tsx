import { SkipLink } from "@/components/navigation/SkipLink";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}

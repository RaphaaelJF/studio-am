import type { Metadata } from 'next'

// Página placeholder — fora do índice até ter conteúdo real.
export const metadata: Metadata = {
  title: 'Contato | Studio AM',
  robots: { index: false, follow: false },
}

export default function ContactPage() {
  return (
    <main>
      <h1>Contato</h1>
    </main>
  );
}

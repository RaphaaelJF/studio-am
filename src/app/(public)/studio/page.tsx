import type { Metadata } from 'next'

// Página placeholder — fora do índice até ter conteúdo real.
export const metadata: Metadata = {
  title: 'Studio | Studio AM',
  robots: { index: false, follow: false },
}

export default function StudioPage() {
  return (
    <main>
      <h1>Studio</h1>
    </main>
  );
}

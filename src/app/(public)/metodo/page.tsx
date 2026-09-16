import type { Metadata } from 'next'

// Página placeholder — fora do índice até ter conteúdo real.
export const metadata: Metadata = {
  title: 'Método | Studio AM',
  robots: { index: false, follow: false },
}

export default function MethodPage() {
  return (
    <main>
      <h1>Método</h1>
    </main>
  );
}

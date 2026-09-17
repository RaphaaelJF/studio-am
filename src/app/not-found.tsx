import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-medium text-[#171717] mb-4">
        Página não encontrada
      </h1>
      <p className="text-base text-[#595959] max-w-md mb-8">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center bg-[#171717] text-white px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}

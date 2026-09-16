import React from "react";
import Link from 'next/link';

/* ── Ilustrações da seção O Processo (visuais fornecidos, uso exato) ── */

export function ChatIllustration() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conversa e levantamento" className="h-[72px] w-[72px] shrink-0">
      <defs>
        <filter id="chatShadow" x="0" y="0" width="84" height="84">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.10" />
        </filter>
      </defs>

      <g filter="url(#chatShadow)">
        <path
          d="M24 41C24 31.6 31.6 24 41 24H48C57.4 24 65 31.6 65 41C65 50.4 57.4 58 48 58H44L35 64L37.5 58H41C31.6 58 24 50.4 24 41Z"
          fill="#5F6972"
        />
        <path
          d="M15 33C15 24.7 21.7 18 30 18H38C46.3 18 53 24.7 53 33C53 41.3 46.3 48 38 48H34L25.5 54L27.8 48H30C21.7 48 15 41.3 15 33Z"
          fill="#ECE5DB"
        />
      </g>
    </svg>
  );
}

export function HouseBlueprintIllustration() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estudo e desenvolvimento da planta" className="h-[72px] w-[72px] shrink-0">
      <defs>
        <linearGradient id="paperGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7F4EE" />
          <stop offset="100%" stopColor="#E3DCCD" />
        </linearGradient>
        <filter id="houseShadow2" x="0" y="0" width="84" height="84">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      <g filter="url(#houseShadow2)">
        {/* Folha de planta */}
        <g transform="rotate(-8 38 44)">
          <rect x="20" y="20" width="36" height="48" rx="3" fill="url(#paperGrad2)" stroke="#CFC4B6" strokeWidth="1.5" />
          <path d="M27 29 H49 V61 H27 Z" stroke="#7A7166" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <path d="M27 45 H40 M40 45 V61" stroke="#A89C8B" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M40 55 A6 6 0 0 1 46 61" stroke="#A89C8B" strokeWidth="1.3" strokeDasharray="2.5 2" fill="none" />
          <rect x="33" y="27.5" width="10" height="3" rx="1" fill="#B98A4E" />
        </g>
        {/* Lápis */}
        <g transform="rotate(28 58 52)">
          <rect x="54.5" y="30" width="7" height="26" rx="2" fill="#B98A4E" />
          <rect x="54.5" y="30" width="7" height="5" rx="2" fill="#5B554F" />
          <path d="M54.5 56 L58 64 L61.5 56 Z" fill="#E9DCC8" stroke="#C9BFAE" strokeWidth="1" strokeLinejoin="round" />
          <path d="M57 61.5 L58 64 L59 61.5 Z" fill="#44484D" />
        </g>
      </g>
    </svg>
  );
}

export function ClipboardApprovalIllustration() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aprovação e integração da documentação" className="h-[72px] w-[72px] shrink-0">
      <defs>
        <filter id="clipShadow" x="0" y="0" width="84" height="84">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.10" />
        </filter>
      </defs>

      <g filter="url(#clipShadow)">
        <rect x="22" y="18" width="36" height="48" rx="6" fill="#E6E9ED" />
        <rect x="31" y="13" width="18" height="10" rx="4" fill="#44484D" />
        <rect x="27" y="27" width="24" height="3" rx="1.5" fill="#B5BCC5" />
        <rect x="27" y="35" width="18" height="3" rx="1.5" fill="#B5BCC5" />
        <rect x="27" y="43" width="20" height="3" rx="1.5" fill="#B5BCC5" />

        <circle cx="55" cy="55" r="12" fill="#B98A4E" />
        <path
          d="M50 55L53.5 58.5L60 51.5"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function HelmetIllustration() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Acompanhamento da obra" className="h-[72px] w-[72px] shrink-0">
      <defs>
        <linearGradient id="helmetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCFBF9" />
          <stop offset="100%" stopColor="#E5DED5" />
        </linearGradient>
        <filter id="helmetShadow" x="0" y="0" width="84" height="84">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#000000" floodOpacity="0.14" />
        </filter>
      </defs>

      <g filter="url(#helmetShadow)">
        <path
          d="M22 48C22 36.4 31.4 27 43 27C54.6 27 64 36.4 64 48V50H22V48Z"
          fill="url(#helmetGrad)"
          stroke="#D7CFC5"
          strokeWidth="1.4"
        />
        <rect
          x="18"
          y="49"
          width="48"
          height="8"
          rx="4"
          fill="#F4F0EB"
          stroke="#D7CFC5"
          strokeWidth="1.4"
        />
        <path d="M43 28V47" stroke="#D2C7BB" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M34 31C31 34 29.5 38 29.5 43" stroke="#D2C7BB" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M52 31C55 34 56.5 38 56.5 43" stroke="#D2C7BB" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M28 57V59.5" stroke="#D2C7BB" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M58 57V59.5" stroke="#D2C7BB" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ── Etapas ── */

const steps = [
  {
    number: "01",
    title: "Conversar e levantar",
    description:
      "Ouvimos sua rotina e seus objetivos, e levantamos medidas, fotos e documentos do terreno ou imóvel para partir de dados reais.",
    icon: <ChatIllustration />,
  },
  {
    number: "02",
    title: "Estudar e desenvolver",
    description:
      "Desenvolvemos o estudo: implantação, planta e volumetria, ajustando o desenho ao orçamento até chegar ao partido ideal.",
    icon: <HouseBlueprintIllustration />,
  },
  {
    number: "03",
    title: "Aprovar e integrar",
    description:
      "Detalhamos o projeto executivo e compatibilizamos arquitetura, estrutura e instalações, gerando a documentação completa da obra.",
    icon: <ClipboardApprovalIllustration />,
  },
  {
    number: "04",
    title: "Acompanhar e orientar",
    description:
      "Acompanhamos a execução com visitas e orientações técnicas, preservando a fidelidade ao projeto aprovado.",
    icon: <HelmetIllustration />,
  },
];

export function MethodSection() {
  return (
    <section id="processo" aria-label="Metodologia — O Processo" className="py-24 px-6 bg-[#FAF8F5] scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16">
          <span className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-[#8C7A6B] block mb-3 font-medium">
            Metodologia
          </span>
          <h2 className="text-[2.4rem] md:text-[3.4rem] font-light tracking-[-0.05em] text-[#1A1A1A] mb-4 leading-[1.08]">
            O Processo
          </h2>
          <p className="text-[#666666] text-[1rem] md:text-lg font-light leading-relaxed">
            Do terreno à execução, você entende cada etapa.
          </p>
        </div>

        {/* Grid dos Passos */}
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
          {steps.map((step) => (
            <li
              key={step.number}
              className="bg-white p-8 rounded-[1.75rem] border border-[#EFECE6] relative group hover:border-[#8C7A6B] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {step.icon}
                </div>
                <span className="text-[2.25rem] md:text-[2.6rem] font-light leading-none tracking-[-0.08em] text-[#D3C7B8]">
                  {step.number}
                </span>
              </div>
              <h3 className="text-[2rem] md:text-[2.05rem] font-normal leading-[1.08] tracking-[-0.04em] text-[#1A1A1A] mb-4 max-w-[10.5ch]">
                {step.title}
              </h3>
              <p className="text-[#4A4947] text-[1rem] md:text-[1.05rem] leading-[1.7] tracking-[-0.012em] font-normal">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        {/* CTA editorial para /metodo */}
        <div className="mt-14 text-center">
          <p className="text-[#666666] text-[0.95rem] font-normal mb-3">
            Conheça cada etapa em detalhes.
          </p>
          <Link
            href="/metodo"
            className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase text-[#1A1A1A] hover:text-[#8C7A6B] transition-colors duration-200 py-3 group"
          >
            Ver o método completo
            <span aria-hidden="true" className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MethodSection;

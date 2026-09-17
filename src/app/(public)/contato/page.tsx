'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CONTACT_INFO } from '@/data/studio';
import { ChevronDownIcon, InstagramIcon } from '@/components/shared/Icons';

const PROJECT_OPTIONS = [
  'Construção Residencial',
  'Reforma',
  'Comercial',
  'Projetos Complementares / Estrutural',
  'Regularização ou Acompanhamento',
];

export default function ContactPage() {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('Construção Residencial');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown customizado ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, Anne! Meu nome é ${nome || '...'}.\nCidade da Obra: ${cidade || '...'}\nNecessidade: ${tipo}\nIdeia Inicial: ${mensagem || '...'}`;
    const encoded = encodeURIComponent(text);
    window.open(`${CONTACT_INFO.whatsapp.url}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-warm-white text-[#171717]">
      {/* Header Editorial */}
      <section className="pt-16 md:pt-24 pb-12 px-6 md:px-12 border-b border-light-gray">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#595959] mb-3">
            Atendimento & Contato
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#171717] leading-tight max-w-4xl">
            Vamos falar sobre o seu projeto.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#404040] max-w-2xl font-normal leading-relaxed">
            Envie as informações preliminares no formulário abaixo para iniciarmos o atendimento e alinharmos os primeiros passos do seu projeto.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal: Informações de Contato + Formulário */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-warm-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Coluna Esquerda: Informações Institucionais e Atendimento */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-700 mb-2">
                Informações de Contato
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                Atendimento
              </h2>
              <p className="text-neutral-700 text-base leading-relaxed">
                Priorizamos a agilidade e o contato direto para tirar dúvidas sobre viabilidade, prazos e escopo do seu projeto.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-t border-neutral-200 pt-6">
                <span className="text-xs uppercase tracking-widest text-neutral-800 font-semibold block mb-2">
                  Atendimento
                </span>
                <p className="text-sm text-neutral-600">
                  Segunda a Sexta, das 09h às 18h.
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <span className="text-xs uppercase tracking-widest text-neutral-800 font-semibold block mb-2">
                  Atuação
                </span>
                <p className="text-sm text-neutral-600">
                  Projetos e acompanhamentos presenciais e remotos.
                </p>
              </div>

              <div className="border-t border-zinc-300 pt-6">
                <span className="text-xs uppercase tracking-wider text-zinc-900 font-bold block mb-2">
                  Instagram
                </span>
                <a
                  href={CONTACT_INFO.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all group rounded-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                      style={{ background: 'linear-gradient(45deg, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
                    >
                      <InstagramIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-black leading-tight">
                        @_stdam
                      </p>
                      <p className="text-xs text-zinc-700 font-medium mt-0.5 leading-tight">
                        Acompanhe projetos e bastidores
                      </p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-zinc-900 font-bold group-hover:translate-x-1 transition-transform pl-3">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Formulário de Primeiro Contato */}
          <div className="lg:col-span-7 bg-[#0C1014] text-white p-8 md:p-12 rounded-none border border-black/10">
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block mb-2">
                Formulário Inicial
              </span>
              <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                Conte sobre seu projeto
              </h3>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contato-nome" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                    Seu Nome *
                  </label>
                  <input
                    id="contato-nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors text-base placeholder:text-white/30"
                    placeholder="Ex: Carlos Eduardo"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contato-cidade" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                    Cidade / UF da Obra *
                  </label>
                  <input
                    id="contato-cidade"
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors text-base placeholder:text-white/30"
                    placeholder="Ex: Caxias do Sul / RS"
                  />
                </div>
              </div>

              {/* Seletor Customizado — Sem truncamento no mobile */}
              <div className="space-y-2" ref={dropdownRef}>
                <label id="contato-tipo-label" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                  Tipo de Projeto *
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    aria-labelledby="contato-tipo-label"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#111518] border border-white/15 p-4 text-left text-white focus:outline-none focus:border-[#c8baab] transition-colors text-base cursor-pointer flex items-center justify-between"
                  >
                    <span className="pr-3 break-words whitespace-normal leading-snug">{tipo}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <ul
                      role="listbox"
                      className="absolute z-20 top-full left-0 w-full mt-1 bg-[#161a1f] border border-white/20 shadow-2xl py-1"
                    >
                      {PROJECT_OPTIONS.map((opt) => (
                        <li
                          key={opt}
                          role="option"
                          aria-selected={tipo === opt}
                          onClick={() => {
                            setTipo(opt);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-start justify-between gap-3 ${tipo === opt
                              ? 'bg-white/10 text-white font-medium'
                              : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span className="break-words whitespace-normal leading-snug">{opt}</span>
                          {tipo === opt && (
                            <span className="text-[#c8baab] text-xs uppercase tracking-wider font-semibold mt-0.5 shrink-0">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contato-mensagem" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                  Mensagem ou Descrição Inicial
                </label>
                <textarea
                  id="contato-mensagem"
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors text-base resize-none placeholder:text-white/30"
                  placeholder="Conte um pouco sobre o seu projeto..."
                />
                <p className="text-[#a3a3a3] text-xs mt-2 leading-relaxed">
                  Opcional: compartilhe metragem aproximada, se já possui terreno, prazos pretendidos ou suas principais dúvidas.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c8baab] text-[#171717] py-4 px-6 sm:px-8 text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer text-center block"
              >
                <span className="sm:hidden">Abrir WhatsApp →</span>
                <span className="hidden sm:inline">Enviar pelo WhatsApp →</span>
              </button>

              <p className="text-xs text-neutral-400 text-center font-normal">
                Após o envio, a conversa continuará no WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

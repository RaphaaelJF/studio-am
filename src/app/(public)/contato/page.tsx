'use client';

import React, { useState } from 'react';
import { CONTACT_INFO } from '@/data/studio';

export default function ContactPage() {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('Construção Residencial');
  const [mensagem, setMensagem] = useState('');

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
            Inicie a conversa diretamente pelo WhatsApp ou envie as informações preliminares no formulário abaixo para agendarmos uma primeira reunião.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal: Informações de Contato + Formulário */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-warm-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Coluna Esquerda: Canais Diretos */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-2xl font-medium text-[#171717] mb-4">
                Atendimento Direto
              </h2>
              <p className="text-[#404040] text-base leading-relaxed">
                Priorizamos a agilidade e o contato direto com a Anne Martins para tirar dúvidas sobre viabilidade, prazos e escopo.
              </p>
            </div>

            {/* Cartões de Contato Rápido */}
            <div className="space-y-4">
              <a
                href={CONTACT_INFO.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-beige border border-light-gray hover:border-[#8C7A6B] transition-colors group"
              >
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-semibold block mb-1">
                    WhatsApp Comercial
                  </span>
                  <span className="text-lg font-medium text-[#171717]">
                    {CONTACT_INFO.whatsapp.number}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#171717] group-hover:translate-x-1 transition-transform">
                  Conversar →
                </span>
              </a>

              <a
                href={CONTACT_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-beige border border-light-gray hover:border-[#8C7A6B] transition-colors group"
              >
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#8C7A6B] font-semibold block mb-1">
                    Instagram Oficial
                  </span>
                  <span className="text-lg font-medium text-[#171717]">
                    @_stdam
                  </span>
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#171717] group-hover:translate-x-1 transition-transform">
                  Acompanhar →
                </span>
              </a>
            </div>

            <div className="border-t border-light-gray pt-8 text-sm text-[#595959] space-y-2">
              <p>
                <strong className="text-[#171717] font-medium">Horário de Atendimento:</strong> Segunda a Sexta, das 09h às 18h.
              </p>
              <p>
                <strong className="text-[#171717] font-medium">Atuação:</strong> Projetos e acompanhamentos presenciais e remotos.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Formulário de Primeiro Contato */}
          <div className="lg:col-span-7 bg-[#0C1014] text-white p-8 md:p-12 rounded-none border border-black/10">
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block mb-2">
                Formulário Inicial
              </span>
              <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                Conte-nos sobre sua ideia
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

              <div className="space-y-2">
                <label htmlFor="contato-tipo" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                  Tipo de Projeto *
                </label>
                <div className="relative w-full">
                  <select
                    id="contato-tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-[#111518] border border-white/15 p-4 pr-10 text-white focus:outline-none focus:border-[#c8baab] transition-colors text-base cursor-pointer"
                  >
                    <option value="Construção Residencial">Construção Residencial</option>
                    <option value="Projeto Comercial">Projeto Comercial</option>
                    <option value="Reforma ou Ampliação">Reforma ou Ampliação</option>
                    <option value="Projetos Complementares / Estrutural">Projetos Complementares / Estrutural</option>
                    <option value="Regularização ou Acompanhamento">Regularização ou Acompanhamento</option>
                  </select>
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
                  placeholder="Compartilhe metragem aproximada, se já possui terreno, prazos pretendidos ou suas principais dúvidas..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c8baab] text-[#171717] py-4 px-6 sm:px-8 text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer text-center block"
              >
                <span className="sm:hidden">Continuar no WhatsApp →</span>
                <span className="hidden sm:inline">Enviar e Iniciar Conversa no WhatsApp →</span>
              </button>

              <p className="text-xs text-neutral-400 text-center font-normal">
                Ao clicar, você será direcionado para o WhatsApp com os dados preenchidos.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

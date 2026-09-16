'use client';

import React, { useState } from 'react';
import { CONTACT_INFO } from '@/data/studio';

export function ContactSection() {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [tipo, setTipo] = useState('Construção');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, Anne! Meu nome é ${nome || '...'}.\nCidade da Obra: ${cidade || '...'}\nNecessidade: ${tipo}\nIdeia Inicial: ${mensagem || '...'}`;
    const encoded = encodeURIComponent(text);
    // URL pronta para direcionar ao WhatsApp da Anne (número configurável)
    window.open(`${CONTACT_INFO.whatsapp.url}?text=${encoded}`, '_blank');
  };

  return (
    <section id="contato" className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 px-6 md:px-12 bg-black text-white relative">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Coluna Esquerda: Apresentação (~40%) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="w-12 h-px bg-[#c8baab] mb-6"></div>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              Primeiro Contato
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.15] text-white mb-6 tracking-tight">
              Vamos projetar juntos.
            </h2>
            <p className="text-base md:text-[17px] font-normal text-neutral-300 leading-relaxed mb-6">
              Preencha as informações básicas para entendermos seu momento e a sua ideia inicial.
            </p>
            <div className="border-l border-white/15 pl-4 py-1">
              <p className="text-sm text-neutral-400 font-normal leading-relaxed">
                Ao enviar o formulário, você será direcionado para continuar a conversa diretamente no WhatsApp com a Anne.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Formulário (~60%) */}
          <div className="lg:col-span-7">
            <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                    Seu Nome
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors rounded-none text-base font-normal placeholder:text-white/35"
                    placeholder="Ex: João e Maria"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-city" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                    Cidade da Obra
                  </label>
                  <input
                    id="contact-city"
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors rounded-none text-base font-normal placeholder:text-white/35"
                    placeholder="Ex: Gramado"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                  O que você precisa?
                </span>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['Construção', 'Reforma', 'Comercial'].map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input
                        type="radio"
                        name="tipo"
                        value={option}
                        checked={tipo === option}
                        onChange={() => setTipo(option)}
                        className="peer sr-only"
                      />
                      <div className="bg-white/5 border border-white/15 text-[#d4d4d4] text-xs md:text-sm font-normal text-center py-3.5 sm:py-4 peer-checked:bg-white peer-checked:border-white peer-checked:text-black transition-colors">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-idea" className="text-xs font-semibold tracking-widest uppercase text-[#a3a3a3] block">
                  Conte um pouco sobre a ideia inicial (opcional)
                </label>
                <textarea
                  id="contact-idea"
                  rows={3}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 p-4 text-white focus:outline-none focus:border-[#c8baab] transition-colors rounded-none resize-none text-base font-normal placeholder:text-white/35"
                  placeholder="Ex: Terreno com declive, casa térrea com área de convivência..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c8baab] text-[#171717] py-4 md:py-5 font-semibold uppercase tracking-wider text-xs md:text-sm hover:bg-white transition-colors flex justify-center items-center cursor-pointer focus-visible:outline-white"
              >
                Continuar no WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
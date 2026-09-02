'use client';

import React, { useState } from 'react';

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
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <section id="contato" className="scroll-mt-24 md:scroll-mt-28 py-24 md:py-32 px-6 md:px-12 bg-black text-white relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-white/20"></div>
      <div className="max-w-3xl mx-auto mb-16 text-center pt-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">Vamos projetar juntos.</h2>
        <p className="text-base md:text-lg font-light text-white/70 max-w-xl mx-auto">
          Preencha as informações básicas para entendermos seu momento. Você será direcionado para continuar a conversa no WhatsApp diretamente com a Anne.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-[11px] font-semibold tracking-widest uppercase text-gray block">
                Seu Nome
              </label>
              <input
                id="contact-name"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-white/40 transition-colors rounded-none text-sm font-light placeholder:text-white/30"
                placeholder="Ex: João e Maria"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-city" className="text-[11px] font-semibold tracking-widest uppercase text-gray block">
                Cidade da Obra
              </label>
              <input
                id="contact-city"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-white/40 transition-colors rounded-none text-sm font-light placeholder:text-white/30"
                placeholder="Ex: Gramado"
              />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-gray block">
              O que você precisa?
            </span>
            <div className="grid grid-cols-3 gap-2">
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
                  <div className="bg-white/5 border border-white/10 text-light-gray text-xs font-light text-center py-4 peer-checked:bg-white peer-checked:border-white peer-checked:text-black transition-colors">
                    {option}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label htmlFor="contact-idea" className="text-[11px] font-semibold tracking-widest uppercase text-gray block">
              Conte um pouco sobre a ideia inicial (opcional)
            </label>
            <textarea
              id="contact-idea"
              rows={3}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:border-white/40 transition-colors rounded-none resize-none text-sm font-light placeholder:text-white/30"
              placeholder="Ex: Acabei de comprar um terreno em declive e preciso..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-5 font-semibold uppercase tracking-widest text-[11px] md:text-xs hover:bg-light-gray transition-colors mt-8 flex justify-center items-center cursor-pointer"
          >
            Enviar e conversar no WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
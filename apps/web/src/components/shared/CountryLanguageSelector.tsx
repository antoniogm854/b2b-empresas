"use client";

import React, { useState, useEffect } from "react";
import { Globe } from "lucide-react";

// Lista expandida para América (sin EEUU)
const COUNTRIES = [
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'DO', name: 'Rep. Dominicana', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' }
];

export default function CountryLanguageSelector() {
  const [selectedCountry, setSelectedCountry] = useState('PE');
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('b2b_lang');
    if (savedLang) setSelectedLanguage(savedLang);
    // Placeholder para detectar IP y setear pais (Ej: fetch 'https://ipapi.co/json/')
  }, []);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('b2b_lang', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`; // Sincronizar con middleware
    window.location.reload(); 
  };

  if (!mounted) return <div className="w-[120px] h-8 bg-[var(--muted)] rounded-full animate-pulse" />;

  const currentCountry = COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <div className="flex items-center gap-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-full px-4 py-2">
      <Globe size={14} className="text-[var(--muted-foreground)] hidden sm:block" />
      
      {/* Selector de País */}
      <div className="relative group/country">
        <button className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] hover:text-[#A2C367] transition-colors">
          <span className="text-lg">{currentCountry?.flag}</span>
          <span className="hidden lg:inline-block max-w-[80px] truncate" title={currentCountry?.name}>{currentCountry?.name}</span>
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[var(--card)] rounded-xl shadow-2xl w-56 max-h-80 overflow-y-auto hidden group-hover/country:block border border-[var(--border)] py-2 z-[100]">
          {COUNTRIES.map(c => (
            <button 
              key={c.code} 
              onClick={() => setSelectedCountry(c.code)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--muted)] flex items-center gap-3 font-medium text-[var(--foreground)] hover:text-[#A2C367] transition-colors"
            >
              <span className="text-xl">{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px h-4 bg-[var(--border)] mx-1"></div>

      {/* Selector de IDIOMA */}
      <div className="flex gap-1">
        <button 
          onClick={() => handleLanguageChange('es')}
          className={`text-xs font-black px-2 py-1 rounded transition-colors ${selectedLanguage === 'es' ? 'bg-[#4B6319] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
        >
          ES
        </button>
        <button 
          onClick={() => handleLanguageChange('pt')}
          className={`text-xs font-black px-2 py-1 rounded transition-colors ${selectedLanguage === 'pt' ? 'bg-[#4B6319] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
        >
          PT
        </button>
        <button 
          onClick={() => handleLanguageChange('en')}
          className={`text-xs font-black px-2 py-1 rounded transition-colors ${selectedLanguage === 'en' ? 'bg-[#4B6319] text-white' : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
        >
          EN
        </button>
      </div>
    </div>
  );
}

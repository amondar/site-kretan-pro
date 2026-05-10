import React, { useState } from 'react';
import { Menu, X, PenTool } from 'lucide-react';

// On reçoit les outils nécessaires depuis App.jsx (les "props")
const Navbar = ({ openModal, lang, setLang, t }) => {
  // Le menu mobile est géré uniquement par la Navbar maintenant !
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
             <img src="/assets/logo.png" alt="Logo KréTan Pro" className="h-20 w-auto object-contain" />
          </div>

          {/* Menu Ordinateur */}
          <nav className="hidden md:flex space-x-6 items-center">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-600 hover:text-orange-500 font-medium transition bg-transparent border-none cursor-pointer">
              {t.nav_home}
            </button>
            <a href="#services" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_services}</a>
            <a href="#team" className="text-gray-600 hover:text-orange-500 font-medium transition">L'Équipe</a>
            <a href="#projects" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_projects}</a>
            <a href="#contact" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_location}</a>
          </nav>

          {/* Boutons (Langue, Devis, Hamburger) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === 'fr' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>FR</button>
              <div className="w-[1px] h-3 bg-gray-300 mx-1"></div>
              <button onClick={() => alert("La version anglaise sera disponible très prochainement !")} className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600 cursor-not-allowed'}`} title="Bientôt disponible">EN</button>
            </div>
            
            <button onClick={() => openModal('Demander un devis')} className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-0.5 items-center gap-2">
              <PenTool size={18} /> <span>Devis</span>
            </button>
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700 p-2">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl z-50 left-0">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_home}</button>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_services}</a>
            <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">L'Équipe</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_projects}</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_location}</a>
            <button onClick={() => { openModal('Demander un devis'); setIsMobileMenuOpen(false); }} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold shadow-md flex justify-center items-center gap-2 transition">
              <PenTool size={18}/> {lang === 'fr' ? 'Demander un devis' : 'Request a Quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
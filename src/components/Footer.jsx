import React from 'react';
// On s'assure que TOUTES les icônes sont importées
import { MapPin, Mail, Facebook, Youtube, Linkedin, Instagram, Lock } from 'lucide-react';

// Ici, on réceptionne les props depuis App.jsx
const Footer = ({ socials, openModal, handleSecretClick, setShowAdmin }) => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Colonne 1 : Présentation */}
            <div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-500 mb-4">KréTan Pro+</h3>
              <p className="text-gray-400 mb-6">Votre partenaire de confiance.</p>
              <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm"><MapPin size={16} className="text-pink-500" /><span>Siège Social : N'douci / Tiassalé</span></div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm"><span>🛣️ Autoroute du Nord (45 min d'Abidjan)</span></div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm group">
                    <Mail size={16} className="text-orange-500 group-hover:scale-110 transition" />
                    <a href="mailto:contact@kretanpro.ci" className="hover:text-white transition decoration-orange-500 underline-offset-4 hover:underline">contact@kretanpro.ci</a>
                  </div>
              </div>
            </div>

            {/* Colonne 2 : Liens rapides */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#propos" className="hover:text-orange-500 transition">Qui sommes-nous ?</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition">Nos Services</a></li>
                {/* La fonction openModal fonctionne maintenant ! */}
                <li><button onClick={() => openModal("Demander un devis")} className="hover:text-orange-500 transition text-left">Demander un Devis</button></li>
              </ul>
            </div>

            {/* Colonne 3 : Réseaux Sociaux */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Suivez-nous</h3>
              <p className="text-gray-400 mb-4 text-sm">Découvrez nos chantiers en vidéo et nos conseils.</p>
              <div className="flex gap-4 items-center">
                {/* On utilise les variables socials reçues depuis Firebase */}
                {socials?.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-blue-600 transition duration-300"><Facebook size={20} /></a>}
                {socials?.youtube && <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-red-600 transition duration-300"><Youtube size={20} /></a>}
                {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-blue-700 transition duration-300"><Linkedin size={20} /></a>}
                {socials?.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-pink-600 transition duration-300"><Instagram size={20} /></a>}
              </div>
            </div>

          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center gap-8 text-gray-500 text-sm">
            {/* Le clic secret marche maintenant ! */}
            <p onClick={handleSecretClick} className="cursor-default select-none hover:text-gray-400 transition" title="Tous droits réservés">© 2026 KréTan Pro+. Tous droits réservés.</p>
            {/* Le bouton CMS marche maintenant ! */}
            <button onClick={() => setShowAdmin(true)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors cursor-pointer group" title="Accès réservé au personnel">
              <div className="p-1 border border-gray-600 rounded group-hover:border-orange-500 transition"><Lock size={14} /></div>
              <span className="text-xs font-bold uppercase tracking-wider">Accès Staff</span>
            </button>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
import React from 'react';
import { Briefcase } from 'lucide-react';

// On récupère partnersList depuis App.jsx grâce aux "props"
const Partners = ({ partnersList = [] }) => {

  // S'il n'y a pas de partenaire dans la liste, on affiche le message d'attente
  if (!partnersList || partnersList.length === 0) {
      return (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4">
                    Ils nous font confiance pour leurs projets
                </h3>
                <p className="text-gray-400 italic text-sm">Partenaires en cours de mise à jour...</p>
            </div>
        </section>
      );
  }

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase text-center mb-8">
            Ils nous font confiance pour leurs projets
        </h3>
        
        {/* Grille dynamique des partenaires */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
            {partnersList.map(partner => (
                <div key={partner.id} className="flex items-center gap-3 group grayscale hover:grayscale-0 transition-all duration-300">
                    {partner.logoUrl ? (
                        <img 
                            src={partner.logoUrl} 
                            alt={partner.name} 
                            className="h-10 md:h-12 object-contain"
                        />
                    ) : (
                        <Briefcase className="text-gray-500 group-hover:text-orange-500 transition-colors" size={24} />
                    )}
                    <span className="font-black text-gray-600 group-hover:text-gray-900 tracking-wider text-sm md:text-base transition-colors">
                        {partner.name.toUpperCase()}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
import React from 'react';
import { CheckCircle, HardHat, PenTool, Home, Truck } from 'lucide-react';

const Services = () => {
  // La liste des services est maintenant rangée bien au chaud ici !
  const serviceCategories = [
    { title: "Génie Civil & Construction", icon: <HardHat className="w-8 h-8 text-orange-500" />, items: ["Construction immobilière", "Construction de ponts", "Travaux de génie civil", "Construction métallique", "Réalisation de VRD"] },
    { title: "Technique & Second Œuvre", icon: <PenTool className="w-8 h-8 text-teal-600" />, items: ["Électricité et Plomberie", "Travaux de climatisation", "Architecture int. & ext.", "Élaboration de plans"] },
    { title: "Immobilier & Foncier", icon: <Home className="w-8 h-8 text-orange-500" />, items: ["Gestion immobilière", "Lotissement & Aménagement", "Achat/Vente de maisons", "Achat/Vente de terrains"] },
    { title: "Services & Logistique", icon: <Truck className="w-8 h-8 text-teal-600" />, items: ["Fourniture de matériaux", "Entretien et Nettoyage", "Décoration", "Conseils et Formation"] }
  ];

  return (
    <section id="services" className="bg-gray-50 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nos Pôles d'Expertise</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {serviceCategories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-600">
                      <CheckCircle className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
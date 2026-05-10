import React from 'react';
import { ArrowRight } from 'lucide-react';

const Contact = ({ openModal }) => {
  return (
    <section id="contact" className="bg-white py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Texte et Infos */}
          <div className="mb-10 lg:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-orange-100 bg-orange-50 text-orange-600 text-sm font-bold mb-4">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>Zone en plein essor
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              Un Siège Stratégique à <span className="text-teal-600">N'douci - Tiassalé</span>
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              Nous avons fait le choix audacieux de nous établir au carrefour économique de demain.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-bold text-xs mt-0.5">1</div>
                <p className="ml-4 text-gray-600"><strong>Accessibilité record :</strong> À seulement 45 minutes d'Abidjan.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-bold text-xs mt-0.5">2</div>
                <p className="ml-4 text-gray-600"><strong>Terre d'opportunités :</strong> Développement immobilier et lotissement.</p>
              </li>
            </ul>
            <div className="mt-8">
              <button 
                onClick={() => openModal("Rendez-vous au Siège (N'douci)")} 
                className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-2 transition"
              >
                Prendre rendez-vous sur place <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Carte Google Maps */}
          <div className="relative h-96 w-full rounded-2xl shadow-xl overflow-hidden border-4 border-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15873.34005164923!2d-4.832966!3d5.891461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNTMnMjkuMyJOIDTCsDQ5JzU4LjciVw!5e0!3m2!1sfr!2sci!4v1650000000000!5m2!1sfr!2sci" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              title="Carte Siège KréTan Pro"
            ></iframe>
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-gray-800">
              📍 Siège KréTan Pro+
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
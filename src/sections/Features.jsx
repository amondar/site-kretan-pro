import React from 'react';
import { Award, Clock, Shield, Users } from 'lucide-react';

const Features = () => {
  return (
    <section className="bg-teal-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Pourquoi KréTan Pro+ ?</h2>
          <p className="mt-4 text-lg text-teal-100">La différence se fait dans les détails et l'engagement.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award size={28} className="text-white"/>
            </div>
            <h3 className="font-bold text-xl mb-2">Qualité Certifiée</h3>
            <p className="text-sm text-teal-100">Matériaux de premier choix et respect strict des normes de construction.</p>
          </div>
          <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock size={28} className="text-white"/>
            </div>
            <h3 className="font-bold text-xl mb-2">Délais Respectés</h3>
            <p className="text-sm text-teal-100">Un planning détaillé vous est remis au départ. Zéro mauvaise surprise.</p>
          </div>
          <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield size={28} className="text-white"/>
            </div>
            <h3 className="font-bold text-xl mb-2">Garantie Totale</h3>
            <p className="text-sm text-teal-100">Service après-vente réactif et garantie décennale sur nos ouvrages.</p>
          </div>
          <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users size={28} className="text-white"/>
            </div>
            <h3 className="font-bold text-xl mb-2">Équipe Expert</h3>
            <p className="text-sm text-teal-100">Des ingénieurs et techniciens formés, encadrés par une direction expérimentée.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
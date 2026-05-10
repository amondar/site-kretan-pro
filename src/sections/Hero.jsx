import React from 'react';

const Hero = ({ openModal }) => {
  return (
    <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Colonne Texte */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2"></span>Partout en Côte d'Ivoire
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Bâtir, Aménager,</span>
              <span className="block text-orange-500">Servir l'Avenir.</span>
            </h1>
            
            <p className="mt-4 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              De la construction de ponts à la décoration intérieure. KréTan Pro+ est votre interlocuteur unique.
            </p>
            
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => openModal("Parler de mon projet")} 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Parler de mon projet
              </button>
            </div>
          </div>
          
          {/* Colonne Image */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border-[6px] border-white transform rotate-2 hover:rotate-0 transition-all duration-500 ease-in-out">
              <img className="w-full h-full object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop" alt="Chantier KréTan Pro+" />
              <div className="absolute bottom-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">Pro+</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
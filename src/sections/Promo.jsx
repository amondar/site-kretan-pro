import React from 'react';

const Promo = ({ livePromo, openModal, type }) => {
  if (!livePromo?.active) return null;

  // FORMAT 1 : Le petit bandeau discret tout en haut
  if (type === "topbar") {
    return livePromo.text ? (
      <div className="bg-gray-900 text-white text-center py-2 px-4 text-sm font-medium animate-pulse">
        {livePromo.text}
      </div>
    ) : null;
  }

  // FORMAT 2 : La grande bannière au milieu du site
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="bg-orange-600 text-white p-8 rounded-2xl text-center relative overflow-hidden group shadow-2xl">
          {livePromo.bgImage && (
              <img src={livePromo.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition duration-700" alt="Promo Background" />
          )}
          <div className="relative z-10">
              <span className="bg-white text-orange-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2 inline-block">
                  {livePromo.discount || "Offre Spéciale"}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  {livePromo.title || "Grande Promotion en cours !"}
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-6 opacity-90">
                  {livePromo.description}
              </p>
              <button onClick={() => openModal('Promo Web')} className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1">
                  J'en profite maintenant
              </button>
          </div>
      </div>
    </div>
  );
};

export default Promo;
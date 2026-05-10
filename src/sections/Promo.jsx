import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; 

// On ajoute un paramètre "type" (qui sera soit 'bar', soit 'banner')
const Promo = ({ type }) => {
  const [activePromo, setActivePromo] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "promos"), where("active", "==", true));
    const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
            setActivePromo({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
            setActivePromo(null);
        }
    });
    return () => unsub();
  }, []);

  if (!activePromo) return null;

  // 1. SI ON DEMANDE LE PETIT BANDEAU (La Bar)
  if (type === 'bar') {
      if (!activePromo.text) return null; // S'il n'y a pas de texte, on n'affiche rien
      return (
        <div className="bg-orange-600 text-white text-center py-2 px-4 text-sm font-bold tracking-wide shadow-md relative z-50">
            {activePromo.text}
        </div>
      );
  }

  // 2. SI ON DEMANDE LA GRANDE IMAGE (La Bannière)
  if (type === 'banner') {
      return (
        <section className="relative w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                    
                    {activePromo.bgImage && (
                        <img 
                            src={activePromo.bgImage} 
                            alt="Promotion Spéciale" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                    )}
                    
                    <div className="absolute inset-0 bg-gray-900/50"></div>

                    <div className="relative z-10 px-6 py-16 md:py-20 text-center flex flex-col items-center justify-center">
                        {activePromo.discount && (
                            <span className="bg-orange-500 text-white font-black px-5 py-1.5 rounded-full mb-6 text-xl shadow-lg transform -rotate-2">
                                {activePromo.discount}
                            </span>
                        )}
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                            {activePromo.title}
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto mb-10 drop-shadow-md font-medium">
                            {activePromo.description}
                        </p>
                        
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1">
                            J'en profite maintenant
                        </button>
                    </div>
                </div>
            </div>
        </section>
      );
  }

  return null;
};

export default Promo;
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Download, Images, MapPin, ZoomIn, ChevronUp } from 'lucide-react'; // <-- Ajout de ChevronUp

// --- MINI-COMPOSANT POUR GÉRER L'OUVERTURE DE CHAQUE CARTE ---
// --- MINI-COMPOSANT POUR GÉRER L'OUVERTURE DE CHAQUE CARTE ---
const OngoingCard = ({ proj, openModal, setSelectedImage }) => {
    const [showAll, setShowAll] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // <-- NOUVEAU : Gère le texte déroulant

    const gallery = proj.imageUrls || (proj.imageUrl ? [proj.imageUrl] : ['https://via.placeholder.com/600x400']);
    const visibleThumbnails = showAll ? gallery.slice(1) : gallery.slice(1, 4);
    const hiddenCount = gallery.length - 4;

    const openGallery = (index) => {
        setSelectedImage({ images: gallery, index: index });
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl group hover:shadow-2xl transition duration-300 flex flex-col h-full">
            <div className="p-2">
                <div className="grid grid-cols-4 gap-2">
                    {/* ... (GARDER LE MÊME CODE POUR LES IMAGES ICI) ... */}
                    <div className="col-span-4 h-56 relative overflow-hidden rounded-xl cursor-pointer group/img" onClick={() => openGallery(0)}>
                        <img src={gallery[0]} alt="Vue principale" className="w-full h-full object-cover group-hover/img:scale-105 transition duration-700" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <Images size={12} /> Galerie ({gallery.length})
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-md"><ZoomIn className="text-white" size={32} /></div>
                        </div>
                    </div>
                    
                    {visibleThumbnails.map((img, idx) => (
                        <div key={idx} className="col-span-1 h-16 overflow-hidden rounded-lg cursor-pointer relative group/thumb" onClick={() => openGallery(idx + 1)}>
                            <img src={img} alt={`Vue ${idx+2}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover/thumb:opacity-100" size={16} />
                            </div>
                        </div>
                    ))}

                    {!showAll && hiddenCount > 0 && (
                        <div onClick={() => setShowAll(true)} className="col-span-1 h-16 relative rounded-lg overflow-hidden bg-gray-900 cursor-pointer hover:opacity-90 transition">
                            <img src={gallery[4]} className="w-full h-full object-cover opacity-40" alt="Plus" />
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">+{hiddenCount}</div>
                        </div>
                    )}

                    {showAll && hiddenCount > 0 && (
                        <div onClick={() => setShowAll(false)} className="col-span-4 mt-1 flex items-center justify-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg cursor-pointer transition-colors shadow-inner">
                            <ChevronUp size={16} /> Réduire la galerie
                        </div>
                    )}
                </div>
            </div>

            {/* PARTIE TEXTE ET BOUTON */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{proj.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2"><MapPin size={16} className="text-orange-500"/> {proj.location}</p>
                
                {/* NOUVEAU : LA DESCRIPTION DÉROULANTE */}
                {proj.description && (
                    <div className="mb-6 flex-1">
                        <p className={`text-sm text-gray-600 whitespace-pre-line transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                            {proj.description}
                        </p>
                        {/* On affiche le bouton seulement si le texte est assez long (plus de 100 caractères) */}
                        {proj.description.length > 100 && (
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)} 
                                className="text-teal-600 hover:text-teal-800 text-xs font-bold mt-2 uppercase tracking-wide"
                            >
                                {isExpanded ? '- Réduire le texte' : '+ Lire la description'}
                            </button>
                        )}
                    </div>
                )}

                <button onClick={() => openModal(`Demande Dossier PDF : ${proj.title}`)} className="w-full bg-gray-900 hover:bg-teal-600 text-white font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 shadow-md mt-auto">
                    <Download size={18} /> Demander le dossier PDF complet
                </button>
            </div>
        </div>
    );
};

// --- LA SECTION PRINCIPALE ---
const OngoingProjects = ({ openModal, setSelectedImage }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "ongoing_projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => unsub();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200" id="plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                PROJETS <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-orange-500">EN COURS D'EXÉCUTION</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Découvrez un aperçu exclusif de nos chantiers et études architecturales actuels.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map(proj => (
            <OngoingCard key={proj.id} proj={proj} openModal={openModal} setSelectedImage={setSelectedImage} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OngoingProjects;
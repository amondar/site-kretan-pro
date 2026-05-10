import React from 'react';
import { MessageCircle, PenTool } from 'lucide-react';

const OpenLetter = ({ liveLetter }) => {
  return (
    <>
      {/* ========================================================= */}
      {/* 1. LETTRE PERMANENTE FIXE (Appel au Partenariat)          */}
      {/* ========================================================= */}
      <section className="py-20 bg-orange-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-5xl font-serif font-black text-gray-900 mb-4">Invitation à bâtir ensemble de nouvelles opportunités</h2>
                  <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-b-8 border-orange-500">
                  <div className="prose prose-lg text-gray-700 font-serif leading-relaxed text-justify whitespace-pre-line mx-auto">
                      <p>Chers partenaires, investisseurs et futurs collaborateurs,</p>
                      <br/>
                      <p>C’est avec enthousiasme que nous vous adressons ces quelques lignes. Dans un monde où les collaborations solides sont la clé du succès, nous croyons fermement que l’union de nos forces, de nos savoir-faire et de nos visions peut donner naissance à des projets ambitieux et durables.</p>
                      <br/>
                      <p>Notre ambition est simple : créer des synergies gagnant-gagnant, où chaque partie trouve une réelle valeur ajoutée. Nous privilégions la transparence, l’écoute et l’innovation, afin de bâtir des relations professionnelles fondées sur la confiance et le respect mutuel.</p>
                      <br/>
                      <p>Nous serions ravis d’échanger avec vous pour explorer ensemble les opportunités qui s’offrent à nous et poser les bases d’un partenariat fructueux.</p>
                      <br/>
                      <p>Dans l’attente de cette rencontre, recevez nos salutations les plus cordiales.</p>
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="text-center md:text-left">
                          <p className="font-black text-gray-900 text-2xl font-serif">La Direction Générale</p>
                          <p className="text-orange-600 font-bold uppercase tracking-widest text-sm mt-1">KréTan Pro+ SARL</p>
                      </div>
                      <a href="https://wa.me/2250708965424?text=Bonjour,%20je%20souhaite%20discuter%20d'un%20partenariat%20avec%20KréTan%20Pro+" target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-500 transition-colors duration-300 shadow-lg">
                          Devenir Partenaire
                      </a>
                  </div>
              </div>
          </div>
      </section>

      {/* ========================================================= */}
      {/* 2. LETTRE DYNAMIQUE DU CMS (Actualités / Édito ponctuel)  */}
      {/* ========================================================= */}
      {liveLetter && (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50 z-0"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl border-t-4 border-orange-500 relative flex flex-col lg:flex-row">
                    
                    {/* Colonne Image */}
                    {liveLetter.imageUrl && (
                        <div className="lg:w-2/5 relative h-80 lg:h-auto overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                          <img src={liveLetter.imageUrl} alt="Édito" className="absolute inset-0 w-full h-full object-cover object-[80%_top] lg:object-[80%_center]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden"></div>
                        </div>
                    )}

                    {/* Colonne Texte */}
                    <div className={`p-8 md:p-12 relative flex-1 ${!liveLetter.imageUrl ? 'max-w-4xl mx-auto w-full' : ''}`}>
                        <div className={`absolute -top-6 -left-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hidden md:block`}>
                            <MessageCircle size={32} fill="currentColor" />
                        </div>

                        <div className="text-left mb-8">
                            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">{liveLetter.date}</p>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{liveLetter.title}</h2>
                            <div className="w-16 h-1 bg-teal-500 mt-4"></div>
                        </div>

                        <div className="prose prose-lg text-gray-600 font-serif leading-relaxed text-justify whitespace-pre-line">
                            {liveLetter.content}
                        </div>

                        <div className="mt-10 flex justify-end items-center gap-4 border-t border-gray-100 pt-6">
                            <div className="text-right">
                                <p className="font-bold text-gray-700 text-sm uppercase tracking-wide">Directeur Général</p>
                                <p className="font-black text-gray-900 text-xl mb-1">{liveLetter.signature}</p>
                                <p className="text-orange-500 text-xs uppercase font-bold tracking-wider">KréTan Pro+</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shadow-inner">
                                 <PenTool size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}
    </>
  );
};

export default OpenLetter;
import React, { useState, useEffect } from 'react';
import { Shield, Cookie, X } from 'lucide-react';
import ReactGA from "react-ga4";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  // Vérifier au chargement si l'utilisateur a déjà choisi
  useEffect(() => {
    const consent = localStorage.getItem('kretan_cookie_consent');
    if (!consent) {
      // Si pas de choix, on affiche le bandeau après 2 secondes
      setTimeout(() => setIsVisible(true), 2000);
    } else if (consent === 'true') {
      // Si déjà accepté, on active Google Analytics
      activateAnalytics();
    }
  }, []);

  const activateAnalytics = () => {
    // Remplacez par votre vrai ID de mesure Google Analytics
    ReactGA.initialize("G-W3MYEHSMRZ"); 
  };

  const handleAccept = () => {
    localStorage.setItem('kretan_cookie_consent', 'true');
    setIsVisible(false);
    activateAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem('kretan_cookie_consent', 'false');
    setIsVisible(false);
  };

  // --- LE TEXTE DE LA POLITIQUE DE CONFIDENTIALITÉ ---
  const PrivacyPolicy = () => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative">
        <button onClick={() => setShowPolicy(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200">
          <X size={20}/>
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="text-teal-600"/> Politique de Confidentialité
          </h2>
          
          <div className="prose text-gray-600 space-y-4 text-sm">
            <h3 className="font-bold text-gray-800 text-lg">1. Collecte des données</h3>
            <p>Nous collectons les informations que vous nous fournissez via le formulaire de devis (Nom, Téléphone, Ville). Ces données sont stockées de manière sécurisée sur nos serveurs (Google Firebase) et servent uniquement à vous recontacter.</p>

            <h3 className="font-bold text-gray-800 text-lg">2. Cookies & Traceurs</h3>
            <p>Ce site utilise des cookies pour améliorer votre expérience :</p>
            <ul className="list-disc pl-5">
              <li><strong>Cookies essentiels :</strong> Nécessaires au bon fonctionnement du site.</li>
              <li><strong>Google Analytics :</strong> Nous aide à comprendre combien de personnes visitent notre site (anonyme).</li>
            </ul>

            <h3 className="font-bold text-gray-800 text-lg">3. Partage des données</h3>
            <p>Vos données ne sont <strong>jamais vendues</strong> à des tiers. Elles sont accessibles uniquement par la direction de KréTan Pro+ et l'équipe technique.</p>

            <h3 className="font-bold text-gray-800 text-lg">4. Vos droits</h3>
            <p>Conformément aux lois en vigueur, vous pouvez demander la suppression de vos données en nous écrivant à <em>contact@kretanpro.ci</em>.</p>
          </div>

          <button onClick={() => setShowPolicy(false)} className="mt-8 w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700">
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );

  // Si le bandeau n'est pas visible et la politique fermée, on ne rend rien
  if (!isVisible && !showPolicy) return null;

  return (
    <>
      {/* LA MODALE POLITIQUE (Si ouverte) */}
      {showPolicy && <PrivacyPolicy />}

      {/* LE BANDEAU COOKIES (Si visible) */}
      {isVisible && !showPolicy && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[90] p-4 md:p-6 animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full hidden md:block">
                <Cookie className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Nous respectons votre vie privée</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  KréTan Pro+ utilise des cookies pour analyser le trafic et améliorer votre expérience. 
                  Nous ne vendons pas vos données.
                  <button onClick={() => setShowPolicy(true)} className="text-teal-600 underline ml-2 hover:text-teal-800">
                    Lire la politique
                  </button>
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={handleDecline}
                className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
              >
                Refuser
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none px-6 py-2 bg-teal-700 text-white rounded-lg text-sm font-bold hover:bg-teal-800 shadow-md transition"
              >
                Accepter
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
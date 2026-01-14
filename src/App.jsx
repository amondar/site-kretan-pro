import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Menu, X, ArrowRight, CheckCircle, HardHat, Home, PenTool, Truck, Users } from 'lucide-react';
import ChatAssistant from './ChatAssistant';

const App = () => {
  // --- 1. DÉCLARATION DES ÉTATS (STATES) ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Pour stocker les erreurs
  const [networkError, setNetworkError] = useState(""); // Pour stocker le message d'erreur d'envoi
  
  const form = useRef();

  // --- 2. DONNÉES ET CONFIGURATION ---
  
  // Couleurs de la marque
  const colors = {
    primary: "bg-orange-500 hover:bg-orange-600",
    textPrimary: "text-orange-500",
    secondary: "text-teal-600",
    bgSecondary: "bg-teal-50",
  };

  // Liste des services complète
  const serviceCategories = [
    {
      title: "Génie Civil & Construction",
      icon: <HardHat className="w-8 h-8 text-orange-500" />,
      items: ["Construction immobilière", "Construction de ponts", "Travaux de génie civil", "Construction métallique", "Réalisation de VRD"]
    },
    {
      title: "Technique & Second Œuvre",
      icon: <PenTool className="w-8 h-8 text-teal-600" />,
      items: ["Électricité et Plomberie", "Travaux de climatisation", "Architecture int. & ext.", "Élaboration de plans"]
    },
    {
      title: "Immobilier & Foncier",
      icon: <Home className="w-8 h-8 text-orange-500" />,
      items: ["Gestion immobilière", "Lotissement & Aménagement", "Achat/Vente de maisons", "Achat/Vente de terrains"]
    },
    {
      title: "Services & Logistique",
      icon: <Truck className="w-8 h-8 text-teal-600" />,
      items: ["Fourniture de matériaux", "Entretien et Nettoyage", "Décoration", "Conseils et Formation"]
    }
  ];

  // --- 3. FONCTION DE VALIDATION DU FORMULAIRE ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    
    // Récupérer les données du formulaire actuel
    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const phone = formData.get('user_phone');
    const message = formData.get('message');

    // Règle 1 : Nom (au moins 2 lettres)
    if (!name || name.length < 2) {
      tempErrors.user_name = "Le nom est trop court.";
      isValid = false;
    }

    // Règle 2 : Téléphone (Au moins 10 chiffres/caractères)
    const phoneRegex = /^[\d\s\+]{10,}$/; 
    if (!phone || !phoneRegex.test(phone)) {
      tempErrors.user_phone = "Numéro invalide (10 chiffres minimum).";
      isValid = false;
    }

    // Règle 3 : Message (Au moins 10 caractères)
    if (!message || message.length < 10) {
      tempErrors.message = "Merci de détailler un peu plus votre besoin.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- 4. FONCTION D'ENVOI D'EMAIL (EMAILJS) ---
  const sendEmail = (e) => {
    e.preventDefault();

    // Étape A : On valide les données avant d'envoyer
    if (!validateForm()) {
      return; // Si erreurs, on arrête tout.
    }

    setIsLoading(true);

    // Étape B : Configuration EmailJS
    // ⚠️ REMPLACEZ CES 3 VALEURS PAR LES VÔTRES (Récupérées sur emailjs.com)
    const serviceID = 'service_kmqb7pe';
    const templateID = 'template_xj6th9r';
    const publicKey = 't2lZdCL1RcS4vwDqB';

    // Étape C : Envoi
    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log('Succès:', result.text);
          setFormSubmitted(true);
          setIsLoading(false);
          
          // Ferme le popup automatiquement après 3 secondes
          setTimeout(() => {
            setIsQuoteOpen(false);
            setFormSubmitted(false);
            setErrors({}); // On efface les erreurs pour la prochaine fois
          }, 3000);
            }, (error) => {
        console.error('Erreur:', error.text);
        // Au lieu de alert(), on remplit l'état :
        setNetworkError("Problème de connexion. Veuillez réessayer."); 
        setIsLoading(false);
      });
  };

  // --- 5. LE RENDU VISUEL (JSX) ---
  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Image */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
               {/* Assurez-vous d'avoir mis logo.jpeg dans public/assets/ */}
               <img src="/assets/logo.png" alt="Logo KréTan Pro+" className="h-20 w-auto" />
            </div>

            {/* Menu Ordinateur */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#propos" className="hover:text-orange-500 transition font-medium">Qui sommes-nous ?</a>
              <a href="#services" className="hover:text-orange-500 transition font-medium">Nos Services</a>
              <button 
                onClick={() => setIsQuoteOpen(true)}
                className={`${colors.primary} text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center gap-2`}
              >
                Demander un devis <ArrowRight size={18} />
              </button>
            </div>

            {/* Bouton Menu Mobile */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Déroulant */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
            <a href="#propos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Qui sommes-nous ?</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Nos Services</a>
            <button onClick={() => {setIsMenuOpen(false); setIsQuoteOpen(true)}} className="block text-lg font-medium text-orange-500">Demander un devis</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (Haut de page) --- */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Texte à gauche */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2"></span>
                Partout en Côte d'Ivoire
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Bâtir, Aménager,</span>
                <span className={`block text-orange-500`}>Servir l'Avenir.</span>
              </h1>
              <p className="mt-4 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                De la construction de ponts à la décoration intérieure. KréTan Pro+ est votre interlocuteur unique pour tous vos projets.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className={`${colors.primary} text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
                >
                  Parler de mon projet
                </button>
              </div>
            </div>

            {/* Image Chantier à droite */}
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border-[6px] border-white transform rotate-2 hover:rotate-0 transition-all duration-500 ease-in-out">
                <img
                  className="w-full h-full object-cover aspect-[4/3]"
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"
                  alt="Équipe KréTan Pro+ sur chantier"
                />
                <div className="absolute bottom-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  Pro+
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUI SOMMES NOUS --- */}
      <section id="propos" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Notre Philosophie</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              L'excellence technique centralisée
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Née de la volonté d'offrir une expertise transversale en Côte d'Ivoire, notre structure brise les barrières entre les métiers.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                    <HardHat size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Infrastructures & BTP</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Projets d'envergure : construction de ponts, génie civil et VRD.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                    <Home size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Habitat & Design</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Architecture, construction de maison, décoration et vente de terrains.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                    <Users size={24} />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Services & Gestion</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Gestion immobilière, nettoyage professionnel et maintenance.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* --- NOS SERVICES (Liste complète) --- */}
      <section id="services" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Nos Pôles d'Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {serviceCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-gray-600">
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

      {/* --- FOOTER --- */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Un projet en Côte d'Ivoire ?</h2>
          <button 
            onClick={() => setIsQuoteOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition"
          >
            Contactez-nous maintenant
          </button>
          <p className="mt-8 text-sm text-gray-500">© 2024 KréTan Pro+. Tous droits réservés.</p>
        </div>
      </section>

      {/* --- MODALE DE FORMULAIRE (POPUP) --- */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Fond sombre */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsQuoteOpen(false)}></div>
            
            {/* Centrage */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Fenêtre */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              
              {/* En-tête du formulaire */}
              <div className="bg-orange-500 px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-bold text-white">Parlez-nous de votre projet</h3>
                <button onClick={() => setIsQuoteOpen(false)} className="text-orange-100 hover:text-white transition"><X size={24} /></button>
              </div>

              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {!formSubmitted ? (
                  /* --- Le Formulaire --- */
                  <form ref={form} onSubmit={sendEmail} className="space-y-4">
                    
                    {/* Choix Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type de service</label>
                      <select name="service_type" className="mt-1 block w-full py-2 border-gray-300 rounded-md border bg-white p-2">
                        <option value="Construction & Gros Œuvre">Construction & Gros Œuvre</option>
                        <option value="Rénovation & Architecture">Rénovation & Architecture</option>
                        <option value="Électricité / Plomberie">Électricité / Plomberie</option>
                        <option value="Immobilier & Terrain">Immobilier & Terrain</option>
                        <option value="Autre">Autre demande</option>
                      </select>
                    </div>

                    {/* Nom & Tel */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Votre Nom</label>
                        <input name="user_name" type="text" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nom" />
                        {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input name="user_phone" type="tel" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+225..." />
                        {errors.user_phone && <p className="text-red-500 text-xs mt-1">{errors.user_phone}</p>}
                      </div>
                    </div>

                    {/* Ville */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ville / Commune</label>
                      <input name="user_city" type="text" className="mt-1 block w-full border-gray-300 rounded-md border p-2" placeholder="Ex: Cocody" />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Détails</label>
                      <textarea name="message" rows={3} className={`mt-1 block w-full border rounded-md p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre besoin..."></textarea>
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>


                    {/* Message d'erreur réseau */}
                    {networkError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
                        {networkError}
                      </div>
                    )}

                    {/* Bouton envoi */}
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white sm:text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
                      >
                        {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande gratuitement'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* --- Message de Succès --- */
                  <div className="text-center py-10">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Demande envoyée !</h3>
                    <p className="mt-2 text-sm text-gray-500">Un expert vous recontactera sous 24h.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* --- AJOUTER L'AGENT ICI --- */}
      <ChatAssistant />

    </div>
  );
};

export default App;
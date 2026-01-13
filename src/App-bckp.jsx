import React, { useState, useRef } from 'react'; // Ajoutez useRef ici
import emailjs from '@emailjs/browser'; // Importez emailjs
import { Menu, X, ArrowRight, CheckCircle, HardHat, Home, PenTool, Truck, Users } from 'lucide-react';
/*import logo from '../src/assets/logo.jpeg'; // Assurez-vous d'avoir un logo dans ce chemin*/

const App = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
  
const form = useRef(); // Référence vers le formulaire
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Pour montrer que ça charge

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // REMPLACEZ LES VALEURS CI-DESSOUS PAR LES VÔTRES !
    const serviceID = 'service_kmqb7pe';
    const templateID = 'template_xj6th9r';
    const publicKey = 't2lZdCL1RcS4vwDqB';

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log(result.text);
          setFormSubmitted(true);
          setIsLoading(false);
          // Ferme le popup après 3 secondes
          setTimeout(() => {
            setIsQuoteOpen(false);
            setFormSubmitted(false);
          }, 3000);
      }, (error) => {
          console.log(error.text);
          alert("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
          setIsLoading(false);
      });
  };


  // Couleurs de la marque
  const colors = {
    primary: "bg-orange-500 hover:bg-orange-600",
    textPrimary: "text-orange-500",
    secondary: "text-teal-600",
    bgSecondary: "bg-teal-50",
  };

  // Liste des services regroupés par pôle d'expertise
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

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      
      {/* --- HEADER / NAVBAR --- */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
               {/* Logo KréTan Pro+ (Image) */}
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                  <img
                    src="/assets/logo.jpeg" // Assurez-vous que le chemin est correct
                    alt="Logo KréTan Pro+"
                    className="h-20 w-auto" // Ajustez la hauteur (h-12, h-16, etc.) selon vos préférences
                  />
                </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#propos" className="hover:text-orange-500 transition font-medium">Qui sommes-nous ?</a>
              <a href="#services" className="hover:text-orange-500 transition font-medium">Nos Services</a>
              <button onClick={() => setIsQuoteOpen(true)} className={`${colors.primary} text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center gap-2`}>
                Demander un devis <ArrowRight size={18} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
            <a href="#propos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Qui sommes-nous ?</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Nos Services</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-orange-500">Demander un devis</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* Texte Gauche */}
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
                De la construction de ponts à la décoration intérieure. KréTan Pro+ est votre interlocuteur unique pour tous vos projets immobiliers et techniques.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setIsQuoteOpen(true)} className={`${colors.primary} text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}>
                  Parler de mon projet
                </button>
              </div>
            </div>

          {/* Image Droite (RÉELLE) */}
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            {/* Cadre blanc et ombre */}
            <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border-[6px] border-white transform rotate-2 hover:rotate-0 transition-all duration-500 ease-in-out">
              {/* L'image elle-même */}
              <img
                className="w-full h-full object-cover aspect-[4/3]"
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop"
                alt="Équipe KréTan Pro+ sur un chantier de construction en Côte d'Ivoire"
              />
              {/* Petit badge "Pro+" sur l'image pour le style */}
              <div className="absolute bottom-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                Pro+
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* --- SECTION "QUI SOMMES-NOUS ?" --- */}
      <section id="propos" className="py-16 bg-white">
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
                  Nous avons les capacités techniques pour les projets d'envergure : construction de ponts, génie civil et VRD. La rigueur est notre maître-mot.
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
                  De la vente du terrain à la remise des clés, en passant par l'architecture, la construction de maison et la décoration.
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
                  Parce qu'un bâtiment vit, nous assurons sa pérennité via la gestion immobilière, le nettoyage professionnel et la maintenance.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* --- SECTION SERVICES COMPLÈTE --- */}
      <section id="services" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Nos Pôles d'Expertise
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Une offre globale pour répondre à tous vos besoins.
            </p>
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

      {/* --- FOOTER / CTA FINAL --- */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Un projet en Côte d'Ivoire ?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Ne multipliez plus les intermédiaires. Faites confiance à KréTan Pro+ pour une gestion de A à Z.
          </p>
          <button onClick={() => setIsQuoteOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition">
            Contactez-nous maintenant
          </button>
          <p className="mt-8 text-sm text-gray-500">© 2024 KréTan Pro+. Tous droits réservés.</p>
        </div>
      </section>

      {/* --- FORMULAIRE DE DEVIS MODAL --- */}
          
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Fond sombre (Overlay) */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsQuoteOpen(false)}
            ></div>

            {/* Centrage vertical astuce */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* La fenêtre du formulaire */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              
              {/* En-tête du formulaire */}
              <div className="bg-orange-500 px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
                  Parlez-nous de votre projet
                </h3>
                <button onClick={() => setIsQuoteOpen(false)} className="text-orange-100 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              {/* Corps du formulaire */}
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {!formSubmitted ? (
                  <form ref={form} onSubmit={sendEmail} className="space-y-4">
                    {/* Choix du Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type de service souhaité</label>
                      <select name="service_type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border bg-white">
                        <option value="Construction & Gros Œuvre">Construction & Gros Œuvre</option>
                        <option value="Rénovation & Architecture">Rénovation & Architecture</option>
                        <option value="Électricité / Plomberie / Clim">Électricité / Plomberie / Clim</option>
                        <option value="Achat / Gestion Immobilière">Achat / Gestion Immobilière</option>
                        <option value="Fourniture de matériaux">Fourniture de matériaux</option>
                        <option value="Autre demande">Autre demande</option>
                      </select>
                    </div>

                    {/* Infos Client */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Votre Nom</label>
                        <input name="user_name" required type="text" className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2" placeholder="Nom complet" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input name="user_phone" required type="tel" className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2" placeholder="+225 ..." />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ville / Commune</label>
                      <input name="user_city" type="text" className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2" placeholder="Ex: Cocody, Yopougon..." />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Détails du projet</label>
                      <textarea name="message" rows={3} className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2" placeholder="Décrivez brièvement votre besoin..."></textarea>
                    </div>

                    {/* Bouton d'action */}
                    <div className="mt-5 sm:mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white sm:text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
                      >
                        {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande gratuitement'}
                      </button>
                      <p className="mt-2 text-xs text-center text-gray-400">Réponse sous 24h ouvrées.</p>
                    </div>
                  </form>
                ) : (
                  // Message de succès après envoi
                  <div className="text-center py-10">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Demande envoyée !</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Merci de votre confiance. Un expert KréTan Pro+ va vous recontacter très rapidement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
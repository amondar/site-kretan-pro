import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Menu, X, ArrowRight, CheckCircle, HardHat, Home, PenTool, Truck, Users, MessageCircle, Send } from 'lucide-react';

// --- COMPOSANT ASSISTANT CHAT (Intégré dans le même fichier pour simplifier) ---
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Bonjour ! Je suis l'assistant KréTan Pro+. Comment puis-je vous aider ?", isBot: true }]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null); 

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("mission") || lowerText.includes("qui")) return "Notre mission : centraliser l'expertise technique en Côte d'Ivoire. Un seul interlocuteur pour tout gérer de A à Z.";
    if (lowerText.includes("pont") || lowerText.includes("btp")) return "C'est notre cœur de métier : Génie civil, construction de ponts et gros œuvre.";
    if (lowerText.includes("devis") || lowerText.includes("prix")) return "Cliquez sur le bouton orange 'Demander un devis' pour une estimation gratuite.";
    if (lowerText.includes("contact") || lowerText.includes("tel")) return "Nous intervenons partout en Côte d'Ivoire. Écrivez-nous via le formulaire.";
    return "Je vous invite à cliquer sur 'Demander un devis' pour une réponse personnalisée.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userText = inputValue.trim();
    const lowerText = userText.toLowerCase();

    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setInputValue("");

    if (lowerText.includes("au revoir") || lowerText.includes("bye") || lowerText.includes("merci")) {
      setTimeout(() => setMessages((prev) => [...prev, { text: "Au plaisir ! À bientôt sur KréTan Pro+. 👋", isBot: true }]), 600);
      setTimeout(() => setIsOpen(false), 2500);
      return;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: getBotResponse(userText), isBot: true }]);
    }, 1000);
  };

  return (
    <div ref={chatRef} className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2">
          <MessageCircle size={28} />
          <span className="font-bold hidden md:inline">Besoin d'aide ?</span>
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          <div className="bg-teal-700 p-4 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2"><MessageCircle size={20} /><h3 className="font-bold text-sm">Assistant KréTan</h3></div>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-teal-600 p-1 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.isBot ? "bg-white text-gray-700 rounded-tl-none border" : "bg-orange-500 text-white rounded-tr-none"}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Votre question..." className="flex-1 text-sm border rounded-full px-4 py-2 outline-none focus:border-orange-500" />
            <button type="submit" className="bg-teal-600 text-white p-2 rounded-full"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL APP ---
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // --- CONFIGURATION DES PROMOS ---
  // Mettez 'true' pour afficher, 'false' pour cacher
  const showFlashBar = true; 
  const showPromoSection = true;
  
  // --- NOUVEAU : État pour le titre dynamique du formulaire ---
  const [modalTitle, setModalTitle] = useState("Parlez-nous de votre projet");
  
  const form = useRef();

  // Fonction utilitaire pour ouvrir le modal avec le bon titre
  const openModal = (title) => {
    setModalTitle(title);
    setIsQuoteOpen(true);
  };

  const colors = {
    primary: "bg-orange-500 hover:bg-orange-600",
    textPrimary: "text-orange-500",
    secondary: "text-teal-600",
    bgSecondary: "bg-teal-50",
  };

  const serviceCategories = [
    { title: "Génie Civil & Construction", icon: <HardHat className="w-8 h-8 text-orange-500" />, items: ["Construction immobilière", "Construction de ponts", "Travaux de génie civil", "Construction métallique", "Réalisation de VRD"] },
    { title: "Technique & Second Œuvre", icon: <PenTool className="w-8 h-8 text-teal-600" />, items: ["Électricité et Plomberie", "Travaux de climatisation", "Architecture int. & ext.", "Élaboration de plans"] },
    { title: "Immobilier & Foncier", icon: <Home className="w-8 h-8 text-orange-500" />, items: ["Gestion immobilière", "Lotissement & Aménagement", "Achat/Vente de maisons", "Achat/Vente de terrains"] },
    { title: "Services & Logistique", icon: <Truck className="w-8 h-8 text-teal-600" />, items: ["Fourniture de matériaux", "Entretien et Nettoyage", "Décoration", "Conseils et Formation"] }
  ];

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const phone = formData.get('user_phone');
    const message = formData.get('message');

    if (!name || name.length < 2) { tempErrors.user_name = "Le nom est trop court."; isValid = false; }
    const phoneRegex = /^[\d\s\+]{10,}$/; 
    if (!phone || !phoneRegex.test(phone)) { tempErrors.user_phone = "Numéro invalide (10 chiffres min)."; isValid = false; }
    if (!message || message.length < 10) { tempErrors.message = "Merci de détailler un peu plus."; isValid = false; }

    setErrors(tempErrors);
    return isValid;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const serviceID = 'service_kmqb7pe'; // À REMPLACER
    const templateID = 'template_xj6th9r' // À REMPLACER
    const publicKey = 't2lZdCL1RcS4vwDqB'; // À REMPLACER

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          setFormSubmitted(true);
          setIsLoading(false);
          setTimeout(() => { setIsQuoteOpen(false); setFormSubmitted(false); setErrors({}); }, 3000);
      }, (error) => {
          alert("Erreur technique. Vérifiez votre connexion.");
          setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">

      {/* --- BARRE FLASH (TOP BAR) --- */}
      {showFlashBar && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold z-[60] relative animate-pulse">
          🔥 PROMO DU MOIS : -15% sur tous les travaux de peinture jusqu'au 30 Juin ! 
          <span className="underline cursor-pointer ml-2" onClick={() => openModal("Promo Peinture -15%")}>
            En profiter
          </span>
        </div>
      )}
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
               <img src="/assets/logo.png" alt="Logo KréTan Pro+" className="h-20 w-auto" />
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#propos" className="hover:text-orange-500 transition font-medium">Qui sommes-nous ?</a>
              <a href="#services" className="hover:text-orange-500 transition font-medium">Nos Services</a>
              {/* BOUTON 1 : Navbar */}
              <button 
                onClick={() => openModal("Demander un devis")}
                className={`${colors.primary} text-white px-6 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center gap-2`}
              >
                Demander un devis <ArrowRight size={18} />
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl">
            <a href="#propos" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Qui sommes-nous ?</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Nos Services</a>
            {/* BOUTON 2 : Mobile */}
            <button onClick={() => {setIsMenuOpen(false); openModal("Demander un devis");}} className="block text-lg font-medium text-orange-500">Demander un devis</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-teal-100 bg-teal-50 text-teal-700 text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2"></span>Partout en Côte d'Ivoire
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Bâtir, Aménager,</span><span className={`block text-orange-500`}>Servir l'Avenir.</span>
              </h1>
              <p className="mt-4 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                De la construction de ponts à la décoration intérieure. KréTan Pro+ est votre interlocuteur unique.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                {/* BOUTON 3 : Hero Section */}
                <button 
                  onClick={() => openModal("Parler de mon projet")}
                  className={`${colors.primary} text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}
                >
                  Parler de mon projet
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border-[6px] border-white transform rotate-2 hover:rotate-0 transition-all duration-500 ease-in-out">
                <img className="w-full h-full object-cover aspect-[4/3]" src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&fit=crop" alt="Chantier" />
                <div className="absolute bottom-4 right-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">Pro+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION PROMO / FLYER --- */}
      {showPromoSection && (
        <section className="py-12 bg-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
              
              {/* Côté Gauche : LE FLYER (Image) */}
              <div className="relative h-64 lg:h-full bg-gray-200">
                {/* Remplacez src par l'image de votre flyer promo */}
                <img 
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1581578731117-104f2a863a17?q=80&w=1000&auto=format&fit=crop" 
                  alt="Flyer Promo KréTan"
                />
                {/* Badge de réduction */}
                <div className="absolute top-0 left-0 bg-yellow-400 text-red-700 text-xl font-black px-4 py-2 rounded-br-xl shadow-lg transform rotate-[-2deg]">
                  -20%
                </div>
              </div>

              {/* Côté Droit : Le Texte Vendeur */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="uppercase tracking-wide text-sm text-orange-600 font-bold">Offre Limitée</div>
                <h2 className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
                  Pack Rénovation "Spécial Rentrée"
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Ne laissez pas votre maison se dégrader. Pour tout devis signé avant la fin du mois, nous offrons le nettoyage complet de fin de chantier !
                </p>
                
                <div className="mt-8 flex items-center gap-4">
                  <button 
                    onClick={() => openModal("Je veux l'offre Spéciale Rentrée")}
                    className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3 rounded-lg font-bold transition shadow-lg transform hover:scale-105"
                  >
                    J'en profite maintenant
                  </button>
                  <div className="text-sm text-gray-400 italic">
                    *Conditions applicables
                  </div>
                </div>

                {/* Compte à rebours visuel (Fake) */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                  Il ne reste que 3 places disponibles !
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* --- QUI SOMMES NOUS --- */}
      <section id="propos" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Notre Philosophie</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">L'excellence technique centralisée</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Née de la volonté d'offrir une expertise transversale en Côte d'Ivoire.</p>
          </div>
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt><div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white"><HardHat size={24} /></div><p className="ml-16 text-lg leading-6 font-medium text-gray-900">Infrastructures & BTP</p></dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">Projets d'envergure : construction de ponts, génie civil et VRD.</dd>
              </div>
              <div className="relative">
                <dt><div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white"><Home size={24} /></div><p className="ml-16 text-lg leading-6 font-medium text-gray-900">Habitat & Design</p></dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">Architecture, construction de maison, décoration et vente de terrains.</dd>
              </div>
              <div className="relative">
                <dt><div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white"><Users size={24} /></div><p className="ml-16 text-lg leading-6 font-medium text-gray-900">Services & Gestion</p></dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">Gestion immobilière, nettoyage professionnel et maintenance.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nos Pôles d'Expertise</h2></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {serviceCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4"><div className="p-3 bg-gray-50 rounded-lg">{category.icon}</div><h3 className="text-xl font-bold text-gray-900">{category.title}</h3></div>
                  <ul className="space-y-3">{category.items.map((item, i) => (<li key={i} className="flex items-start text-gray-600"><CheckCircle className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" /><span>{item}</span></li>))}</ul>
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
          {/* BOUTON 4 : Footer */}
          <button 
            onClick={() => openModal("Contactez-nous maintenant")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition"
          >
            Contactez-nous maintenant
          </button>
          <p className="mt-8 text-sm text-gray-500">© 2024 KréTan Pro+. Tous droits réservés.</p>
        </div>
      </section>

      {/* --- MODALE DE FORMULAIRE --- */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsQuoteOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              
              {/* EN-TÊTE DYNAMIQUE ICI */}
              <div className="bg-orange-500 px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-bold text-white">{modalTitle}</h3>
                <button onClick={() => setIsQuoteOpen(false)} className="text-orange-100 hover:text-white transition"><X size={24} /></button>
              </div>

              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {!formSubmitted ? (
                  <form ref={form} onSubmit={sendEmail} className="space-y-4">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700">Votre Nom</label><input name="user_name" type="text" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nom" />{errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name}</p>}</div>
                      <div><label className="block text-sm font-medium text-gray-700">Téléphone</label><input name="user_phone" type="tel" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+225..." />{errors.user_phone && <p className="text-red-500 text-xs mt-1">{errors.user_phone}</p>}</div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Ville / Commune</label><input name="user_city" type="text" className="mt-1 block w-full border-gray-300 rounded-md border p-2" placeholder="Ex: Cocody" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Détails</label><textarea name="message" rows={3} className={`mt-1 block w-full border rounded-md p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre besoin..."></textarea>{errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}</div>
                    <div className="mt-5 sm:mt-6"><button type="submit" disabled={isLoading} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white sm:text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>{isLoading ? 'Envoi en cours...' : 'Envoyer ma demande gratuitement'}</button></div>
                  </form>
                ) : (
                  <div className="text-center py-10"><div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"><CheckCircle className="h-10 w-10 text-green-600" /></div><h3 className="text-lg leading-6 font-medium text-gray-900">Demande envoyée !</h3><p className="mt-2 text-sm text-gray-500">Un expert vous recontactera sous 24h.</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatAssistant />
    </div>
  );
};

export default App;
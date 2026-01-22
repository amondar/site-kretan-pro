import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Menu, X, ArrowRight, CheckCircle, HardHat, Home, PenTool, Truck, Users, 
  MessageCircle, Send, Facebook, Youtube, Linkedin, Instagram, Lock, 
  MapPin, Phone, Mail, Star, Award, Clock, Shield, Briefcase, User 
} from 'lucide-react';
import AccessControl from './AccessControl';
import ReactGA from "react-ga4";

// --- IMPORT OBLIGATOIRE POUR QUE L'IA FONCTIONNE ---
import { db } from './firebase'; 
import { collection, addDoc, getDocs, getDoc, doc, onSnapshot } from "firebase/firestore";

// ----------------------------------------------------
import { translations } from './translations';
import CookieConsent from './CookieConsent';

// --- COMPOSANT ASSISTANT CHAT INTELLIGENT ---
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Bonjour ! Je suis l'IA de KréTan Pro+. Posez-moi une question sur nos services.", isBot: true }]);
  const [inputValue, setInputValue] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState([]); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchBrain = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "chatbot_knowledge"));
        const rules = querySnapshot.docs.map(doc => doc.data());
        console.log("Cerveau IA chargé :", rules.length, "règles."); 
        setKnowledgeBase(rules);
      } catch (error) {
        console.error("Erreur chargement IA :", error);
      }
    };
    fetchBrain();
  }, []);

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    const foundRule = knowledgeBase.find(rule => {
      if (!rule.keywords) return false;
      const keywordsList = rule.keywords.split(',').map(k => k.trim());
      return keywordsList.some(k => lowerText.includes(k));
    });

    if (foundRule) return foundRule.response;

    if (lowerText.includes("bonjour") || lowerText.includes("salut")) return "Bonjour ! Comment puis-je vous aider dans votre projet de construction ?";
    if (lowerText.includes("merci")) return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.";
    if (lowerText.includes("contact") || lowerText.includes("téléphone")) return "Vous pouvez nous appeler au 07 08 50 51 09 ou cliquer sur le bouton WhatsApp.";
    if (lowerText.includes("bye") || lowerText.includes("revoir")) return "Au revoir ! Merci de votre visite sur KréTan Pro+. 👋";
    
    return "Je n'ai pas l'information exacte. Souhaitez-vous demander un devis gratuit à nos experts ?";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userText = inputValue.trim();
    const lowerText = userText.toLowerCase();

    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setInputValue("");

    setTimeout(() => {
      const botReply = getBotResponse(userText);
      setMessages((prev) => [...prev, { text: botReply, isBot: true }]);

      if (lowerText.includes("bye") || lowerText.includes("revoir")) {
        setTimeout(() => setIsOpen(false), 2500);
      }
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2 animate-bounce-slow">
          <MessageCircle size={28} />
          <span className="font-bold hidden md:inline">Besoin d'aide ?</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up h-[450px]">
          <div className="bg-teal-700 p-4 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2">
              <div className="bg-white text-teal-700 p-1 rounded-full"><MessageCircle size={16} /></div>
              <h3 className="font-bold text-sm">Assistant KréTan</h3>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-teal-600 p-1 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${msg.isBot ? "bg-white text-gray-700 rounded-tl-none border border-gray-200" : "bg-orange-500 text-white rounded-tr-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Votre question..." className="flex-1 text-sm border rounded-full px-4 py-2 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition" />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL APP ---
const App = () => {
  // --- ÉTATS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [teamList, setTeamList] = useState([]);
  
  // États dynamiques
  const [projectsList, setProjectsList] = useState([]);
  const [socials, setSocials] = useState({});

  // État Admin caché
  const [showAdmin, setShowAdmin] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const [livePromo, setLivePromo] = useState(null);
  const [liveLetter, setLiveLetter] = useState(null);

  // Langue
  const [lang, setLang] = useState('fr'); 
  const t = translations[lang] || translations['fr'];

  // Fonction code secret (3 clics) - Optionnelle car on a mis le cadenas
  const handleSecretClick = () => {
    setSecretClicks(prev => prev + 1);
    if (secretClicks + 1 === 3) {
      setShowAdmin(true);
      setSecretClicks(0);
    }
    setTimeout(() => setSecretClicks(0), 2000);
  };

  // Chargement Firebase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const projSnap = await getDocs(collection(db, "projects"));
        setProjectsList(projSnap.docs.map(d => d.data()));

        const socialSnap = await getDoc(doc(db, "content", "social_links"));
        if (socialSnap.exists()) setSocials(socialSnap.data());

        // 4. Charger l'Équipe Publique
        const teamSnap = await getDocs(collection(db, "public_team"));
        // Astuce : On trie pour afficher (optionnel, sinon l'ordre d'ajout)
        setTeamList(teamSnap.docs.map(d => d.data()));

        // 5. Charger la Promo en direct (Live)
       // On écoute le document "content/promo"
        const unsubscribe = onSnapshot(doc(db, "content", "promo"), (docSnap) => {
          if (docSnap.exists()) {
            setLivePromo(docSnap.data()); // On met à jour la variable
          }
        });
      

        // 6. Charger la Lettre Ouverte en direct (Live)
        const unsubLetter = onSnapshot(doc(db, "content", "open_letter"), (docSnap) => {
          if (docSnap.exists()) setLiveLetter(docSnap.data());
        });
        
        // 👇 LA CORRECTION EST ICI : ON NETTOIE LES DEUX EN MÊME TEMPS
    return () => {
        unsubscribe();   // On arrête d'écouter la promo
        unsubLetter();  // On arrête d'écouter la lettre
    };

      } catch (err) { console.error("Erreur chargement contenu", err); }
    };
    fetchContent();
  }, []);

  const [modalTitle, setModalTitle] = useState("Parlez-nous de votre projet");
  const form = useRef();

  const openModal = (title) => {
    setModalTitle(title);
    setIsQuoteOpen(true);

    // VÉRIFICATION DU CONSENTEMENT AVANT D'ENVOYER À GOOGLE
    const consent = localStorage.getItem('kretan_cookie_consent');
    if (consent === 'true') {
        try {
            ReactGA.event({
                category: "Business",
                action: "Clic Bouton Devis",
                label: title 
            });
        } catch (e) {
            // On ignore silencieusement si GA n'est pas initialisé
        }
    }
  };

  const colors = { primary: "bg-orange-500 hover:bg-orange-600", textPrimary: "text-orange-500", secondary: "text-teal-600", bgSecondary: "bg-teal-50" };

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
    // Remplacer par vos IDs EmailJS
    const serviceID = 'service_kmqb7pe'; 
    const templateID = 'template_xj6th9r';
    const publicKey = 't2lZdCL1RcS4vwDqB'; 

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then(() => {
          setFormSubmitted(true);
          setIsLoading(false);
          setTimeout(() => { setIsQuoteOpen(false); setFormSubmitted(false); setErrors({}); }, 3000);
      }, () => {
          alert("Erreur technique. Vérifiez votre connexion.");
          setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">

      {/* On affiche le bandeau seulement si la promo est active ET qu'il y a du texte */}
      {livePromo?.active && livePromo?.text && (
          <div className="bg-gray-900 text-white text-center py-2 px-4 text-sm font-medium animate-pulse">
              {livePromo.text}
          </div>
      )}

      {/* --- HEADER --- */}
      <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LOGO */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
               <img src="/assets/logo.png" alt="Logo KréTan Pro" className="h-20 w-auto object-contain" />
            </div>

            {/* NAV ORDI */}
            <nav className="hidden md:flex space-x-6 items-center">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-600 hover:text-orange-500 font-medium transition bg-transparent border-none cursor-pointer">
                {t.nav_home}
              </button>
              <a href="#services" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_services}</a>
              <a href="#team" className="text-gray-600 hover:text-orange-500 font-medium transition">L'Équipe</a>
              <a href="#projects" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_projects}</a>
              <a href="#contact" className="text-gray-600 hover:text-orange-500 font-medium transition">{t.nav_location}</a>
            </nav>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === 'fr' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>FR</button>
                <div className="w-[1px] h-3 bg-gray-300 mx-1"></div>
                <button onClick={() => alert("La version anglaise sera disponible très prochainement !")} className={`px-2 py-1 rounded text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-400 hover:text-gray-600 cursor-not-allowed'}`} title="Bientôt disponible">EN</button>
              </div>
              <button onClick={() => openModal('Demander un devis')} className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-0.5 items-center gap-2">
                <PenTool size={18} /> <span>Devis</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700 p-2">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl z-50 left-0">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_home}</button>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_services}</a>
              <a href="#team" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">
                L'Équipe
              </a>
              <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_projects}</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition">{t.nav_location}</a>
              <button onClick={() => { openModal('Demander un devis'); setIsMobileMenuOpen(false); }} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold shadow-md flex justify-center items-center gap-2 transition">
                <PenTool size={18}/> {lang === 'fr' ? 'Demander un devis' : 'Request a Quote'}
              </button>
            </div>
          </div>
        )}
      </header>

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
                <button onClick={() => openModal("Parler de mon projet")} className={`${colors.primary} text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl transition transform hover:-translate-y-1`}>
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

      {/* --- SECTION LETTRE OUVERTE / ÉDITO --- */}
      {liveLetter?.active && (
        <section className="py-16 bg-white relative">
            {/* Petit fond décoratif */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-50 z-0"></div>
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="bg-white p-8 md:p-12 rounded-none shadow-2xl border-t-4 border-orange-500 relative">
                    {/* Icône guillemet décorative */}
                    <div className="absolute -top-6 -left-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                        <MessageCircle size={32} fill="currentColor" />
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">{liveLetter.date}</p>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">{liveLetter.title}</h2>
                        <div className="w-16 h-1 bg-teal-500 mx-auto mt-4"></div>
                    </div>

                    <div className="prose prose-lg mx-auto text-gray-600 font-serif leading-relaxed text-justify whitespace-pre-line">
                        {liveLetter.content}
                    </div>

                    <div className="mt-10 flex justify-end items-center gap-4">
                        <div className="text-right">
                            <p className="font-bold text-gray-900 text-lg">{liveLetter.signature}</p>
                            <p className="text-orange-500 text-xs uppercase font-bold tracking-wider">KréTan Pro+</p>
                        </div>
                        {/* Emplacement pour une signature image si besoin plus tard */}
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                             <PenTool size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* --- SECTION A: PARTENAIRES (Confiance) --- */}
      <section className="bg-gray-100 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Ils nous font confiance pour leurs projets
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Remplacer par des images <img src="..." /> plus tard */}
            <span className="text-xl font-black text-gray-800 flex items-center gap-2"><Briefcase size={24}/> IMMO-IVOIRE</span>
            <span className="text-xl font-black text-gray-800 flex items-center gap-2"><Home size={24}/> BATIR-PLUS</span>
            <span className="text-xl font-black text-gray-800 flex items-center gap-2"><Truck size={24}/> TRANS-LOGISTIQUE</span>
            <span className="text-xl font-black text-gray-800 flex items-center gap-2"><HardHat size={24}/> GROUPE BTP</span>
          </div>
        </div>
      </section>

      {/* --- SECTION PROMO DYNAMIQUE --- */}
      {livePromo?.active && (
        <div className="bg-orange-600 text-white p-8 rounded-xl my-8 text-center relative overflow-hidden group">
            {/* Image de fond (Si elle existe) */}
            {livePromo.bgImage && (
                <img src={livePromo.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition duration-700" alt="Promo" />
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
{/* --- SECTION B: POURQUOI NOUS CHOISIR --- */}
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
              <p className="text-sm text-teal-100">Matériaux de premier choix et respect strict des normes de construction ivoiriennes.</p>
            </div>

            <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock size={28} className="text-white"/>
              </div>
              <h3 className="font-bold text-xl mb-2">Délais Respectés</h3>
              <p className="text-sm text-teal-100">Un planning détaillé vous est remis au départ. Zéro mauvaise surprise sur la livraison.</p>
            </div>

            <div className="p-6 bg-teal-800 rounded-xl hover:bg-teal-700 transition duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield size={28} className="text-white"/>
              </div>
              <h3 className="font-bold text-xl mb-2">Garantie Totale</h3>
              <p className="text-sm text-teal-100">Service après-vente réactif et garantie décennale sur nos ouvrages majeurs.</p>
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

      {/* --- RÉALISATIONS DYNAMIQUE --- */}
      <section id="projects" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.nav_projects}</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsList.length === 0 && <div className="col-span-3 text-center text-gray-500 italic">Aucune réalisation affichée pour le moment.</div>}
            {projectsList.map((proj, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer bg-white h-72">
                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div>
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{proj.type}</span>
                      <h3 className="text-white font-bold text-xl">{proj.title}</h3>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SIÈGE SOCIAL & MAP --- */}
      <section id="contact" className="bg-white py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-orange-100 bg-orange-50 text-orange-600 text-sm font-bold mb-4">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>Zone en plein essor
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">Un Siège Stratégique à <span className="text-teal-600">N'douci - Tiassalé</span></h2>
              <p className="text-lg text-gray-500 mb-6">Nous avons fait le choix audacieux de nous établir au carrefour économique de demain.</p>
              <ul className="space-y-4">
                <li className="flex items-start"><div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-bold text-xs mt-0.5">1</div><p className="ml-4 text-gray-600"><strong>Accessibilité record :</strong> À seulement 45 minutes d'Abidjan.</p></li>
                <li className="flex items-start"><div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 font-bold text-xs mt-0.5">2</div><p className="ml-4 text-gray-600"><strong>Terre d'opportunités :</strong> Développement immobilier et lotissement.</p></li>
              </ul>
              <div className="mt-8">
                <button onClick={() => openModal("Rendez-vous au Siège (N'douci)")} className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-2 transition">Prendre rendez-vous sur place <ArrowRight size={20} /></button>
              </div>
            </div>
            <div className="relative h-96 w-full rounded-2xl shadow-xl overflow-hidden border-4 border-gray-100">
              <iframe src="https://maps.google.com/maps?q=N'douci,%20Cote%20d'ivoire&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" title="Carte Siège KréTan Pro"></iframe>
              {/* Remplacez http par https */}
              <iframe src="https://maps.google.com/maps?q=N'douci&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" title="Carte Siège KréTan Pro"></iframe>
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-gray-800">📍 Siège KréTan Pro+</div>
            </div>
          </div>
        </div>
      </section>
{/* --- SECTION C: L'ÉQUIPE DIRIGEANTE --- */}
      <section id="team" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Une Direction Engagée</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Si la liste est vide, on affiche un message ou les exemples par défaut */}
            {teamList.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 italic py-10">
                    Chargement de l'équipe ou liste vide...
                    <br/><span className="text-xs">Ajoutez des membres via l'Espace Pro.</span>
                </div>
            )}

            {/* BOUCLE SUR L'ÉQUIPE DYNAMIQUE */}
            {teamList.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group-hover:border-orange-500 transition duration-300">
                    <img 
                        src={member.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-orange-600 font-medium text-sm uppercase tracking-wide mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm px-4 italic">"{member.quote}"</p>
                </div>
            ))}

          </div>
        </div>
      </section>

      {/* --- FOOTER & CONTACT --- */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            
            {/* Colonne 1 : La Marque */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-teal-400">KréTan</span>
                <span className="text-2xl font-bold text-orange-500">Pro+</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">Votre partenaire de confiance.</p>
              <div className="text-gray-400 text-sm space-y-1">
                <p>📍 Siège Social : N'douci / Tiassalé</p>
                <p>🛣️ Autoroute du Nord (45 min d'Abidjan)</p>
              </div>
            </div>

            {/* Colonne 2 : Liens Rapides */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#propos" className="hover:text-orange-500 transition">Qui sommes-nous ?</a></li>
                <li><a href="#services" className="hover:text-orange-500 transition">Nos Services</a></li>
                <li><button onClick={() => openModal("Demander un devis")} className="hover:text-orange-500 transition text-left">Demander un Devis</button></li>
              </ul>
            </div>

            {/* COLONNE 3 : RÉSEAUX SOCIAUX */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Suivez-nous</h3>
              <p className="text-gray-400 mb-4 text-sm">Découvrez nos chantiers en vidéo et nos conseils.</p>
              <div className="flex gap-4 items-center">
                {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-blue-600 transition duration-300"><Facebook size={20} /></a>}
                {socials.youtube && <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-red-600 transition duration-300"><Youtube size={20} /></a>}
                {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-blue-700 transition duration-300"><Linkedin size={20} /></a>}
                {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-pink-600 transition duration-300"><Instagram size={20} /></a>}
              </div>
            </div>
          </div>

          {/* --- BAS DU FOOTER (CORRIGÉ : CENTRÉ POUR ÉVITER LE CHATBOT) --- */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center gap-8 text-gray-500 text-sm">
            
            {/* Copyright */}
            <p onClick={handleSecretClick} className="cursor-default select-none hover:text-gray-400 transition" title="Tous droits réservés">
              &copy; 2026 KréTan Pro+. Tous droits réservés.
            </p>
            
            {/* LE BOUTON STAFF (Maintenant au centre, loin du coin droit) */}
            <button 
              onClick={() => setShowAdmin(true)} 
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors cursor-pointer group"
              title="Accès réservé au personnel"
            >
              <div className="p-1 border border-gray-600 rounded group-hover:border-orange-500 transition">
                 <Lock size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Accès Staff</span>
            </button>

          </div>
          
        </div>
      </footer>

     {/* --- MODALE ADMIN (Vérifiez que ce code est bien présent après le Footer) --- */}
      {showAdmin && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-1">
            
            {/* Bouton pour fermer */}
            <button 
              onClick={() => setShowAdmin(false)} 
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 z-50"
            >
              Fermer
            </button>
            
            {/* LE CMS */}
            <AccessControl />
            
          </div>
        </div>
      )}

      {/* --- MODALE FORMULAIRE --- */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={() => setIsQuoteOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-orange-500 px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-bold text-white">{modalTitle}</h3>
                <button onClick={() => setIsQuoteOpen(false)} className="text-orange-100 hover:text-white transition"><X size={24} /></button>
              </div>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {!formSubmitted ? (
                  <form ref={form} onSubmit={sendEmail} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Type de service</label>
                      <select name="service_type" className="mt-1 block w-full py-2 border-gray-300 rounded-md border bg-white p-2">
                        <option value="Construction & Gros Œuvre">Construction & Gros Œuvre</option>
                        <option value="Rénovation & Architecture">Rénovation & Architecture</option>
                        <option value="Électricité / Plomberie">Électricité / Plomberie</option>
                        <option value="Immobilier & Terrain">Immobilier & Terrain</option>
                        <option value="Autre">Autre demande</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700">Votre Nom</label><input name="user_name" type="text" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nom" /></div>
                      <div><label className="block text-sm font-medium text-gray-700">Téléphone</label><input name="user_phone" type="tel" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+225..." /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Détails</label><textarea name="message" rows={3} className={`mt-1 block w-full border rounded-md p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre besoin..."></textarea></div>
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

      {/* --- WHATSAPP --- */}
      <a href="https://wa.me/2250700000000?text=Bonjour%20KréTan%20Pro%2B" target="_blank" rel="noopener noreferrer" className="animate-whatsapp fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors hover:bg-green-600" title="Discuter sur WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">1</span></span>
      </a>
{/* --- GESTION COOKIES & GDPR --- */}
      <CookieConsent />
    </div>
  );
};

export default App;
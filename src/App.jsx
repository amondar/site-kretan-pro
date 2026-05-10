import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, ArrowRight, CheckCircle, HardHat, Home, PenTool, Truck, Users, 
  MessageCircle, Send, Facebook, Youtube, Linkedin, Instagram, Lock, 
  MapPin, Phone, Mail, Star, Award, Clock, Shield, Briefcase, User , Download
} from 'lucide-react';
import AccessControl from './AccessControl';
import ReactGA from "react-ga4";
import { db } from './firebase'; 
import { collection, addDoc, getDocs, getDoc, doc, onSnapshot,query, where} from "firebase/firestore";
import { translations } from './translations';
import CookieConsent from './CookieConsent';
import Hero from './sections/Hero';
import Navbar from './components/Navbar';
import OpenLetter from './sections/OpenLetter';
import Team from './sections/Team';
import ChatAssistant from './components/ChatAssistant';
import Footer from './components/Footer';
import Services from './sections/Services';
import Projects from './sections/Projects';
import About from './sections/About';
import Partners from './sections/Partners';
import Features from './sections/Features';
import Contact from './sections/Contact';
import QuoteModal from './components/QuoteModal';
import Promo from './sections/Promo';
import OngoingProjects from './sections/OngoingProjects';
const App = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [socials, setSocials] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [livePromo, setLivePromo] = useState(null);
  const [liveLetter, setLiveLetter] = useState(null);
  const [lang, setLang] = useState('fr'); 
  const t = translations[lang] || translations['fr'];
 const [selectedImage, setSelectedImage] = useState(null);
 const [partnersList, setPartnersList] = useState([]);
 
  const handleSecretClick = () => {
    setSecretClicks(prev => prev + 1);
    if (secretClicks + 1 === 3) {
      setShowAdmin(true);
      setSecretClicks(0);
    }
    setTimeout(() => setSecretClicks(0), 2000);
  };

  // ✅ CORRECTION DU CHARGEMENT ET DU NETTOYAGE FIREBASE
  useEffect(() => {
    let unsubPromo;
    let unsubLetter;

    const fetchContent = async () => {
      try {
        const projSnap = await getDocs(collection(db, "projects"));
        setProjectsList(projSnap.docs.map(d => d.data()));

        const socialSnap = await getDoc(doc(db, "content", "social_links"));
        if (socialSnap.exists()) setSocials(socialSnap.data());

        const teamSnap = await getDocs(collection(db, "public_team"));
        setTeamList(teamSnap.docs.map(d => d.data()));

        const partnersSnap = await getDocs(collection(db, "partners"));
        setPartnersList(partnersSnap.docs.map(d => d.data()));

        unsubPromo = onSnapshot(doc(db, "content", "promo"), (docSnap) => {
          if (docSnap.exists()) setLivePromo(docSnap.data());
        });

        // On écoute UNIQUEMENT la lettre qui est cochée "active" dans l'historique
        const qLetter = query(collection(db, "open_letters"), where("active", "==", true));
        unsubLetter = onSnapshot(qLetter, (snap) => {
            if (!snap.empty) {
                setLiveLetter(snap.docs[0].data()); // Prend la première lettre active trouvée
            } else {
                setLiveLetter(null); // S'il n'y en a aucune, on cache la section
            }
        });

      } catch (err) { 
          console.error("Erreur chargement contenu", err); 
      }
    };

    fetchContent();
    // Nettoyage correct (retourné par le useEffect lui-même)
    return () => {
        if (unsubPromo) unsubPromo();
        if (unsubLetter) unsubLetter();
    };
  }, []);

  const [modalTitle, setModalTitle] = useState("Parlez-nous de votre projet");
  const openModal = (title) => {
    setModalTitle(title);
    setIsQuoteOpen(true);

    const consent = localStorage.getItem('kretan_cookie_consent');
    if (consent === 'true') {
        try {
            ReactGA.event({ category: "Business", action: "Clic Bouton Devis", label: title });
        } catch (e) { }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-600">
      {/* 1. LE PETIT BANDEAU TOUT EN HAUT */}
      <Promo type="bar" />
      <Navbar openModal={openModal} lang={lang} setLang={setLang} t={t} />
      {/* --- SECTION HERO (Accueil) --- */}
      <Hero openModal={openModal} />
      {/* --- SECTION LETTRES OUVERTES --- */}
      <OpenLetter liveLetter={liveLetter} />
      {/* --- SECTION PARTENAIRES --- */}
      <Partners partnersList={partnersList} />
      {/* --- SECTION PROMO DYNAMIQUE --- */}
      {/* 3. LA GRANDE BANNIÈRE IMAGE (Sous le menu) */}
      <Promo type="banner" />
      {/* --- SECTION QUI SOMMES NOUS --- */}
      <About />
      {/* --- SECTION SERVICES --- */}
      <Services />
      {/* --- SECTION POURQUOI NOUS CHOISIR --- */}
      <Features />
      {/* --- SECTION RÉALISATIONS --- */}
      <Projects 
        projectsList={projectsList} 
        t={t} 
        setSelectedImage={setSelectedImage} 
      />
{/* --- SECTION TEASING CONFIDENTIEL (PROJETS EN COURS) --- */}
      <OngoingProjects 
      openModal={openModal} 
      setSelectedImage={setSelectedImage}
      />

      {/* --- SECTION CONTACT (Siège Social) --- */}
      <Contact openModal={openModal} />
      {/* --- SECTION ÉQUIPE --- */}
      <Team teamList={teamList} />
      <Footer 
        socials={socials} 
        openModal={openModal} 
        handleSecretClick={handleSecretClick} 
        setShowAdmin={setShowAdmin} 
      />
      {showAdmin && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-1">
            <button onClick={() => setShowAdmin(false)} className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 z-50">Fermer</button>
            <AccessControl />
          </div>
        </div>
      )}
      <QuoteModal 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
        title={modalTitle} 
        lang={lang}
      />
      <ChatAssistant />      
      <a href="https://wa.me/2250708965424?text=Bonjour%20KréTan%20Pro%2B" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="animate-whatsapp fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 bg-green-500 text-white p-3 md:p-4 rounded-full shadow-lg flex items-center justify-center transition-colors hover:bg-green-600" title="Discuter sur WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">1</span>
          </span>
      </a>
      <CookieConsent />
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedImage(null)}
        >
            <button className="absolute top-6 right-6 text-white hover:text-orange-500 transition"><X size={40} /></button>
            <img 
                src={selectedImage} 
                alt="Zoom Projet" 
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}

    </div>
  );

};

export default App;
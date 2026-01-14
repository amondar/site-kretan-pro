import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Je suis l'assistant virtuel de KréTan Pro+. Je peux vous orienter sur nos services ou notre mission. Comment puis-je vous aider ?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null); 

  // Scroll automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // --- LOGIQUE IA (Cerveau Standard) ---
  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("mission") || lowerText.includes("qui") || lowerText.includes("objectif")) {
      return "Notre mission : centraliser l'expertise technique en Côte d'Ivoire. BTP, Immobilier, Déco... un seul interlocuteur pour tout gérer de A à Z.";
    }
    if (lowerText.includes("pont") || lowerText.includes("btp") || lowerText.includes("technique")) {
      return "C'est notre cœur de métier : Génie civil, construction de ponts et gros œuvre. Une expertise technique certifiée.";
    }
    if (lowerText.includes("devis") || lowerText.includes("prix") || lowerText.includes("tarif")) {
      return "Chaque projet est unique. Cliquez sur le bouton orange 'Demander un devis' en haut pour une estimation gratuite sous 24h.";
    }
    if (lowerText.includes("contact") || lowerText.includes("tel") || lowerText.includes("où")) {
      return "Nous intervenons partout en Côte d'Ivoire. Écrivez-nous à contact@kretanpro.ci ou utilisez le formulaire de devis.";
    }
    return "KréTan Pro+ simplifie vos projets. Pour une réponse précise, je vous invite à cliquer sur 'Demander un devis'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const lowerText = userText.toLowerCase();

    // 1. On affiche le message de l'utilisateur tout de suite
    const userMessage = { text: userText, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // --- 2. DÉTECTION DE FIN DE CONVERSATION (Nouveau !) ---
    // Si l'utilisateur dit au revoir, on gère la fermeture
    if (lowerText.includes("au revoir") || lowerText.includes("aurevoir") || lowerText.includes("bye") || lowerText.includes("merci")) {
      
      // A. L'assistant répond poliment
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "C'était un plaisir ! À très bientôt sur KréTan Pro+. 👋", isBot: true }]);
      }, 600);

      // B. La fenêtre se ferme automatiquement après 2.5 secondes
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);

      return; // On arrête là, pas besoin d'appeler l'autre intelligence
    }

    // --- 3. RÉPONSE STANDARD (Si ce n'est pas un au revoir) ---
    setTimeout(() => {
      const botResponseText = getBotResponse(userText);
      setMessages((prev) => [...prev, { text: botResponseText, isBot: true }]);
    }, 1000);
  };

  return (
    <div ref={chatRef} className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* BOUTON D'OUVERTURE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2"
        >
          <MessageCircle size={28} />
          <span className="font-bold hidden md:inline">Besoin d'aide ?</span>
        </button>
      )}

      {/* FENÊTRE DE CHAT */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          
          {/* EN-TÊTE */}
          <div className="bg-teal-700 p-4 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant KréTan</h3>
                <p className="text-xs text-teal-100">En ligne</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
              className="text-white/80 hover:text-white hover:bg-teal-600 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                    msg.isBot
                      ? "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      : "bg-orange-500 text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* SAISIE */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question..."
              className="flex-1 text-sm border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-500 border"
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
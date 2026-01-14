import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Robot } from 'lucide-react'; // Assurez-vous d'avoir installé lucide-react

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Je suis l'assistant virtuel de KréTan Pro+. Je peux vous orienter sur nos services ou notre mission. Comment puis-je vous aider ?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas à chaque message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // --- LE CERVEAU DE L'AGENT (Logique des réponses) ---
  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();

    // 1. Orientation Mission / Objectifs
    if (lowerText.includes("mission") || lowerText.includes("qui êtes vous") || lowerText.includes("objectif") || lowerText.includes("entreprise")) {
      return "Notre mission est de centraliser l'expertise technique en Côte d'Ivoire. Nous brisons les barrières entre les métiers (BTP, Immobilier, Déco) pour vous offrir un interlocuteur unique et une gestion de A à Z.";
    }

    // 2. Services BTP / Ponts
    if (lowerText.includes("pont") || lowerText.includes("route") || lowerText.includes("génie") || lowerText.includes("btp") || lowerText.includes("construction")) {
      return "C'est le cœur de notre expertise. Nous réalisons des travaux de génie civil, construction de ponts et gros œuvre avec une rigueur technique absolue.";
    }

    // 3. Demande de Devis / Prix
    if (lowerText.includes("devis") || lowerText.includes("prix") || lowerText.includes("coût") || lowerText.includes("tarif")) {
      return "Chaque projet est unique. Le mieux est de cliquer sur le bouton 'Demander un devis' en haut à droite pour recevoir une estimation gratuite sous 24h.";
    }

    // 4. Contact / Localisation
    if (lowerText.includes("contact") || lowerText.includes("téléphone") || lowerText.includes("où") || lowerText.includes("adresse")) {
      return "Nous intervenons partout en Côte d'Ivoire. Vous pouvez nous laisser vos coordonnées via le formulaire de devis ou nous écrire à contact@kretanpro.ci.";
    }

    // 5. Réponse par défaut
    return "Je comprends. KréTan Pro+ est là pour simplifier vos projets complexes. Pour une réponse précise, je vous invite à utiliser le bouton 'Demander un devis'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = { text: inputValue, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simuler un délai de réflexion de l'IA
    setTimeout(() => {
      const botResponseText = getBotResponse(userMessage.text);
      setMessages((prev) => [...prev, { text: botResponseText, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Bouton pour ouvrir le chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2"
        >
          <MessageCircle size={28} />
          <span className="font-bold hidden md:inline">Besoin d'aide ?</span>
        </button>
      )}

      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          
          {/* En-tête */}
          <div className="bg-teal-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                {/* Icône Robot simplifiée si vous n'avez pas Robot dans lucide, sinon importez Robot */}
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant KréTan</h3>
                <p className="text-xs text-teal-100">En ligne</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Zone de messages */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
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

          {/* Zone de saisie */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez une question..."
              className="flex-1 text-sm border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-500 border"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
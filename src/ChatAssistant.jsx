import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// --- COMPOSANT ASSISTANT CHAT INTELLIGENT ---
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Bonjour ! Je suis l'IA de KréTan Pro+. Posez-moi une question.", isBot: true }]);
  const [inputValue, setInputValue] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState([]); // Le cerveau local
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // 1. CHARGER LE CERVEAU AU DÉMARRAGE
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "chatbot_knowledge"));
        const data = querySnapshot.docs.map(doc => doc.data());
        setKnowledgeBase(data);
      } catch (error) {
        console.error("Erreur chargement IA", error);
      }
    };
    fetchKnowledge();
  }, []);

  // 2. LA LOGIQUE DE RÉPONSE
  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    // A. Recherche dans le cerveau dynamique (Base de données)
    // On cherche si un mot-clé de la base est présent dans la phrase du client
    const foundRule = knowledgeBase.find(rule => {
      // Les mots clés sont stockés comme "prix, tarif, cout"
      const keywords = rule.keywords.split(',').map(k => k.trim()); 
      // Si l'un des mots clés est dans le texte
      return keywords.some(k => lowerText.includes(k));
    });

    if (foundRule) return foundRule.response;

    // B. Réponses par défaut (Si rien trouvé dans la base)
    if (lowerText.includes("bonjour") || lowerText.includes("salut")) return "Bonjour ! Comment puis-je vous aider dans votre projet ?";
    if (lowerText.includes("merci")) return "Avec plaisir ! N'hésitez pas si vous avez d'autres questions.";
    
    return "Je n'ai pas la réponse exacte. Cliquez sur 'Demander un devis' pour parler à un expert humain.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userText = inputValue.trim();

    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setInputValue("");

    // Simulation délai de réflexion
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: getBotResponse(userText), isBot: true }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2">
          <MessageCircle size={28} />
          <span className="font-bold hidden md:inline">Besoin d'aide ?</span>
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up h-[450px]">
          <div className="bg-teal-700 p-4 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="flex items-center gap-2"><MessageCircle size={20} /><h3 className="font-bold text-sm">Assistant KréTan</h3></div>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-teal-600 p-1 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
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

export default ChatAssistant;
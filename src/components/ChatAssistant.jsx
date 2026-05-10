import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { db } from '../firebase'; // Attention au chemin vers firebase.js (on remonte d'un dossier avec ../)
import { collection, getDocs } from 'firebase/firestore';

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
        <button 
            onClick={() => setIsOpen(true)} 
            className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-3 md:p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center gap-2 animate-bounce-slow"
        >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
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

export default ChatAssistant;
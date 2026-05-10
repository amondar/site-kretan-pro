import React, { useState, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const QuoteModal = ({ isOpen, onClose, title, lang }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef();

  if (!isOpen) return null;

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    const formData = new FormData(formRef.current);
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
    const serviceID = 'service_kmqb7pe'; 
    const templateID = 'template_xj6th9r';
    const publicKey = '-VLSqltlrglaRlI4F';

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then(() => {
          setFormSubmitted(true);
          setIsLoading(false);
          setTimeout(() => { 
            onClose(); 
            setFormSubmitted(false); 
            setErrors({}); 
          }, 3000);
      }, () => {
          alert("Erreur technique. Vérifiez votre connexion.");
          setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
        
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-orange-500 px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-orange-100 hover:text-white transition"><X size={24} /></button>
          </div>
          
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {!formSubmitted ? (
              <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Votre Nom</label>
                    <input name="user_name" type="text" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input name="user_phone" type="tel" className={`mt-1 block w-full border rounded-md p-2 ${errors.user_phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="+225..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Détails</label>
                  <textarea name="message" rows={3} className={`mt-1 block w-full border rounded-md p-2 ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder="Votre besoin..."></textarea>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button type="submit" disabled={isLoading} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white sm:text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande gratuitement'}
                  </button>
                </div>
              </form>
            ) : (
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
  );
};

export default QuoteModal;
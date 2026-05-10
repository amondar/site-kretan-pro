import React from 'react';
import { Upload } from 'lucide-react';

const AdminPromo = ({
    promo,
    setPromo,
    handleUpdatePromo,
    setPromoImageFile,
    isUploading
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500 lg:col-span-2">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2 text-orange-800">
                📢 Gestion de la Promotion
            </h3>
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border">
                <span className="text-sm font-bold text-gray-700">Activer la Promo :</span>
                <button 
                    type="button" 
                    onClick={() => setPromo({...promo, active: !promo.active})} 
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${promo?.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${promo?.active ? 'translate-x-6' : ''}`} />
                </button>
            </div>
        </div>
        
        <form onSubmit={handleUpdatePromo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 bg-green-50 p-3 rounded border border-green-200">
                <label className="block text-xs font-bold text-green-800 mb-1">🟢 Texte du Bandeau (Tout en haut du site) :</label>
                <input 
                    className="border p-2 rounded w-full text-sm" 
                    placeholder="Ex: Livraison gratuite jusqu'à ce soir..." 
                    value={promo?.text || ''} 
                    onChange={e => setPromo({...promo, text: e.target.value})} 
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Titre Principal :</label>
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="Ex: Grande Promo Tabaski" 
                    value={promo?.title || ''} 
                    onChange={e => setPromo({...promo, title: e.target.value})} 
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Réduction (-XX%) :</label>
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="-20%" 
                    value={promo?.discount || ''} 
                    onChange={e => setPromo({...promo, discount: e.target.value})} 
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Description détaillée :</label>
                <textarea 
                    className="border p-2 rounded w-full h-20" 
                    placeholder="Ex: Valable sur tous les travaux..." 
                    value={promo?.description || ''} 
                    onChange={e => setPromo({...promo, description: e.target.value})} 
                />
            </div>
            
            <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center mt-2 pt-4 border-t border-dashed border-gray-300">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-orange-600 mb-1">📸 Photo depuis l'ordi :</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setPromoImageFile(e.target.files[0])} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer" 
                    />
                </div>
                <span className="text-gray-400 font-bold">OU</span>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-600 mb-1">🌐 Lien URL (Internet) :</label>
                    <input 
                        className="border p-2 rounded w-full text-sm bg-gray-50" 
                        placeholder="https://..." 
                        value={promo?.bgImage || ''} 
                        onChange={e => setPromo({...promo, bgImage: e.target.value})} 
                    />
                </div>
            </div>
            
            <button 
                disabled={isUploading} 
                className="md:col-span-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 flex justify-center items-center gap-2 mt-4 shadow-md"
            >
                {isUploading ? "Envoi en cours..." : "Sauvegarder la Promotion"}
                {!isUploading && <Upload size={18}/>}
            </button>
        </form>
    </div>
  );
};

export default AdminPromo;
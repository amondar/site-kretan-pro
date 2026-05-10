import React from 'react';
import { Upload, Megaphone, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminPromo = ({
    newPromo,
    setNewPromo,
    handleSavePromo,
    setPromoImageFile,
    isUploading,
    promosList,
    handleEditPromo,
    handleActivatePromo,
    handleDelete,
    editingPromoId,
    setEditingPromoId
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500 lg:col-span-2">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2 text-orange-800">
                <Megaphone className="text-orange-600" /> Historique des Promotions
            </h3>
        </div>
        
        {/* FORMULAIRE DE CRÉATION / MODIFICATION */}
        <form onSubmit={handleSavePromo} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 bg-orange-50/50 p-6 rounded-xl border border-orange-100">
            <div className="md:col-span-2 bg-green-50 p-3 rounded border border-green-200 shadow-sm">
                <label className="block text-xs font-bold text-green-800 mb-1">🟢 Texte du Bandeau (Tout en haut du site) :</label>
                <input required className="border p-2 rounded w-full text-sm bg-white" placeholder="Ex: Livraison gratuite jusqu'à ce soir..." value={newPromo?.text || ''} onChange={e => setNewPromo({...newPromo, text: e.target.value})} />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Titre Principal :</label>
                <input required className="border p-2 rounded w-full bg-white" placeholder="Ex: Grande Promo Tabaski" value={newPromo?.title || ''} onChange={e => setNewPromo({...newPromo, title: e.target.value})} />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Réduction (-XX%) :</label>
                <input className="border p-2 rounded w-full bg-white" placeholder="-20%" value={newPromo?.discount || ''} onChange={e => setNewPromo({...newPromo, discount: e.target.value})} />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Description détaillée :</label>
                <textarea className="border p-2 rounded w-full h-20 bg-white" placeholder="Ex: Valable sur tous les travaux..." value={newPromo?.description || ''} onChange={e => setNewPromo({...newPromo, description: e.target.value})} />
            </div>
            
            {/* ZONE IMAGE (FICHIER OU URL) */}
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
                
                <span className="text-gray-400 font-bold text-xs uppercase">OU</span>
                
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-600 mb-1">🌐 Lien URL (Internet) :</label>
                    <input 
                        className="border p-2 rounded w-full text-sm bg-white" 
                        placeholder="https://..." 
                        value={newPromo?.bgImage || ''} 
                        onChange={e => setNewPromo({...newPromo, bgImage: e.target.value})} 
                    />
                </div>
            </div>
            
            <div className="md:col-span-2 flex gap-2 mt-4">
                <button disabled={isUploading} className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 flex justify-center items-center gap-2 shadow-md transition">
                    {isUploading ? "Envoi en cours..." : (editingPromoId ? "Mettre à jour la Promo" : "Sauvegarder dans l'historique")}
                    {!isUploading && <Upload size={18}/>}
                </button>
                {editingPromoId && (
                    <button type="button" onClick={() => { setEditingPromoId(null); setNewPromo({ text: '', title: '', discount: '', description: '', bgImage: '' }); }} className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500">Annuler</button>
                )}
            </div>
        </form>

        {/* LISTE DES PROMOTIONS */}
        <div className="grid grid-cols-1 gap-4">
            {promosList.map(p => (
                <div key={p.id} className={`border p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-sm ${p.active ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            {p.bgImage ? <img src={p.bgImage} className="w-full h-full object-cover" alt="promo" /> : <Megaphone className="w-full h-full p-4 text-gray-300" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-800">{p.title}</h4>
                                {p.discount && <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{p.discount}</span>}
                            </div>
                            <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-[400px]">{p.text}</p>
                            {p.active ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 mt-1 bg-green-100 px-2 py-0.5 rounded"><CheckCircle size={10}/> En ligne sur le site</span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-1"><XCircle size={10}/> Dans les archives</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <button onClick={() => handleActivatePromo(p.id, p.active)} className={`text-xs font-bold px-4 py-2 rounded-lg transition ${p.active ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {p.active ? 'Désactiver' : 'Publier'}
                        </button>
                        <button onClick={() => handleEditPromo(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition" title="Modifier"><Edit size={18}/></button>
                        <button onClick={() => handleDelete('promos', p.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full transition" title="Supprimer"><Trash2 size={18}/></button>
                    </div>
                </div>
            ))}
            {promosList.length === 0 && <p className="text-center text-gray-400 italic py-4">Aucune promotion dans l'historique.</p>}
        </div>
    </div>
  );
};

export default AdminPromo;
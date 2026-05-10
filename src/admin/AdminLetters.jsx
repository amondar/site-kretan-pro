import React from 'react';
import { Layout, Edit, Save, Trash2 } from 'lucide-react';

const AdminLetters = ({
    newLetter,
    setNewLetter,
    handleSaveOpenLetter,
    isUploading,
    setLetterImageFile,
    editingLetterId,
    setEditingLetterId,
    openLetters,
    handleActivateLetter,
    handleEditLetter,
    handleDelete
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-gray-800 lg:col-span-2">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
            📜 Lettres Ouvertes (Historique & Multimédia)
        </h3>
        
        <form onSubmit={handleSaveOpenLetter} className="space-y-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Titre / Objet :</label>
                    <input required className="w-full border p-2 rounded" value={newLetter.title} onChange={e => setNewLetter({...newLetter, title: e.target.value})} placeholder="Ex: Message à nos partenaires" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Date d'affichage :</label>
                    <input required className="w-full border p-2 rounded" value={newLetter.date} onChange={e => setNewLetter({...newLetter, date: e.target.value})} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Image d'illustration (Fichier) :</label>
                    <input type="file" accept="image/*" onChange={(e) => setLetterImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">OU Lien de l'image (URL) :</label>
                    <input className="w-full border p-2 rounded" value={newLetter.imageUrl} onChange={e => setNewLetter({...newLetter, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Corps de la lettre :</label>
                <textarea required className="w-full border p-4 rounded h-40 font-serif text-gray-700 leading-relaxed bg-white" placeholder="Chers partenaires..." value={newLetter.content} onChange={e => setNewLetter({...newLetter, content: e.target.value})} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Signature :</label>
                <input required className="w-full border p-2 rounded font-bold text-gray-700" value={newLetter.signature} onChange={e => setNewLetter({...newLetter, signature: e.target.value})} placeholder="La Direction KréTan" />
            </div>
            
            <div className="flex gap-2">
                <button type="submit" disabled={isUploading} className="flex-1 bg-gray-800 text-white font-bold py-2 rounded hover:bg-black transition flex justify-center gap-2">
                    {isUploading ? "Sauvegarde..." : (editingLetterId ? "Mettre à jour la lettre" : "Sauvegarder la lettre")} 
                    {!isUploading && (editingLetterId ? <Edit size={18}/> : <Save size={18}/>)}
                </button>
                {editingLetterId && (
                    <button type="button" onClick={() => {setEditingLetterId(null); setNewLetter({ title: '', content: '', signature: 'La Direction', date: new Date().toLocaleDateString(), imageUrl: '' })}} className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition">Annuler</button>
                )}
            </div>
        </form>

        {/* Historique des lettres */}
        <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase tracking-wider">Historique & Publication</h4>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {openLetters.map(lettre => (
                <div key={lettre.id} className={`flex items-center gap-4 border p-3 rounded-lg shadow-sm transition ${lettre.active ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
                    {lettre.imageUrl ? (
                        <img src={lettre.imageUrl} className="w-16 h-16 rounded object-cover" alt="mini" />
                    ) : (
                        <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400"><Layout size={20}/></div>
                    )}
                    
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{lettre.title}</p>
                        <p className="text-xs text-gray-500">{lettre.date} • {lettre.signature}</p>
                        {lettre.active && <span className="inline-block mt-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">En ligne</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => handleActivateLetter(lettre.id, lettre.active)} className={`text-xs font-bold px-3 py-1.5 rounded transition ${lettre.active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {lettre.active ? 'Retirer' : 'Publier'}
                        </button>
                        <button onClick={() => handleEditLetter(lettre)} className="text-blue-500 hover:bg-blue-100 p-2 rounded transition" title="Modifier"><Edit size={16}/></button>
                        <button onClick={() => handleDelete('open_letters', lettre.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition" title="Supprimer"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
            {openLetters.length === 0 && <p className="text-gray-400 italic text-sm text-center py-4">Aucune lettre sauvegardée.</p>}
        </div>
    </div>
  );
};

export default AdminLetters;
import React from 'react';
import { HardHat, Upload, Trash2, FileText, Link , Edit} from 'lucide-react';

const AdminOngoing = ({
    newOngoing,
    setNewOngoing,
    setOngoingImageFile,
    setOngoingPdfFile,
    handleAddOngoing,
    isUploading,
    ongoingProjects,
    handleDelete,
    editingOngoingId,
    handleEditOngoing,
    setEditingOngoingId
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-yellow-500 mt-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-800">
            <HardHat className="text-yellow-600" /> Projets en cours & Plans (Teasing PDF)
        </h3>
        
        <form onSubmit={handleAddOngoing} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Titre du Projet :</label>
                <input required className="border p-2 rounded w-full" placeholder="Ex: Plan Villa Duplex..." value={newOngoing.title} onChange={e => setNewOngoing({...newOngoing, title: e.target.value})} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Localisation / Statut :</label>
                <input required className="border p-2 rounded w-full" placeholder="Ex: Abidjan - Phase d'étude" value={newOngoing.location} onChange={e => setNewOngoing({...newOngoing, location: e.target.value})} />
            </div>

            {/* À placer sous le input de la Localisation */}
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description / Détails du projet :</label>
                <textarea 
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-500 outline-none bg-white min-h-[100px]" 
                    placeholder="Ex: Villa moderne de 4 pièces avec plafonnage spécial... (Sauts de ligne autorisés)" 
                    value={newOngoing.description || ''} 
                    onChange={e => setNewOngoing({...newOngoing, description: e.target.value})} 
                />
            </div>
                        
            {/* IMAGE FLOUTÉE */}
            {/* GALERIE D'IMAGES (Vues 3D) */}
            <div className="md:col-span-2 bg-white p-3 rounded shadow-sm border border-gray-100">
                <label className="block text-xs font-bold text-yellow-600 mb-2">🖼️ Galerie d'images (Rendus 3D pour attirer le client) :</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple // PERMET DE SÉLECTIONNER PLUSIEURS IMAGES
                    onChange={(e) => setOngoingImageFile(e.target.files)} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200" 
                />
                <p className="text-[10px] text-gray-400 mt-1 italic">Maintenez la touche "Ctrl" ou "Cmd" pour sélectionner plusieurs images à la fois (ex: façades, 3D).</p>
            </div>

            {/* FICHIER PDF (Double option : Fichier ou Lien) */}
            <div className="md:col-span-2 bg-white p-4 rounded shadow-sm border-2 border-dashed border-blue-200">
                <label className="block text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                    <FileText size={18}/> Dossier Technique / Plan PDF
                </label>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Option A : Charger le fichier (Max 10Mo)</label>
                        <input type="file" accept=".pdf" onChange={(e) => setOngoingPdfFile(e.target.files[0])} className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400 font-bold">OU</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Option B : Lien Google Drive (Recommandé pour les gros fichiers)</label>
                        <div className="mt-1 flex gap-2">
                            <div className="bg-gray-100 p-2 rounded-l border border-r-0 text-gray-400"><Link size={16}/></div>
                            <input 
                                className="border p-2 rounded-r w-full text-sm flex-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Collez le lien de partage Google Drive ici..." 
                                value={newOngoing.pdfUrl || ''} 
                                onChange={e => setNewOngoing({...newOngoing, pdfUrl: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>
            </div>

         
<div className="md:col-span-2 flex gap-2 mt-2">
    <button disabled={isUploading} type="submit" className="flex-1 bg-yellow-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-700 flex justify-center items-center gap-2 transition shadow-md">
        {isUploading ? "Traitement..." : (editingOngoingId ? "Mettre à jour ce projet" : "Ajouter ce projet")}
    </button>
    {editingOngoingId && (
        <button type="button" onClick={() => { setEditingOngoingId(null); setNewOngoing({ title: '', location: '', pdfUrl: '' }); }} className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition">
            Annuler
        </button>
    )}
</div>
        </form>

        {/* --- LISTE DES PROJETS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ongoingProjects.map(proj => (
                <div key={proj.id} className="flex items-center gap-3 border p-3 rounded-lg shadow-sm bg-white hover:border-yellow-200 transition">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden border border-gray-200">
                        {/* On gère l'affichage si c'est un tableau d'images ou une image simple */}
                        {proj.imageUrls?.[0] || proj.imageUrl ? (
                            <img src={proj.imageUrls?.[0] || proj.imageUrl} className="w-full h-full object-cover" alt="plan" />
                        ) : (
                            <HardHat className="text-gray-300" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800 leading-tight">{proj.title}</p>
                        <p className="text-[10px] text-gray-500">{proj.location}</p>
                        
                        {/* Le beau badge "Plan Attaché" */}
                        {proj.pdfUrl && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Plan Attaché</span>
                                {proj.pdfUrl.includes('drive.google.com') && <span className="text-[9px] text-green-600 font-bold">via Drive</span>}
                            </div>
                        )}
                    </div>

                    {/* LA ZONE D'ACTION CORRECTE (1 Crayon, 1 Poubelle) */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleEditOngoing(proj)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition" title="Modifier">
                            <Edit size={18}/>
                        </button>
                        <button onClick={() => handleDelete('ongoing_projects', proj.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-full transition" title="Supprimer">
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            ))}
            {ongoingProjects.length === 0 && <p className="col-span-full text-center text-gray-400 italic py-4">Aucun projet en cours.</p>}
        </div>
    </div>
  );
};

export default AdminOngoing;
import React from 'react';
import { Upload, Save, Edit, Trash2 } from 'lucide-react';

const AdminTeam = ({
    newTeamMember,
    setNewTeamMember,
    setImageFile,
    setCvFile,
    handleAddPublicTeam,
    isUploading,
    editingTeamMemberId,
    cancelEditTeamMember,
    publicTeam,
    handleEditTeamMember,
    handleDelete
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-purple-600 lg:col-span-2">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">👔 L'Équipe (Visible sur le site)</h3>
        
        <form onSubmit={handleAddPublicTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-purple-50 p-4 rounded-lg">
            <input required className="border p-2 rounded" placeholder="Nom Complet" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} />
            <input required className="border p-2 rounded" placeholder="Poste (ex: Directeur Technique)" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} />
            
            {/* SECTION IMAGE */}
            <div className="md:col-span-2 flex gap-2 items-center bg-white p-3 rounded shadow-sm border border-gray-100">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">📸 Photo du membre :</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                </div>
                <span className="text-gray-300 font-bold text-xs">OU URL:</span>
                <div className="flex-1">
                    <input className="border p-1.5 text-sm rounded w-full" placeholder="https://..." value={newTeamMember.imageUrl} onChange={e => setNewTeamMember({...newTeamMember, imageUrl: e.target.value})} />
                </div>
            </div>

            {/* SECTION CV PDF */}
            <div className="md:col-span-2 flex gap-2 items-center bg-white p-3 rounded shadow-sm border border-gray-100">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">📄 Fichier CV (PDF) :</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200" />
                </div>
                <span className="text-gray-300 font-bold text-xs">OU URL:</span>
                <div className="flex-1">
                    <input className="border p-1.5 text-sm rounded w-full" placeholder="Lien vers le CV..." value={newTeamMember.cvUrl} onChange={e => setNewTeamMember({...newTeamMember, cvUrl: e.target.value})} />
                </div>
            </div>

            {/* TEXTES (Citation & Bio) */}
            <input className="border p-2 rounded md:col-span-2" placeholder="Petite citation / Slogan (Visible sur l'accueil)..." value={newTeamMember.quote} onChange={e => setNewTeamMember({...newTeamMember, quote: e.target.value})} />
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Biographie Complète & Parcours :</label>
                <textarea className="border p-2 rounded w-full h-32 text-sm text-gray-700" placeholder="Décrivez le parcours, les diplômes, l'expérience..." value={newTeamMember.bio} onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} />
            </div>

            <div className="md:col-span-2 flex gap-2 mt-2">
                <button disabled={isUploading} type="submit" className="flex-1 bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 flex justify-center items-center gap-2 transition shadow-md">
                    {isUploading ? "Envoi en cours..." : (editingTeamMemberId ? "Mettre à jour ce membre" : "Ajouter ce membre")}
                    {!isUploading && (editingTeamMemberId ? <Save size={18}/> : <Upload size={18}/>)}
                </button>
                {editingTeamMemberId && (
                    <button type="button" onClick={cancelEditTeamMember} className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition">Annuler</button>
                )}
            </div>
        </form>

        {/* --- LA LISTE DES MEMBRES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicTeam.map(member => (
                <div key={member.id} className={`flex items-center gap-3 border p-2 rounded shadow-sm transition ${editingTeamMemberId === member.id ? 'bg-purple-100 border-purple-400' : 'bg-white'}`}>
                    <img src={member.imageUrl || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                    <div className="flex-1">
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <button onClick={() => handleEditTeamMember(member)} className="text-blue-500 hover:bg-blue-100 p-2 rounded transition" title="Modifier">
                        <Edit size={16}/>
                    </button>
                    <button onClick={() => handleDelete('public_team', member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition" title="Supprimer">
                        <Trash2 size={16}/>
                    </button>
                </div>
            ))}
            {publicTeam.length === 0 && <p className="text-gray-400 italic text-sm">Aucun membre affiché sur le site.</p>}
        </div>
    </div>
  );
};

export default AdminTeam;
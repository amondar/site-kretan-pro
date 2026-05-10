import React from 'react';
import { Layout, Upload, Trash2, Edit, Image as ImageIcon, Video } from 'lucide-react';

const AdminProjects = ({ 
    newProject, 
    setNewProject, 
    setProjectImageFile, 
    handleAddProject, 
    isUploading, 
    projects, 
    handleDelete,
    editingProjectId,
    setEditingProjectId,
    handleEditProject
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
            <Layout className="text-orange-500" /> Portfolio (Réalisations terminées)
        </h3>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titre du projet :</label>
                <input 
                    required 
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none bg-white" 
                    placeholder="Ex: Construction Villa Duplex..." 
                    value={newProject.title} 
                    onChange={e => setNewProject({...newProject, title: e.target.value})} 
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie :</label>
                <select 
                    className="border border-gray-300 p-3 rounded-lg w-full bg-white outline-none focus:ring-2 focus:ring-orange-500" 
                    value={newProject.type} 
                    onChange={e => setNewProject({...newProject, type: e.target.value})}
                >
                    <option value="Construction">Construction</option>
                    <option value="Rénovation">Rénovation</option>
                    <option value="Gros Œuvre">Gros Œuvre</option>
                    <option value="Architecture">Architecture</option>
                </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border border-gray-100">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-1"><ImageIcon size={14}/> Image de couverture</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setProjectImageFile(e.target.files[0])} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer" 
                    />
                    {editingProjectId && newProject.imageUrl && !newProject.videoUrl && (
                        <p className="text-[10px] text-gray-400 mt-2 italic">Laissez vide pour conserver l'image actuelle.</p>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-1"><Video size={14}/> OU Lien Vidéo (YouTube)</label>
                    <input 
                        className="border border-gray-300 p-2.5 rounded-lg w-full text-sm" 
                        placeholder="Ex: https://youtube.com/..." 
                        value={newProject.videoUrl || ''} 
                        onChange={e => setNewProject({...newProject, videoUrl: e.target.value})} 
                    />
                </div>
            </div>

            <div className="md:col-span-2 flex gap-2 mt-2">
                <button 
                    type="button" 
                    onClick={handleAddProject} 
                    disabled={isUploading || !newProject.title} 
                    className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 flex justify-center items-center gap-2 transition shadow-md disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Enregistrement en cours..." : (editingProjectId ? "Mettre à jour la réalisation" : "Ajouter au Portfolio")}
                    {!isUploading && <Upload size={18}/>}
                </button>
                {editingProjectId && (
                    <button type="button" onClick={() => { setEditingProjectId(null); setNewProject({ title: '', type: 'Construction', imageUrl: '', videoUrl: '' }); setProjectImageFile(null); }} className="bg-gray-400 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition">
                        Annuler
                    </button>
                )}
            </div>
        </form>

        {/* LISTE DES PROJETS ENREGISTRÉS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition group relative flex flex-col">
                    
                    {/* BOUTONS D'ACTION (Apparaissent au survol) */}
                    <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button onClick={() => handleEditProject(project)} className="bg-white text-blue-500 hover:text-blue-700 p-2 rounded-full shadow-lg transition" title="Modifier">
                            <Edit size={16}/>
                        </button>
                        <button onClick={() => handleDelete('projects', project.id)} className="bg-white text-red-500 hover:text-red-700 p-2 rounded-full shadow-lg transition" title="Supprimer">
                            <Trash2 size={16}/>
                        </button>
                    </div>

                    {/* MINIATURE (Image ou Vidéo) */}
                    <div className="h-40 bg-gray-100 relative overflow-hidden flex-shrink-0">
                        {project.videoUrl ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                                <Video size={32} className="opacity-50" />
                            </div>
                        ) : project.imageUrl ? (
                            <img src={project.imageUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt={project.title} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ImageIcon size={32} />
                            </div>
                        )}
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                            {project.type}
                        </span>
                    </div>

                    {/* INFOS */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{project.title}</h4>
                    </div>
                </div>
            ))}
            {projects.length === 0 && <p className="col-span-full text-center text-gray-400 italic py-8">Aucun projet dans le portfolio.</p>}
        </div>
    </div>
  );
};

export default AdminProjects;
import React from 'react';
import { Layout, Youtube, Upload, Trash2 } from 'lucide-react';

const AdminProjects = ({ 
  newProject, 
  setNewProject, 
  setProjectImageFile, 
  handleAddProject, 
  isUploading, 
  projects, 
  handleDelete 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-teal-500">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Layout className="text-teal-500"/> Portfolio (Chantiers Terminés)
        </h3>
        
        <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-teal-50 p-4 rounded-lg">
            <input 
                className="border p-2 rounded" 
                placeholder="Titre du projet (ex: Villa Assinie)" 
                value={newProject.title} 
                onChange={e => setNewProject({...newProject, title: e.target.value})} 
            />
            <select 
                className="border p-2 rounded bg-white" 
                value={newProject.type} 
                onChange={e => setNewProject({...newProject, type: e.target.value})}
            >
                <option>Gros Œuvre</option>
                <option>Finition</option>
                <option>Rénovation</option>
                <option>Route / VRD</option>
            </select>
            
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-red-600 mb-1 flex items-center gap-1">
                    <Youtube size={14}/> Option Vidéo (Youtube) :
                </label>
                <input 
                    className="border p-2 rounded w-full border-red-200 bg-red-50 text-sm" 
                    placeholder="Collez le lien YouTube ici (ex: https://youtu.be/...)" 
                    value={newProject.videoUrl || ''} 
                    onChange={e => setNewProject({...newProject, videoUrl: e.target.value})} 
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">Si vous mettez une vidéo, elle remplacera la photo sur le site.</p>
            </div>
            
            <div className="md:col-span-2 flex gap-2 items-center border-t border-gray-200 pt-2">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Ou Photo depuis l'ordi :</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setProjectImageFile(e.target.files[0])} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
                    />
                </div>
            </div>
            
            <button disabled={isUploading} className="md:col-span-2 bg-teal-600 text-white font-bold py-2 rounded hover:bg-teal-700 flex justify-center items-center gap-2 transition shadow-md">
                {isUploading ? "Envoi..." : "Ajouter ce projet"}
                {!isUploading && <Upload size={18}/>}
            </button>
        </form>
        
        <div className="max-h-40 overflow-y-auto pr-2">
            {projects.map(p => (
                <div key={p.id} className="flex justify-between items-center border-b border-gray-100 py-2">
                    <span className="text-sm font-medium text-gray-700">{p.title}</span>
                    <button onClick={() => handleDelete('projects', p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition">
                        <Trash2 size={16}/>
                    </button>
                </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-400 italic">Aucun projet dans le portfolio.</p>}
        </div>
    </div>
  );
};

export default AdminProjects;
import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const AdminUsers = ({
    newEmp,
    setNewEmp,
    handleAddEmployee,
    isUploading,
    employees,
    handleDelete
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulaire d'ajout */}
        <div className="bg-white p-6 rounded-xl shadow h-fit border-t-4 border-blue-500">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                <PlusCircle size={20}/> Nouvel Employé
            </h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500">Nom Complet</label>
                    <input required className="w-full border p-2 rounded" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Ex: Kouassi Jean" />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500">Email de connexion</label>
                    <input type="email" required className="w-full border p-2 rounded" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="Ex: jean@kretanpro.ci" />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500">Rôle / Poste</label>
                    <select className="w-full border p-2 rounded bg-white" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                        <option value="Ouvrier">Ouvrier</option>
                        <option value="Chef de Chantier">Chef de Chantier</option>
                        <option value="Admin">Admin (Accès CMS Complet)</option>
                        <option value="Directeur">Directeur</option>
                    </select>
                </div>
                
                <div>
                    <label className="text-xs font-bold text-gray-500">Code (Mot de passe) - Min 6 caractères</label>
                    <input required className="w-full border p-2 rounded uppercase font-mono text-center tracking-widest" value={newEmp.code} onChange={e => setNewEmp({...newEmp, code: e.target.value})} placeholder="Ex: A12345" minLength={6} maxLength={10}/>
                </div>
                
                <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-md">
                    {isUploading ? 'Création...' : 'Enregistrer'}
                </button>
            </form>
        </div>

        {/* Tableau de la liste du personnel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border-t-4 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-700">Liste du personnel ({employees.length})</h3>
            </div>
            <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 font-bold text-left sticky top-0">
                        <tr>
                            <th className="p-3 rounded-tl-lg">Nom</th>
                            <th className="p-3">Rôle</th>
                            <th className="p-3">Code interne</th>
                            <th className="p-3 rounded-tr-lg text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-blue-50 transition">
                                <td className="p-3 font-bold text-gray-800">{emp.name}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.role === 'Admin' ? 'bg-purple-100 text-purple-700' : emp.role === 'Chef de Chantier' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="p-3 font-mono text-gray-500">{emp.code}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleDelete('users', emp.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full hover:bg-red-100 transition">
                                        <Trash2 size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && <p className="text-center text-gray-400 py-8 italic">Aucun employé enregistré.</p>}
            </div>
        </div>

    </div>
  );
};

export default AdminUsers;
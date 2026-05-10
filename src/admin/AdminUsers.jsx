import React from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const AdminUsers = ({ newEmp, setNewEmp, handleAddEmployee, isUploading, employees, handleDelete, editingEmpId, setEditingEmpId, handleEditEmployee }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow h-fit border-t-4 border-blue-500">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                <PlusCircle size={20}/> {editingEmpId ? 'Modifier Employé' : 'Nouvel Employé'}
            </h3>
            <form className="space-y-4">
                <div><label className="text-xs font-bold text-gray-500">Nom Complet</label><input required className="w-full border p-2 rounded" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Ex: Kouassi Jean" /></div>
                <div><label className="text-xs font-bold text-gray-500">Email de connexion</label><input type="email" required className="w-full border p-2 rounded" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="Ex: jean@kretanpro.ci" disabled={editingEmpId !== null} />{editingEmpId && <p className="text-[10px] text-orange-500 mt-1">L'email ne peut pas être modifié.</p>}</div>
                <div><label className="text-xs font-bold text-gray-500">Rôle / Poste</label><select className="w-full border p-2 rounded bg-white" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}><option value="Ouvrier">Ouvrier</option><option value="Chef de Chantier">Chef de Chantier</option><option value="Admin">Admin</option><option value="Directeur">Directeur</option></select></div>
                <div><label className="text-xs font-bold text-gray-500">Code (Mot de passe) - Min 6 caractères</label><input required className="w-full border p-2 rounded uppercase font-mono text-center tracking-widest" value={newEmp.code} onChange={e => setNewEmp({...newEmp, code: e.target.value})} placeholder="Ex: A12345" minLength={6} maxLength={10}/></div>
                <div className="flex gap-2">
                    <button type="button" onClick={handleAddEmployee} disabled={isUploading || !newEmp.name} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-md disabled:bg-gray-400">{isUploading ? 'Chargement...' : (editingEmpId ? 'Mettre à jour' : 'Enregistrer')}</button>
                    {editingEmpId && <button type="button" onClick={() => { setEditingEmpId(null); setNewEmp({name:'', role:'Ouvrier', code:'', email:''}); }} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition">Annuler</button>}
                </div>
            </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border-t-4 border-gray-200">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Liste du personnel ({employees.length})</h3>
            <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 font-bold text-left sticky top-0"><tr><th className="p-3 rounded-tl-lg">Nom</th><th className="p-3">Rôle</th><th className="p-3">Code interne</th><th className="p-3 rounded-tr-lg text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-blue-50 transition">
                                <td className="p-3 font-bold text-gray-800">{emp.name}</td>
                                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.role === 'Admin' ? 'bg-purple-100 text-purple-700' : emp.role === 'Chef de Chantier' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{emp.role}</span></td>
                                <td className="p-3 font-mono text-gray-500">{emp.code}</td>
                                <td className="p-3 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEditEmployee(emp)} className="text-blue-400 hover:text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition"><Edit size={16}/></button>
                                    <button onClick={() => handleDelete('users', emp.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
export default AdminUsers;
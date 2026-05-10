import React from 'react';
import { Brain, Trash2, Edit } from 'lucide-react';

const AdminAi = ({ newRule, setNewRule, handleAddRule, knowledge, handleDelete, editingRuleId, setEditingRuleId, handleEditRule }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500 max-w-4xl">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-800">
            <Brain className="text-indigo-500" /> Cerveau IA (Règles du Chatbot)
        </h3>
        
        <form className="flex flex-col md:flex-row gap-3 mb-8 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <input required className="border p-2 rounded md:w-1/3 bg-white" placeholder="Mots clés (ex: prix)..." value={newRule.keywords} onChange={e => setNewRule({...newRule, keywords: e.target.value})} />
            <input required className="border p-2 rounded flex-1 bg-white" placeholder="Réponse du bot..." value={newRule.response} onChange={e => setNewRule({...newRule, response: e.target.value})} />
            <div className="flex gap-2">
                <button type="button" onClick={handleAddRule} disabled={!newRule.keywords || !newRule.response} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded transition shadow-sm disabled:bg-gray-400">{editingRuleId ? 'Mettre à jour' : 'Apprendre'}</button>
                {editingRuleId && <button type="button" onClick={() => { setEditingRuleId(null); setNewRule({keywords:'', response:''}); }} className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded transition">Annuler</button>}
            </div>
        </form>

        <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b font-bold text-sm text-gray-600">Connaissances actuelles ({knowledge.length})</div>
            <div className="max-h-96 overflow-y-auto p-2">
                {knowledge.map(k => (
                    <div key={k.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b p-3 hover:bg-gray-50 transition gap-4">
                        <div className="text-sm">
                            <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold mr-2">Si le client dit :</span> <span className="font-medium">{k.keywords}</span><br className="md:hidden" />
                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold mr-2 md:ml-4 mt-2 md:mt-0">Le bot répond :</span> <span className="text-gray-600">{k.response}</span>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleEditRule(k)} className="text-blue-400 hover:text-blue-600 bg-blue-50 p-2 rounded transition"><Edit size={16}/></button>
                            <button onClick={() => handleDelete('chatbot_knowledge', k.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded transition"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
export default AdminAi;
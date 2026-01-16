import React, { useState, useEffect } from 'react';
import { Lock, User, FileText, Download, AlertTriangle, CheckCircle, LogIn, Users, Trash2, PlusCircle, ShieldAlert, Brain, MessageSquare } from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const AccessControl = () => {
  const [view, setView] = useState('login'); 
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  // Données
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]); // <--- NOUVEAU : Le cerveau de l'IA

  // Formulaire Nouvel Employé & Nouvelle Règle IA
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '' });
  const [newRule, setNewRule] = useState({ keywords: '', response: '' }); // <--- NOUVEAU

  const MASTER_KEY = "KRETAN2026"; 

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    // Logs
    const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snap) => setAccessLogs(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    // Employés
    const qUsers = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubUsers = onSnapshot(qUsers, (snap) => setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    // IA Knowledge (Cerveau)
    const qBrain = query(collection(db, "chatbot_knowledge"), orderBy("createdAt", "desc"));
    const unsubBrain = onSnapshot(qBrain, (snap) => setKnowledge(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubLogs(); unsubUsers(); unsubBrain(); };
  }, []);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  // --- POINTAGE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const code = inputCode.toUpperCase().trim();
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    if (code === MASTER_KEY) {
      setView('dashboard');
      showFeedback('success', 'Mode Administrateur activé');
      setInputCode('');
      return;
    }

    const foundUser = employees.find(emp => emp.code === code);
    if (foundUser) {
      try {
        await addDoc(collection(db, "logs"), {
          code: code, name: foundUser.name, role: foundUser.role, status: 'Succès', type: 'Pointage', displayDate: dateString, timestamp: serverTimestamp()
        });
        showFeedback('success', `Bienvenue ${foundUser.name}.`);
        if (['Admin', 'Directeur'].includes(foundUser.role)) {
           setTimeout(() => { if(window.confirm("Accéder au tableau de bord ?")) setView('dashboard'); }, 500);
        }
      } catch (err) { showFeedback('error', "Erreur serveur."); }
    } else {
      showFeedback('error', "Code inconnu.");
      await addDoc(collection(db, "logs"), { code: code, name: 'Inconnu', role: 'N/A', status: 'Échec', type: 'Intrusion', displayDate: dateString, timestamp: serverTimestamp() });
    }
    setInputCode('');
  };

  // --- GESTION EMPLOYÉS ---
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.code) return alert("Remplissez tout.");
    await addDoc(collection(db, "users"), { ...newEmp, code: newEmp.code.toUpperCase(), createdAt: serverTimestamp() });
    setNewEmp({ name: '', role: 'Ouvrier', code: '' });
  };
  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Supprimer cet élément ?")) await deleteDoc(doc(db, collectionName, id));
  };

  // --- GESTION IA (NOUVEAU) ---
  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.keywords || !newRule.response) return alert("Il faut des mots-clés et une réponse !");
    await addDoc(collection(db, "chatbot_knowledge"), { 
      keywords: newRule.keywords.toLowerCase(), // On stocke en minuscule pour faciliter la recherche
      response: newRule.response, 
      createdAt: serverTimestamp() 
    });
    alert("L'IA a appris une nouvelle réponse !");
    setNewRule({ keywords: '', response: '' });
  };

  // === RENDU VISUEL ===
  if (view === 'login') {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6"><div className="bg-teal-100 p-4 rounded-full"><Lock className="w-8 h-8 text-teal-600" /></div></div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Accès KréTan Pro+</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="CODE D'ACCÈS..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl border-2 border-gray-300 rounded-lg p-3 uppercase" />
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"><LogIn size={20} /> Valider</button>
          </form>
          {feedback.msg && <div className={`mt-4 p-3 rounded-lg text-center font-bold ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.msg}</div>}
        </div>
      </section>
    );
  }

  // TABLEAU DE BORD
  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Administration</h1>
          <button onClick={() => setView('login')} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Déconnexion</button>
        </div>

        {/* Navigation Onglets */}
        <div className="flex gap-4 mb-6 border-b pb-1 overflow-x-auto">
          <button onClick={() => setView('dashboard')} className={`pb-2 px-2 font-bold whitespace-nowrap ${view === 'dashboard' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-400'}`}>📊 Historique</button>
          <button onClick={() => setView('users')} className={`pb-2 px-2 font-bold whitespace-nowrap ${view === 'users' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-400'}`}>👥 Personnel</button>
          <button onClick={() => setView('ai')} className={`pb-2 px-2 font-bold whitespace-nowrap flex items-center gap-2 ${view === 'ai' ? 'text-purple-600 border-b-4 border-purple-500' : 'text-gray-400'}`}><Brain size={18}/> Cerveau IA</button>
        </div>

        {/* VUE : CERVEAU IA */}
        {view === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 h-fit">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-700"><Brain size={20}/> Éduquer l'IA</h3>
              <p className="text-xs text-gray-500 mb-4">Ajoutez des mots-clés et la réponse que l'IA doit donner.</p>
              <form onSubmit={handleAddRule} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Mots-clés (séparés par des virgules)</label>
                  <input type="text" className="w-full border p-2 rounded" value={newRule.keywords} onChange={e => setNewRule({...newRule, keywords: e.target.value})} placeholder="Ex: prix, tarif, cout, devis" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Réponse de l'IA</label>
                  <textarea rows="4" className="w-full border p-2 rounded" value={newRule.response} onChange={e => setNewRule({...newRule, response: e.target.value})} placeholder="Ex: Nos tarifs dépendent du projet. Cliquez sur 'Devis' pour une estimation gratuite." />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow">Enregistrer la règle</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-200">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageSquare size={20}/> Connaissances actuelles ({knowledge.length})</h3>
               <div className="space-y-3 max-h-[500px] overflow-y-auto">
                 {knowledge.length === 0 && <p className="text-gray-400 italic">Le cerveau est vide. Ajoutez une première règle !</p>}
                 {knowledge.map(k => (
                   <div key={k.id} className="border p-4 rounded-lg hover:shadow-md transition bg-gray-50">
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="text-xs font-bold text-purple-600 uppercase mb-1">Si le client dit :</p>
                         <p className="font-mono text-sm text-gray-800 bg-white p-1 border rounded inline-block mb-2">{k.keywords}</p>
                         <p className="text-xs font-bold text-green-600 uppercase mb-1">L'IA répond :</p>
                         <p className="text-gray-700 text-sm">{k.response}</p>
                       </div>
                       <button onClick={() => handleDelete('chatbot_knowledge', k.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* VUE : PERSONNEL (Code réduit pour l'exemple, mais incluez tout le bloc précédent ici) */}
        {view === 'users' && (
            <div className="text-center p-10 bg-white rounded-xl shadow">
               <h3 className="text-xl font-bold mb-4">Gestion du Personnel</h3>
               {/* Remettez ici le code de la gestion du personnel de l'étape précédente */}
               {/* Pour faire court : C'est le même code que l'étape d'avant pour view === 'users' */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                  {/* Formulaire ajout employé */}
                  <div className="bg-white p-6 border rounded shadow h-fit">
                    <form onSubmit={handleAddEmployee} className="space-y-4">
                        <input className="w-full border p-2" placeholder="Nom" value={newEmp.name} onChange={e=>setNewEmp({...newEmp, name: e.target.value})} />
                        <select className="w-full border p-2" value={newEmp.role} onChange={e=>setNewEmp({...newEmp, role: e.target.value})}><option>Ouvrier</option><option>Chef</option><option>Admin</option></select>
                        <input className="w-full border p-2" placeholder="CODE" value={newEmp.code} onChange={e=>setNewEmp({...newEmp, code: e.target.value})} />
                        <button className="w-full bg-teal-600 text-white p-2 rounded">Ajouter</button>
                    </form>
                  </div>
                  {/* Liste employés */}
                  <div className="lg:col-span-2">
                    {employees.map(e => <div key={e.id} className="flex justify-between border-b p-2"><span>{e.name} ({e.role}) - {e.code}</span><button onClick={()=>handleDelete('users', e.id)} className="text-red-500"><Trash2/></button></div>)}
                  </div>
                </div>
            </div>
        )}

        {/* VUE : DASHBOARD (Idem, code précédent) */}
        {view === 'dashboard' && (
           <div className="bg-white p-6 rounded-xl shadow">
             <h3 className="font-bold mb-4">Journal des accès</h3>
             {accessLogs.map(l => <div key={l.id} className="border-b p-2 text-sm">{l.displayDate} - {l.name} - {l.status}</div>)}
           </div>
        )}

      </div>
    </section>
  );
};
export default AccessControl;
import React, { useState, useEffect } from 'react';
import { Lock, FileText, Download, AlertTriangle, CheckCircle, LogIn, Users, Trash2, PlusCircle, ShieldAlert, Brain, MessageSquare, Layout, Megaphone, Save, Image as ImageIcon } from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

const AccessControl = () => {
  const [view, setView] = useState('login'); // 'login', 'dashboard', 'users', 'ai', 'website'
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  // --- DONNÉES ---
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [projects, setProjects] = useState([]);

  const [promoData, setPromoData] = useState({ title: '', desc: '', discount: '', active: false, imageUrl: '', topBanner: '' });
  // --- FORMULAIRES ---
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '' });
  const [newRule, setNewRule] = useState({ keywords: '', response: '' });
  const [newProject, setNewProject] = useState({ title: '', type: 'Construction', imageUrl: '' });

  // CODE MAÎTRE
  const MASTER_KEY = "KRETAN2026"; 

  // --- 1. CHARGEMENT COMPLET (TOUTES LES DONNÉES) ---
  useEffect(() => {
    // A. Logs
    const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snap) => setAccessLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // B. Employés
    const qUsers = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubUsers = onSnapshot(qUsers, (snap) => setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // C. Cerveau IA
    const qBrain = query(collection(db, "chatbot_knowledge"), orderBy("createdAt", "desc"));
    const unsubBrain = onSnapshot(qBrain, (snap) => setKnowledge(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // D. Chantiers (Nouveau)
    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubProjects = onSnapshot(qProjects, (snap) => setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // E. Promo (Nouveau)
    const loadPromo = async () => {
        try {
            const docRef = doc(db, "content", "promo_main");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setPromoData(docSnap.data());
        } catch (e) { console.error("Pas de promo active", e); }
    };
    loadPromo();

    return () => { unsubLogs(); unsubUsers(); unsubBrain(); unsubProjects(); };
  }, []);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  // --- 2. GESTION CONNEXION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const code = inputCode.toUpperCase().trim();
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    // ADMIN SUPRÊME
    if (code === MASTER_KEY) {
      setView('dashboard');
      showFeedback('success', 'Mode Administrateur activé');
      setInputCode('');
      return;
    }

    // EMPLOYÉS
    const foundUser = employees.find(emp => emp.code === code);
    if (foundUser) {
      try {
        await addDoc(collection(db, "logs"), {
          code: code, name: foundUser.name, role: foundUser.role, status: 'Succès', type: 'Pointage', displayDate: dateString, timestamp: serverTimestamp()
        });
        showFeedback('success', `Bienvenue ${foundUser.name}. Pointage OK.`);
        if (['Admin', 'Directeur'].includes(foundUser.role)) {
           setTimeout(() => { if(window.confirm("Accéder au CMS ?")) setView('dashboard'); }, 500);
        }
      } catch (err) { showFeedback('error', "Erreur serveur."); }
    } else {
      showFeedback('error', "Code inconnu.");
      try {
        await addDoc(collection(db, "logs"), { code: code, name: 'Inconnu', role: 'N/A', status: 'Échec', type: 'Intrusion', displayDate: dateString, timestamp: serverTimestamp() });
      } catch (e) {}
    }
    setInputCode('');
  };

  // --- 3. ACTIONS SUPPRESSION GÉNÉRIQUE ---
  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  // --- 4. ACTIONS SPÉCIFIQUES ---
  
  // Ajouter Employé
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.code) return alert("Remplissez tous les champs");
    await addDoc(collection(db, "users"), { ...newEmp, code: newEmp.code.toUpperCase(), createdAt: serverTimestamp() });
    setNewEmp({ name: '', role: 'Ouvrier', code: '' });
    alert("Employé ajouté !");
  };

  // Ajouter Règle IA
  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.keywords || !newRule.response) return alert("Remplissez tout");
    await addDoc(collection(db, "chatbot_knowledge"), { 
      keywords: newRule.keywords.toLowerCase(), response: newRule.response, createdAt: serverTimestamp() 
    });
    setNewRule({ keywords: '', response: '' });
    alert("L'IA a appris une nouvelle règle !");
  };

  // Ajouter Projet
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl) return alert("Titre et Image requis");
    await addDoc(collection(db, "projects"), { ...newProject, createdAt: serverTimestamp() });
    setNewProject({ title: '', type: 'Construction', imageUrl: '' });
    alert("Chantier ajouté au site !");
  };

  // Mettre à jour Promo
  const handleUpdatePromo = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "content", "promo_main"), promoData);
    alert("Promotion mise à jour !");
  };

  // Export CSV
  const downloadReport = () => {
    let csv = "Date,Code,Nom,Role,Statut\n";
    accessLogs.forEach(l => csv += `${l.displayDate},${l.code},${l.name},${l.role},${l.status}\n`);
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = "Rapport_Kretan.csv";
    link.click();
  };

  // === RENDU VISUEL ===

  // 1. LOGIN
  if (view === 'login') {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6"><div className="bg-teal-100 p-4 rounded-full"><Lock className="w-8 h-8 text-teal-600" /></div></div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Accès KréTan CMS</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="VOTRE CODE..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl border-2 border-gray-300 rounded-lg p-3 uppercase" />
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"><LogIn size={20} /> Valider</button>
          </form>
          {feedback.msg && <div className={`mt-4 p-3 rounded text-center font-bold ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.msg}</div>}
        </div>
      </section>
    );
  }

  // 2. DASHBOARD COMPLET
  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-800">KréTan CMS</h1><p className="text-sm text-gray-500">Administration Centrale</p></div>
          <button onClick={() => setView('login')} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Déconnexion</button>
        </div>

        {/* Menu Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-full font-bold transition ${view === 'dashboard' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 shadow-sm'}`}>📊 Logs</button>
          <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full font-bold transition ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow-sm'}`}>👥 Équipe</button>
          <button onClick={() => setView('ai')} className={`px-4 py-2 rounded-full font-bold transition ${view === 'ai' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 shadow-sm'}`}>🧠 Cerveau IA</button>
          <button onClick={() => setView('website')} className={`px-4 py-2 rounded-full font-bold transition ${view === 'website' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 shadow-sm'}`}>🖥️ Site Web</button>
        </div>

        {/* --- VUE 1: HISTORIQUE (LOGS) --- */}
        {view === 'dashboard' && (
           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-700">Journal des accès</h3>
               <button onClick={downloadReport} className="text-green-700 font-bold flex items-center gap-1"><Download size={16}/> Export Excel</button>
             </div>
             <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-100 text-gray-600 sticky top-0"><tr><th className="p-3">Heure</th><th className="p-3">Code</th><th className="p-3">Identité</th><th className="p-3">Statut</th></tr></thead>
                 <tbody>
                    {accessLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">{log.displayDate}</td>
                        <td className="p-3 font-bold">{log.code}</td>
                        <td className="p-3">{log.name} ({log.role})</td>
                        <td className="p-3">{log.status === 'Succès' ? <span className="text-green-600 font-bold">OK</span> : <span className="text-red-600 font-bold">INTRUSION</span>}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {/* --- VUE 2: PERSONNEL --- */}
        {view === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow h-fit">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><PlusCircle size={20}/> Nouvel Employé</h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <input className="w-full border p-2 rounded" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Nom complet" />
                <select className="w-full border p-2 rounded" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                  <option>Ouvrier</option><option>Chef de Chantier</option><option>Admin</option><option>Stagiaire</option>
                </select>
                <input className="w-full border p-2 rounded uppercase" value={newEmp.code} onChange={e => setNewEmp({...newEmp, code: e.target.value})} placeholder="CODE D'ACCÈS" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded">Enregistrer</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
               <h3 className="font-bold text-lg mb-4">Liste du personnel ({employees.length})</h3>
               <div className="overflow-auto max-h-[500px]">
                 <table className="w-full text-sm">
                   <thead><tr className="bg-gray-100 text-left"><th className="p-2">Nom</th><th className="p-2">Rôle</th><th className="p-2">Code</th><th className="p-2">Action</th></tr></thead>
                   <tbody>
                     {employees.map(emp => (
                       <tr key={emp.id} className="border-b">
                         <td className="p-2 font-bold">{emp.name}</td><td className="p-2">{emp.role}</td><td className="p-2 font-mono">{emp.code}</td>
                         <td className="p-2"><button onClick={() => handleDelete('users', emp.id)} className="text-red-500"><Trash2 size={16}/></button></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* --- VUE 3: CERVEAU IA --- */}
        {view === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow h-fit border-t-4 border-purple-500">
              <h3 className="font-bold text-lg mb-4 text-purple-700">Éduquer l'IA</h3>
              <form onSubmit={handleAddRule} className="space-y-4">
                <input type="text" className="w-full border p-2 rounded" value={newRule.keywords} onChange={e => setNewRule({...newRule, keywords: e.target.value})} placeholder="Mots-clés (ex: prix, devis)" />
                <textarea rows="4" className="w-full border p-2 rounded" value={newRule.response} onChange={e => setNewRule({...newRule, response: e.target.value})} placeholder="Réponse de l'IA..." />
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded">Apprendre</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
               <h3 className="font-bold text-lg mb-4">Connaissances ({knowledge.length})</h3>
               <div className="space-y-3 max-h-[500px] overflow-y-auto">
                 {knowledge.map(k => (
                   <div key={k.id} className="border p-3 rounded hover:bg-gray-50 flex justify-between">
                     <div><span className="font-bold text-purple-600 text-xs uppercase">Si:</span> <span className="font-mono text-sm bg-gray-100 px-1">{k.keywords}</span> <br/> <span className="font-bold text-green-600 text-xs uppercase">Dire:</span> <span className="text-sm text-gray-700">{k.response}</span></div>
                     <button onClick={() => handleDelete('chatbot_knowledge', k.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* --- VUE 4: GESTION SITE WEB --- */}
        {view === 'website' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* DANS AccessControl.jsx (Section Website > Promo) */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-red-500">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Megaphone className="text-red-500"/> Promo & Flyer</h3>
                    <form onSubmit={handleUpdatePromo} className="space-y-4">
                        
                        {/* NOUVEAU : La Bannière du haut */}
                        <div className="bg-teal-50 p-3 rounded border border-teal-200">
                           <label className="text-xs font-bold text-teal-800 uppercase">📢 Bandeau tout en haut du site</label>
                           <input 
                             className="w-full border p-2 rounded mt-1 text-sm" 
                             value={promoData.topBanner || ''} 
                             onChange={e => setPromoData({...promoData, topBanner: e.target.value})} 
                             placeholder="Ex: Livraison gratuite partout en CI cette semaine !" 
                           />
                        </div>

                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded mt-4">
                            <input type="checkbox" className="w-5 h-5 accent-red-500" checked={promoData.active} onChange={e => setPromoData({...promoData, active: e.target.checked})} />
                            <label className="font-bold text-gray-700">Afficher la grosse section Promo ?</label>
                        </div>
                        
                        <input className="w-full border p-2 rounded" value={promoData.title} onChange={e => setPromoData({...promoData, title: e.target.value})} placeholder="Titre (ex: Spécial Fêtes)" />
                        <input className="w-full border p-2 rounded" value={promoData.discount} onChange={e => setPromoData({...promoData, discount: e.target.value})} placeholder="Réduction (ex: -20%)" />
                        <textarea className="w-full border p-2 rounded" value={promoData.desc} onChange={e => setPromoData({...promoData, desc: e.target.value})} placeholder="Description..." />
                        <input className="w-full border p-2 rounded" value={promoData.imageUrl} onChange={e => setPromoData({...promoData, imageUrl: e.target.value})} placeholder="Lien Image Flyer (https://...)" />
                        
                        <button className="w-full bg-red-600 text-white font-bold py-3 rounded flex justify-center gap-2"><Save size={20}/> Mettre à jour</button>
                    </form>
                </div>
                {/* CHANTIERS */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-teal-500">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Layout className="text-teal-500"/> Ajouter Réalisation</h3>
                    <form onSubmit={handleAddProject} className="space-y-4 mb-6">
                        <input className="w-full border p-2 rounded" placeholder="Titre (Ex: Villa Abidjan)" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                        <select className="w-full border p-2 rounded" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})}><option>Construction</option><option>Rénovation</option><option>Voirie</option><option>Immobilier</option></select>
                        <input className="w-full border p-2 rounded" placeholder="Lien Image (https://...)" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                        <button className="w-full bg-teal-600 text-white font-bold py-2 rounded">Ajouter</button>
                    </form>
                    <div className="space-y-2 max-h-60 overflow-y-auto border-t pt-4">
                        {projects.map(p => (
                            <div key={p.id} className="flex justify-between items-center border p-2 rounded bg-gray-50">
                                <div className="flex items-center gap-2"><img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded" /><div className="text-xs font-bold">{p.title}</div></div>
                                <button onClick={() => handleDelete('projects', p.id)} className="text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default AccessControl;
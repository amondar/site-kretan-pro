import React, { useState, useEffect } from 'react';
import { Lock, User, FileText, Download, AlertTriangle, CheckCircle, LogIn, Users, Trash2, PlusCircle, ShieldAlert } from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where, deleteDoc, doc } from 'firebase/firestore';

const AccessControl = () => {
  const [view, setView] = useState('login'); // 'login', 'dashboard', 'users'
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  // Données
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Formulaire Nouvel Employé
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '' });

  // CODE MAÎTRE (Le seul qui reste "en dur" pour la sécurité initiale)
  const MASTER_KEY = "KRETAN2026"; 

  // --- 1. CHARGEMENT DES DONNÉES (Temps Réel) ---
  useEffect(() => {
    // Écouter les Logs
    const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setAccessLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Écouter les Employés (Utilisateurs)
    const qUsers = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubLogs(); unsubUsers(); };
  }, []);

  // --- 2. GESTION DES MESSAGES ---
  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  // --- 3. SYSTÈME DE POINTAGE INTELLIGENT ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const code = inputCode.toUpperCase().trim();
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    // A. Accès ADMIN SUPRÊME
    if (code === MASTER_KEY) {
      setView('dashboard');
      showFeedback('success', 'Mode Administrateur activé');
      setInputCode('');
      return;
    }

    // B. Vérification dans la Base de Données (Employés)
    // On cherche si ce code existe parmi les employés enregistrés
    const foundUser = employees.find(emp => emp.code === code);

    if (foundUser) {
      // C'est un employé valide -> On enregistre le pointage
      try {
        await addDoc(collection(db, "logs"), {
          code: code,
          name: foundUser.name,
          role: foundUser.role,
          status: 'Succès',
          type: 'Pointage',
          displayDate: dateString,
          timestamp: serverTimestamp()
        });
        showFeedback('success', `Bienvenue ${foundUser.name}. Pointage enregistré.`);
        
        // Si c'est un Admin ou Chef, on peut lui proposer d'aller au dashboard
        if (foundUser.role === 'Admin' || foundUser.role === 'Directeur') {
           setTimeout(() => {
             if(window.confirm("Voulez-vous accéder au tableau de bord de gestion ?")) setView('dashboard');
           }, 500);
        }

      } catch (err) {
        showFeedback('error', "Erreur de connexion serveur.");
      }
    } else {
      // C. Code inconnu -> Alerte Sécurité
      showFeedback('error', "Code inconnu. Accès refusé.");
      try {
        await addDoc(collection(db, "logs"), {
          code: code,
          name: 'Inconnu',
          role: 'N/A',
          status: 'Échec',
          type: 'Intrusion',
          displayDate: dateString,
          timestamp: serverTimestamp()
        });
      } catch (err) { console.error(err); }
    }
    setInputCode('');
  };

  // --- 4. AJOUTER UN EMPLOYÉ ---
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.code) return alert("Remplissez tous les champs");

    // Vérifier si le code existe déjà
    if (employees.find(e => e.code === newEmp.code.toUpperCase())) {
      return alert("Ce code est déjà utilisé par un autre employé !");
    }

    try {
      await addDoc(collection(db, "users"), {
        name: newEmp.name,
        role: newEmp.role,
        code: newEmp.code.toUpperCase(),
        createdAt: serverTimestamp()
      });
      alert(`Employé ${newEmp.name} ajouté avec succès !`);
      setNewEmp({ name: '', role: 'Ouvrier', code: '' });
    } catch (error) {
      alert("Erreur lors de la création");
    }
  };

  // --- 5. SUPPRIMER UN EMPLOYÉ ---
  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'accès de ${name} ?`)) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  // --- 6. EXPORT CSV ---
  const downloadReport = () => {
    let csv = "Date,Code,Nom,Role,Statut\n";
    accessLogs.forEach(l => csv += `${l.displayDate},${l.code},${l.name},${l.role},${l.status}\n`);
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = "Rapport_Kretan.csv";
    link.click();
  };

  // === RENDU VISUEL ===

  // 1. ÉCRAN DE POINTAGE (Public)
  if (view === 'login') {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center" id="acces-pro">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="flex justify-center mb-6"><div className="bg-teal-100 p-4 rounded-full"><Lock className="w-8 h-8 text-teal-600" /></div></div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Pointage KréTan Pro+</h2>
          <p className="text-center text-gray-500 mb-6 text-sm">Entrez votre code personnel</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="VOTRE CODE..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl tracking-widest font-mono border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none uppercase" />
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2"><LogIn size={20} /> Valider</button>
          </form>

          {feedback.msg && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.type === 'success' ? <CheckCircle size={18}/> : <AlertTriangle size={18}/>} {feedback.msg}
            </div>
          )}
          <div className="mt-6 text-center text-xs text-gray-300 cursor-pointer hover:text-gray-500" title={`Code Maître: ${MASTER_KEY}`}>Administration</div>
        </div>
      </section>
    );
  }

  // 2. TABLEAU DE BORD (Privé)
  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Admin */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Administration KréTan</h1>
            <p className="text-gray-500 text-sm">Gérez vos équipes et suivez les accès</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setView('login')} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-bold text-gray-700">Déconnexion</button>
          </div>
        </div>

        {/* Navigation Onglets */}
        <div className="flex gap-4 mb-6 border-b border-gray-300 pb-1">
          <button onClick={() => setView('dashboard')} className={`pb-2 px-2 font-bold ${view === 'dashboard' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-400'}`}>📊 Historique & Rapports</button>
          <button onClick={() => setView('users')} className={`pb-2 px-2 font-bold ${view === 'users' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-400'}`}>👥 Gestion du Personnel</button>
        </div>

        {/* CONTENU : GESTION DU PERSONNEL */}
        {view === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire d'ajout */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 h-fit">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><PlusCircle size={20}/> Ajouter un employé</h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div><label className="text-xs font-bold text-gray-500">Nom Complet</label><input type="text" className="w-full border p-2 rounded" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Ex: Jean Kouassi" /></div>
                <div><label className="text-xs font-bold text-gray-500">Rôle / Fonction</label>
                  <select className="w-full border p-2 rounded" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                    <option value="Ouvrier">Ouvrier</option>
                    <option value="Chef de Chantier">Chef de Chantier</option>
                    <option value="Sécurité">Sécurité</option>
                    <option value="Stagiaire">Stagiaire</option>
                    <option value="Admin">Administrateur</option>
                  </select>
                </div>
                <div><label className="text-xs font-bold text-gray-500">Code d'accès (Unique)</label><input type="text" className="w-full border p-2 rounded uppercase font-mono tracking-widest" value={newEmp.code} onChange={e => setNewEmp({...newEmp, code: e.target.value})} placeholder="Ex: OUV05" /></div>
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded shadow">Enregistrer</button>
              </form>
            </div>

            {/* Liste des employés */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-200">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Users size={20}/> Liste du personnel ({employees.length})</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 uppercase text-xs text-gray-500"><tr><th className="p-3">Nom</th><th className="p-3">Rôle</th><th className="p-3">Code</th><th className="p-3">Action</th></tr></thead>
                   <tbody>
                     {employees.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-400">Aucun employé enregistré.</td></tr>}
                     {employees.map(emp => (
                       <tr key={emp.id} className="border-b hover:bg-gray-50">
                         <td className="p-3 font-bold">{emp.name}</td>
                         <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{emp.role}</span></td>
                         <td className="p-3 font-mono font-bold">{emp.code}</td>
                         <td className="p-3"><button onClick={() => handleDeleteEmployee(emp.id, emp.name)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* CONTENU : HISTORIQUE (DASHBOARD) */}
        {view === 'dashboard' && (
           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-700">Journal des accès (Temps réel)</h3>
               <button onClick={downloadReport} className="text-green-700 hover:text-green-800 text-sm font-bold flex items-center gap-1"><Download size={16}/> Exporter Excel</button>
             </div>
             <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-100 text-gray-600 sticky top-0"><tr><th className="p-3">Heure</th><th className="p-3">Code</th><th className="p-3">Identité</th><th className="p-3">Statut</th></tr></thead>
                 <tbody>
                    {accessLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">{log.displayDate}</td>
                        <td className="p-3 font-bold">{log.code}</td>
                        <td className="p-3">{log.name} <span className="text-gray-400 text-xs">({log.role})</span></td>
                        <td className="p-3">
                          {log.status === 'Succès' 
                            ? <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded">OK</span> 
                            : <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded flex items-center gap-1"><ShieldAlert size={12}/> INTRUSION</span>}
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        )}

      </div>
    </section>
  );
};

export default AccessControl;
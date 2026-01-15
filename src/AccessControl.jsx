import React, { useState, useEffect } from 'react';
import { Lock, User, FileText, Download, AlertTriangle, CheckCircle, LogIn } from 'lucide-react';

// --- IMPORT DE FIREBASE ---
import { db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const AccessControl = () => {
  const [view, setView] = useState('login'); 
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accessLogs, setAccessLogs] = useState([]); // Sera rempli par la base de données

  // Codes valides (On pourrait aussi les mettre en base de données plus tard)
  const validCodes = {
    'ADMIN99': { role: 'Admin', name: 'Directeur Général' },
    'CHEF01':  { role: 'Chef de Chantier', name: 'Kouassi Yves' },
    'OUVR01':  { role: 'Ouvrier', name: 'Traoré Moussa' },
    'CLIENT01':{ role: 'Client', name: 'M. Diop' },
  };

  // --- 1. LE "TUYAU" TEMPS RÉEL (useEffect) ---
  // Ce code s'active au chargement et écoute la base de données en permanence
  useEffect(() => {
    // On cible la collection "logs" dans la base de données
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    
    // onSnapshot = Écouteur en temps réel
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // À chaque changement (ajout/suppression), on met à jour la liste locale
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccessLogs(logsData);
    });

    return () => unsubscribe(); // Coupe l'écoute quand on quitte la page
  }, []);

  // --- 2. FONCTION DE POINTAGE (Envoi vers Firebase) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanCode = inputCode.toUpperCase().trim();
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    if (cleanCode === 'ADMIN99') {
      setView('admin');
      setError('');
      return;
    }

    if (validCodes[cleanCode]) {
      const user = validCodes[cleanCode];
      setSuccess(`Bienvenue ${user.name}. Enregistrement en cours...`);
      setError('');

      try {
        // --- C'est ici qu'on écrit dans le CLOUD ---
        await addDoc(collection(db, "logs"), {
          code: cleanCode,
          name: user.name,
          role: user.role,
          status: 'Succès',
          type: 'Pointage',
          displayDate: dateString,
          timestamp: serverTimestamp() // Heure serveur infalsifiable
        });
        // -------------------------------------------
        setSuccess(`Accès confirmé pour ${user.name}`);
      } catch (err) {
        console.error("Erreur Firebase:", err);
        setError("Erreur de connexion internet.");
      }

    } else {
      setError("Code inconnu.");
      setSuccess('');
      // On enregistre aussi les échecs dans la base !
      try {
        await addDoc(collection(db, "logs"), {
          code: cleanCode,
          name: 'Inconnu',
          role: 'N/A',
          status: 'Échec',
          type: 'Tentative Intrusion',
          displayDate: dateString,
          timestamp: serverTimestamp()
        });
      } catch (err) { console.error(err); }
    }
    
    setInputCode('');
    setTimeout(() => setSuccess(''), 3000);
  };

  // --- 3. EXPORT EXCEL ---
  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Code,Nom,Role,Statut,Type\n"; 

    accessLogs.forEach(log => {
      // On sécurise les champs pour éviter les bugs CSV
      const row = `${log.displayDate},${log.code},${log.name},${log.role},${log.status},${log.type}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "KretanPro_Rapport_Cloud.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ... (Le reste du rendu visuel ne change pas, copiez le rendu de la version précédente) ...
  // Pour ne pas faire un message trop long, je remets juste le début du return
  // Vous pouvez garder exactement le même JSX (HTML) qu'avant pour le return
  
  if (view === 'login') {
      return (
        <section className="py-16 bg-gray-100 flex justify-center items-center" id="acces-pro">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
             {/* ... Code visuel identique à la version précédente ... */}
             <div className="flex justify-center mb-6"><div className="bg-orange-100 p-4 rounded-full"><Lock className="w-8 h-8 text-orange-600" /></div></div>
             <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Espace Contrôle Cloud</h2>
             
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="CODE..." value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full text-center text-2xl border-2 border-gray-300 rounded-lg p-3 uppercase" />
                <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2"><LogIn size={20} /> Valider</button>
             </form>

             {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"><AlertTriangle size={18} /> {error}</div>}
             {success && <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"><CheckCircle size={18} /> {success}</div>}
          </div>
        </section>
      );
  }

  // VUE ADMIN
  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
           <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-orange-500"/> Rapport Cloud (Firebase)</h2>
           <div className="flex gap-4">
             <button onClick={downloadReport} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Download size={18} /> CSV</button>
             <button onClick={() => setView('login')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Déconnexion</button>
           </div>
        </div>

        {/* Tableau des Logs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold">
                <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Code</th><th className="px-6 py-4">Nom</th><th className="px-6 py-4">Statut</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono">{log.displayDate}</td>
                    <td className="px-6 py-4 font-bold">{log.code}</td>
                    <td className="px-6 py-4">{log.name}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${log.status === 'Succès' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </section>
  );
};

export default AccessControl;
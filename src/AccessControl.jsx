import React, { useState, useEffect } from 'react';
import { Lock, LogIn, Users, Trash2, PlusCircle, Brain, Layout, Megaphone, Save, Facebook, Youtube, Linkedin, Instagram, Download, Upload} from 'lucide-react';

import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import { db} from './firebase'; // Ajoutez 'storage' ici
// Ajoutez ces fonctions de stockage 👇
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 



const AccessControl = () => {
  const [view, setView] = useState('login'); // 'login', 'dashboard', 'users', 'ai', 'website'
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  // --- DONNÉES ---
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publicTeam, setPublicTeam] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', quote: '', imageUrl: '' });
  
  const [imageFile, setImageFile] = useState(null); // Le fichier sélectionné
  const [isUploading, setIsUploading] = useState(false); // Pour le sablier
  // Données Site Web
  const [promoData, setPromoData] = useState({ title: '', desc: '', discount: '', active: false, imageUrl: '', topBanner: '' });
  
  // CORRECTION : On initialise bien toutes les clés ici
  const [socialLinks, setSocialLinks] = useState({ facebook: '', youtube: '', linkedin: '', instagram: '' });

  // --- FORMULAIRES ---
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '' });
  const [newRule, setNewRule] = useState({ keywords: '', response: '' });
  const [newProject, setNewProject] = useState({ title: '', type: 'Construction', imageUrl: '' });

  const MASTER_KEY = "KRETAN2026"; 

  // --- 1. CHARGEMENT COMPLET ---
  useEffect(() => {
    // A. Logs
    const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snap) => setAccessLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qTeam = query(collection(db, "public_team"), orderBy("createdAt", "desc"));
    const unsubTeam = onSnapshot(qTeam, (snap) => setPublicTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // B. Employés
    const qUsers = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubUsers = onSnapshot(qUsers, (snap) => setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // C. Cerveau IA
    const qBrain = query(collection(db, "chatbot_knowledge"), orderBy("createdAt", "desc"));
    const unsubBrain = onSnapshot(qBrain, (snap) => setKnowledge(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // D. Chantiers
    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubProjects = onSnapshot(qProjects, (snap) => setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    // E. Promo
    const loadPromo = async () => {
        try {
            const docRef = doc(db, "content", "promo_main");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setPromoData(docSnap.data());
        } catch (e) { console.error("Erreur promo", e); }
    };

    // F. Réseaux Sociaux (AVEC CORRECTION DE FUSION)
    const loadSocials = async () => {
        try {
            const docRef = doc(db, "content", "social_links");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // IMPORTANT : On fusionne avec les valeurs par défaut pour ne pas perdre les champs vides
                const data = docSnap.data();
                setSocialLinks(prev => ({
                    facebook: data.facebook || '',
                    youtube: data.youtube || '',
                    linkedin: data.linkedin || '',
                    instagram: data.instagram || ''
                }));
            }
        } catch (e) { console.error("Erreur social", e); }
    };

    loadPromo();
    loadSocials();

    return () => { unsubLogs(); unsubUsers(); unsubBrain(); unsubProjects(); };
  }, []);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

// Fonction pour envoyer l'image sur le Cloud
  // Fonction pour envoyer l'image sur CLOUDINARY (Gratuit & Sans CB)
  const uploadImage = async (file) => {
    if (!file) return null;
    
    // Configuration
    const cloudName = "dsrjqutzc"; // ex: kretanpro
    const uploadPreset = "my4mitws"; // ex: ml_default (celui en mode Unsigned)

    // Préparation des données
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);
    try {
      // Envoi vers Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      setIsUploading(false);
      
      if (data.secure_url) {
          return data.secure_url; // On récupère le lien https://...
      } else {
          alert("Erreur Cloudinary : " + data.error?.message);
          return null;
      }

    } catch (error) {
      console.error("Erreur upload:", error);
      setIsUploading(false);
      alert("Erreur de connexion lors de l'envoi");
      return null;
    }
  };

  // --- 2. ACTIONS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const codeEntree = inputCode.toUpperCase().trim(); // Nettoyage du code
    console.log("Tentative de connexion avec :", codeEntree);

    // 1. CAS DU MASTER KEY (Passe-partout)
    if (codeEntree === MASTER_KEY) {
      alert("🔓 Code Maître accepté ! Bienvenue Administrateur.");
      setView('dashboard');
      return;
    }

    // 2. RECHERCHE DE L'EMPLOYÉ
    const foundUser = employees.find(emp => emp.code === codeEntree);
    
    if (foundUser) {
        // Enregistrement du pointage dans la base de données
        try {
            await addDoc(collection(db, "logs"), { 
                code: foundUser.code, 
                name: foundUser.name, 
                role: foundUser.role, 
                status: 'Succès', 
                displayDate: new Date().toLocaleString(), 
                timestamp: serverTimestamp() 
            });
            console.log("Pointage enregistré pour :", foundUser.name);
        } catch (error) {
            console.error("Erreur d'enregistrement log :", error);
        }

        // FEEDBACK VISUEL (Message Vert)
        setFeedback({ type: 'success', msg: `✅ Bonjour ${foundUser.name}. Pointage validé à ${new Date().toLocaleTimeString()} !` });

        // DÉLAI POUR LIRE LE MESSAGE
        setTimeout(() => {
             // 3. VÉRIFICATION DES DROITS ADMIN
             if(['Admin', 'Directeur'].includes(foundUser.role)) {
                 // On utilise 'confirm' qui bloque l'écran pour être sûr que l'admin le voit
                 if(window.confirm(`Bonjour ${foundUser.name} (Admin).\nVoulez-vous ouvrir le CMS de gestion du site ?`)) {
                     setView('dashboard');
                 } else {
                     // S'il dit Non, on vide juste le champ pour le suivant
                     setInputCode('');
                     setFeedback({ type: '', msg: '' });
                 }
             } else {
                 // C'est un ouvrier -> On vide juste après 3 secondes
                 setTimeout(() => {
                    setInputCode('');
                    setFeedback({ type: '', msg: '' });
                 }, 3000);
             }
        }, 500); // Petit délai de 0.5s pour que l'interface soit fluide

    } else {
        // CODE INCONNU
        showFeedback('error', "⛔ Code inconnu. Réessayez.");
        // On enregistre quand même l'échec (sécurité)
        addDoc(collection(db, "logs"), { code: codeEntree, name: 'Inconnu', role: '?', status: 'Échec', displayDate: new Date().toLocaleString(), timestamp: serverTimestamp() });
    }
  };
  const handleDelete = async (col, id) => { if (window.confirm("Supprimer ?")) await deleteDoc(doc(db, col, id)); };

// Ajouter un membre sur le site public
  const handleAddPublicTeam = async (e) => {
    e.preventDefault();
    if(!newTeamMember.name) return alert("Le nom est obligatoire");

    let finalImageUrl = newTeamMember.imageUrl; // Par défaut, on garde le lien texte s'il y en a un

    // Si un fichier local a été choisi, on l'upload d'abord
    if (imageFile) {
        const url = await uploadImage(imageFile);
        if (url) finalImageUrl = url;
    }

    await addDoc(collection(db, "public_team"), { 
        ...newTeamMember, 
        imageUrl: finalImageUrl, // On utilise le nouveau lien
        createdAt: serverTimestamp() 
    });

    // Reset du formulaire
    setNewTeamMember({ name: '', role: '', quote: '', imageUrl: '' });
    setImageFile(null); // On vide le fichier
  };

  // Ajouts
  const handleAddEmployee = async (e) => { e.preventDefault(); await addDoc(collection(db, "users"), { ...newEmp, code: newEmp.code.toUpperCase() }); setNewEmp({name:'', role:'Ouvrier', code:''}); };
  const handleAddRule = async (e) => { e.preventDefault(); await addDoc(collection(db, "chatbot_knowledge"), { keywords: newRule.keywords.toLowerCase(), response: newRule.response, createdAt: serverTimestamp() }); setNewRule({keywords:'', response:''}); };
  const handleAddProject = async (e) => { e.preventDefault(); await addDoc(collection(db, "projects"), { ...newProject, createdAt: serverTimestamp() }); setNewProject({title:'', type:'Construction', imageUrl:''}); };
  
  // Mises à jour Site
  const handleUpdatePromo = async (e) => { e.preventDefault(); await setDoc(doc(db, "content", "promo_main"), promoData); alert("Promo mise à jour !"); };
  const handleUpdateSocials = async (e) => { e.preventDefault(); await setDoc(doc(db, "content", "social_links"), socialLinks); alert("Réseaux sociaux mis à jour !"); };

  // Export
  const downloadReport = () => { /* Code export CSV simplifié */ alert("Téléchargement..."); };

  // === RENDU ===
  if (view === 'login') {
    return (
      <section className="py-20 bg-gray-100 flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">KréTan CMS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="CODE D'ACCÈS" className="w-full border-2 p-3 rounded text-center text-xl uppercase" value={inputCode} onChange={e=>setInputCode(e.target.value)} />
                <button className="w-full bg-orange-500 text-white font-bold py-3 rounded">Connexion</button>
            </form>
            {feedback.msg && <p className={`mt-4 text-center font-bold ${feedback.type==='success'?'text-green-600':'text-red-600'}`}>{feedback.msg}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">KréTan Admin</h1>
          <button onClick={() => setView('login')} className="bg-gray-200 px-4 py-2 rounded font-bold">Quitter</button>
        </div>

        {/* Menu */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-full font-bold ${view === 'dashboard' ? 'bg-orange-500 text-white' : 'bg-white'}`}>📊 Logs</button>
          <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full font-bold ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-white'}`}>👥 Équipe</button>
          <button onClick={() => setView('ai')} className={`px-4 py-2 rounded-full font-bold ${view === 'ai' ? 'bg-purple-600 text-white' : 'bg-white'}`}>🧠 IA</button>
          <button onClick={() => setView('website')} className={`px-4 py-2 rounded-full font-bold ${view === 'website' ? 'bg-teal-600 text-white' : 'bg-white'}`}>🖥️ Site Web</button>
        </div>

        {/* VUES */}
        {view === 'dashboard' && <div className="bg-white p-6 rounded shadow"><h3 className="font-bold mb-4">Journal des accès</h3><div className="max-h-96 overflow-auto">{accessLogs.map(l=><div key={l.id} className="border-b p-2 flex justify-between"><span>{l.displayDate} - {l.name}</span><span className={l.status==='Succès'?'text-green-600':'text-red-600'}>{l.status}</span></div>)}</div></div>}
        
      {/* --- VUE 2: PERSONNEL (Corrigée avec Menu Déroulant) --- */}
        {view === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Formulaire d'ajout (À Gauche) */}
            <div className="bg-white p-6 rounded-xl shadow h-fit border-t-4 border-blue-500">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
                <PlusCircle size={20}/> Nouvel Employé
              </h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                
                {/* Nom */}
                <div>
                  <label className="text-xs font-bold text-gray-500">Nom Complet</label>
                  <input 
                    className="w-full border p-2 rounded" 
                    value={newEmp.name} 
                    onChange={e => setNewEmp({...newEmp, name: e.target.value})} 
                    placeholder="Ex: Kouassi Jean" 
                  />
                </div>

                {/* Menu Déroulant Rôle (Le retour !) */}
                <div>
                  <label className="text-xs font-bold text-gray-500">Rôle / Poste</label>
                  <select 
                    className="w-full border p-2 rounded bg-white" 
                    value={newEmp.role} 
                    onChange={e => setNewEmp({...newEmp, role: e.target.value})}
                  >
                    <option value="Ouvrier">Ouvrier</option>
                    <option value="Chef de Chantier">Chef de Chantier</option>
                    <option value="Admin">Admin (Accès CMS)</option>
                    <option value="Directeur">Directeur</option>
                    <option value="Stagiaire">Stagiaire</option>
                    <option value="Secrétaire">Secrétaire</option>
                  </select>
                </div>

                {/* Code d'accès */}
                <div>
                  <label className="text-xs font-bold text-gray-500">Code d'accès</label>
                  <input 
                    className="w-full border p-2 rounded uppercase font-mono text-center tracking-widest" 
                    value={newEmp.code} 
                    onChange={e => setNewEmp({...newEmp, code: e.target.value})} 
                    placeholder="Ex: A123" 
                    maxLength={6}
                  />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-md">
                  Enregistrer
                </button>
              </form>
            </div>

            {/* Liste du personnel (À Droite) */}
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
                       <th className="p-3">Code</th>
                       <th className="p-3 rounded-tr-lg text-center">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {employees.map(emp => (
                       <tr key={emp.id} className="hover:bg-blue-50 transition">
                         <td className="p-3 font-bold text-gray-800">{emp.name}</td>
                         <td className="p-3">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                             emp.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                             emp.role === 'Chef de Chantier' ? 'bg-orange-100 text-orange-700' :
                             'bg-gray-100 text-gray-600'
                           }`}>
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
        )}        
        {view === 'ai' && <div className="bg-white p-6 rounded shadow"><h3 className="font-bold mb-4">Cerveau IA</h3><form onSubmit={handleAddRule} className="flex gap-2 mb-4"><input className="border p-2 rounded" placeholder="Mots clés..." value={newRule.keywords} onChange={e=>setNewRule({...newRule, keywords:e.target.value})}/><input className="border p-2 rounded flex-1" placeholder="Réponse..." value={newRule.response} onChange={e=>setNewRule({...newRule, response:e.target.value})}/><button className="bg-purple-500 text-white px-4 rounded">Apprendre</button></form><div>{knowledge.map(k=><div key={k.id} className="flex justify-between border-b p-2"><span><b>Si:</b> {k.keywords} -> <b>Dire:</b> {k.response}</span><button onClick={()=>handleDelete('chatbot_knowledge', k.id)}><Trash2 size={16} className="text-red-500"/></button></div>)}</div></div>}

        {view === 'website' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. PROMO */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-red-500">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Megaphone className="text-red-500"/> Promo</h3>
                    <form onSubmit={handleUpdatePromo} className="space-y-3">
                        <input className="w-full border p-2 rounded bg-teal-50" placeholder="Bandeau Haut de page..." value={promoData.topBanner||''} onChange={e => setPromoData({...promoData, topBanner: e.target.value})} />
                        <div className="flex items-center gap-2"><input type="checkbox" checked={promoData.active} onChange={e => setPromoData({...promoData, active: e.target.checked})} /><label>Activer Promo</label></div>
                        <input className="w-full border p-2 rounded" placeholder="Titre" value={promoData.title} onChange={e => setPromoData({...promoData, title: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="-XX%" value={promoData.discount} onChange={e => setPromoData({...promoData, discount: e.target.value})} />
                        <textarea className="w-full border p-2 rounded" placeholder="Description" value={promoData.desc} onChange={e => setPromoData({...promoData, desc: e.target.value})} />
                        <input className="w-full border p-2 rounded" placeholder="Image URL" value={promoData.imageUrl} onChange={e => setPromoData({...promoData, imageUrl: e.target.value})} />
                        <button className="w-full bg-red-600 text-white font-bold py-2 rounded">Mettre à jour Promo</button>
                    </form>
                </div>

                {/* 2. CHANTIERS */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-teal-500">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Layout className="text-teal-500"/> Portfolio</h3>
                    <form onSubmit={handleAddProject} className="space-y-3 mb-4">
                        <input className="w-full border p-2 rounded" placeholder="Titre Chantier" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                        <select className="w-full border p-2 rounded" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})}><option>Construction</option><option>Rénovation</option><option>Voirie</option></select>
                        <input className="w-full border p-2 rounded" placeholder="Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                        <button className="w-full bg-teal-600 text-white font-bold py-2 rounded">Ajouter Photo</button>
                    </form>
                    <div className="max-h-40 overflow-y-auto">{projects.map(p=><div key={p.id} className="flex justify-between border-b p-1"><span className="text-sm">{p.title}</span><button onClick={()=>handleDelete('projects', p.id)}><Trash2 size={14} className="text-red-500"/></button></div>)}</div>
                </div>

                {/* 3. RÉSEAUX SOCIAUX (CORRIGÉ & DÉBLOQUÉ) */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-600 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">🌐 Réseaux Sociaux</h3>
                    <form onSubmit={handleUpdateSocials} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500">Facebook</label>
                        <input className="w-full border p-2 rounded" placeholder="https://facebook.com/..." value={socialLinks.facebook || ''} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} /></div>
                        
                        <div><label className="text-xs font-bold text-gray-500">YouTube</label>
                        <input className="w-full border p-2 rounded" placeholder="https://youtube.com/..." value={socialLinks.youtube || ''} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} /></div>
                        
                        <div><label className="text-xs font-bold text-gray-500">LinkedIn</label>
                        <input className="w-full border p-2 rounded" placeholder="https://linkedin.com/..." value={socialLinks.linkedin || ''} onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})} /></div>
                        
                        <div><label className="text-xs font-bold text-gray-500">Instagram</label>
                        <input className="w-full border p-2 rounded" placeholder="https://instagram.com/..." value={socialLinks.instagram || ''} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} /></div>
                        
                        <div className="md:col-span-2"><button className="w-full bg-blue-600 text-white font-bold py-2 rounded">Enregistrer les liens</button></div>
                    </form>
                </div>
                {/* 4. GESTION ÉQUIPE PUBLIQUE (PHOTOS & NOMS) */}
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-purple-600 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">
                        👔 L'Équipe (Visible sur le site)
                    </h3>
                    
                    {/* Formulaire */}
                    {/* Formulaire MODIFIÉ */}
                    <form onSubmit={handleAddPublicTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-purple-50 p-4 rounded-lg">
                        
                        <input className="border p-2 rounded" placeholder="Nom" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} />
                        <input className="border p-2 rounded" placeholder="Poste" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} />
                        
                        {/* 👇 NOUVEAU : CHOIX DU FICHIER */}
                        <div className="md:col-span-2 flex gap-2 items-center">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Choisir une photo locale :</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                                />
                            </div>
                            <span className="text-gray-400 font-bold">OU</span>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Lien direct (URL) :</label>
                                <input 
                                    className="border p-2 rounded w-full" 
                                    placeholder="https://..." 
                                    value={newTeamMember.imageUrl} 
                                    onChange={e => setNewTeamMember({...newTeamMember, imageUrl: e.target.value})} 
                                />
                            </div>
                        </div>

                        <textarea className="border p-2 rounded md:col-span-2" placeholder="Citation..." value={newTeamMember.quote} onChange={e => setNewTeamMember({...newTeamMember, quote: e.target.value})} />
                        
                        <button disabled={isUploading} className="md:col-span-2 bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 flex justify-center items-center gap-2">
                            {isUploading ? "Envoi en cours..." : "Ajouter ce membre"}
                            {!isUploading && <Upload size={18}/>}
                        </button>
                    </form>

                    {/* Liste actuelle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {publicTeam.map(member => (
                            <div key={member.id} className="flex items-center gap-3 border p-2 rounded bg-white shadow-sm">
                                <img src={member.imageUrl || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                <button onClick={() => handleDelete('public_team', member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                            </div>
                        ))}
                        {publicTeam.length === 0 && <p className="text-gray-400 italic text-sm">Aucun membre affiché sur le site.</p>}
                    </div>
                </div>

            </div>
        )}

      </div>
    </section>
  );
};

export default AccessControl;
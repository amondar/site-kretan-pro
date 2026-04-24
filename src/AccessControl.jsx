import React, { useState, useEffect } from 'react';
import { 
  Menu, X , Lock, LogIn, Users, Trash2, PlusCircle, 
  Brain, Layout, Megaphone, Save, Facebook, Youtube, 
  Linkedin, Instagram, Download, Upload,Edit
} from 'lucide-react';

import { 
  collection, addDoc, query, orderBy, onSnapshot, deleteDoc, 
  doc, updateDoc, serverTimestamp, 
  getDoc, getDocs, setDoc, where  // <--- getDocs EST AJOUTÉ ICI
} from 'firebase/firestore';

// AJOUT DE createUserWithEmailAndPassword et secondaryAuth
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, secondaryAuth } from './firebase';


const AccessControl = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [view, setView] = useState('dashboard');
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publicTeam, setPublicTeam] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', quote: '', imageUrl: '' });

  const [editingTeamMemberId, setEditingTeamMemberId] = useState(null); // <--- NOUVELLE LIGNE

  const [currentUserRole, setCurrentUserRole] = useState(null); // <-- NOUVEAU
  // On ajoute "email" dans newEmp
  const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '', email: '' });
  
  const [imageFile, setImageFile] = useState(null); 
  const [projectImageFile, setProjectImageFile] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);

  const [socialLinks, setSocialLinks] = useState({ facebook: '', youtube: '', linkedin: '', instagram: '' });

  //const [newEmp, setNewEmp] = useState({ name: '', role: 'Ouvrier', code: '' });
  const [newRule, setNewRule] = useState({ keywords: '', response: '' });
  const [newProject, setNewProject] = useState({ title: '', type: 'Construction', imageUrl: '', videoUrl: '' });

  const [promoImageFile, setPromoImageFile] = useState(null); 
  const [promo, setPromo] = useState({ 
      active: false, 
      text: '',        
      title: '',       
      discount: '',    
      description: '', 
      bgImage: ''      
  });

  const [letter, setLetter] = useState({ 
      active: false, 
      title: 'Lettre aux Partenaires', 
      content: '', 
      signature: 'La Direction',
      date: new Date().toLocaleDateString()
  });
  
  // ✅ CORRECTION : PROTECTION ANTI-CRASH (PAGE BLANCHE)
  useEffect(() => {
    // Si l'auth n'existe pas, on bloque l'erreur pour ne pas faire de page blanche
    if (!auth) {
        setFeedback({ type: 'error', msg: "Firebase Auth non détecté. Mettez à jour firebase.js." });
        setIsLoadingAuth(false);
        return;
        
    }

   const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // 🔍 CHERCHER LE RÔLE DE L'UTILISATEUR
        try {
            const q = query(collection(db, "users"), where("email", "==", user.email.toLowerCase()));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setCurrentUserRole(querySnapshot.docs[0].data().role);
            } else {
                // Si pas trouvé dans la liste (ex: l'Admin principal d'origine)
                setCurrentUserRole('SuperAdmin'); 
            }
        } catch(e) {
            console.error("Erreur lecture rôle", e);
            setCurrentUserRole('Ouvrier'); // Sécurité
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUserRole(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return; 

    const qLogs = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snap) => setAccessLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qTeam = query(collection(db, "public_team"), orderBy("createdAt", "desc"));
    const unsubTeam = onSnapshot(qTeam, (snap) => setPublicTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qUsers = query(collection(db, "users"), orderBy("name", "asc"));
    const unsubUsers = onSnapshot(qUsers, (snap) => setEmployees(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qBrain = query(collection(db, "chatbot_knowledge"), orderBy("createdAt", "desc"));
    const unsubBrain = onSnapshot(qBrain, (snap) => setKnowledge(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubProjects = onSnapshot(qProjects, (snap) => setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    const loadPromo = async () => {
        try {
            const docSnap = await getDoc(doc(db, "content", "promo"));
            if (docSnap.exists()) {
                setPromo(docSnap.data());
            }
        } catch (e) { console.log("Création de la promo par défaut..."); }
    };
    loadPromo();

    const loadLetter = async () => {
        try {
            const docSnap = await getDoc(doc(db, "content", "open_letter"));
            if (docSnap.exists()) setLetter(docSnap.data());
        } catch (e) { console.log("Pas de lettre encore"); }
    };
    loadLetter();

    const loadSocials = async () => {
        try {
            const docRef = doc(db, "content", "social_links");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
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
    loadSocials();

    return () => { unsubLogs(); unsubUsers(); unsubBrain(); unsubProjects(); unsubTeam(); };
  }, [isAuthenticated]); 

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const cloudName = "dsrjqutzc"; 
    const uploadPreset = "my4mitws"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setIsUploading(false);
      
      if (data.secure_url) {
          return data.secure_url; 
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!auth) return showFeedback('error', "Impossible. Firebase Auth n'est pas configuré.");

    // Formatage de la date et l'heure pour le journal
    const now = new Date();
    const displayDate = now.toLocaleString('fr-FR');

    try {
      // 1. On connecte l'utilisateur
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email.toLowerCase();

      // 2. On cherche son vrai Nom dans la base de données pour l'afficher joliment
      let userName = "Admin / " + userEmail; // Nom par défaut s'il n'est pas dans la liste
      try {
          const q = query(collection(db, "users"), where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
              userName = querySnapshot.docs[0].data().name; // On récupère "Kouassi Jean"
          }
      } catch(err) { console.error("Erreur lecture nom", err); }

      // 3. ON ÉCRIT LE LOG DE SUCCÈS DANS FIREBASE
      await addDoc(collection(db, "logs"), {
          name: userName,
          status: 'Succès',
          displayDate: displayDate,
          timestamp: serverTimestamp()
      });

      showFeedback('success', 'Connexion réussie.');
      setEmail('');
      setPassword('');
      setView('dashboard');

    } catch (error) {
      console.error(error);
      
      // 4. ON ÉCRIT LE LOG D'ÉCHEC EN CAS DE MAUVAIS MOT DE PASSE
      await addDoc(collection(db, "logs"), {
          name: email || "Inconnu",
          status: 'Échec',
          displayDate: displayDate,
          timestamp: serverTimestamp()
      });

      showFeedback('error', 'Identifiants incorrects ou accès refusé.');
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('dashboard');
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  const handleDelete = async (col, id) => { if (window.confirm("Supprimer ?")) await deleteDoc(doc(db, col, id)); };

  const handleAddPublicTeam = async (e) => {
    e.preventDefault();
    if(!newTeamMember.name) return alert("Le nom est obligatoire");

    let finalImageUrl = newTeamMember.imageUrl; 

    if (imageFile) {
        const url = await uploadImage(imageFile);
        if (url) finalImageUrl = url;
    }

    if (editingTeamMemberId) {
        // MODE MODIFICATION : On met à jour le document existant
        await updateDoc(doc(db, "public_team", editingTeamMemberId), {
            ...newTeamMember,
            imageUrl: finalImageUrl,
            updatedAt: serverTimestamp()
        });
        showFeedback('success', "Membre mis à jour avec succès !");
    } else {
        // MODE CRÉATION : On ajoute un nouveau document
        await addDoc(collection(db, "public_team"), { 
            ...newTeamMember, 
            imageUrl: finalImageUrl, 
            createdAt: serverTimestamp() 
        });
        showFeedback('success', "Nouveau membre ajouté !");
    }

    // On remet le formulaire à zéro
    setNewTeamMember({ name: '', role: '', quote: '', imageUrl: '' });
    setEditingTeamMemberId(null);
    setImageFile(null); 
  };

  // NOUVELLE FONCTION : Quand on clique sur le bouton Modifier
  const handleEditTeamMember = (member) => {
      setNewTeamMember({
          name: member.name || '',
          role: member.role || '',
          quote: member.quote || '',
          imageUrl: member.imageUrl || ''
      });
      setEditingTeamMemberId(member.id);
      setImageFile(null);
  };

  // NOUVELLE FONCTION : Pour annuler une modification en cours
  const cancelEditTeamMember = () => {
      setNewTeamMember({ name: '', role: '', quote: '', imageUrl: '' });
      setEditingTeamMemberId(null);
      setImageFile(null);
  };

  const handleAddEmployee = async (e) => { 
      e.preventDefault(); 
      if(newEmp.code.length < 6) return alert("Le code doit faire au moins 6 caractères (Requis par Firebase).");
      
      setIsUploading(true); // On utilise cet état pour afficher un chargement
      try {
          // 1. Création silencieuse dans Auth (Ne déconnecte pas l'admin)
          await createUserWithEmailAndPassword(secondaryAuth, newEmp.email, newEmp.code.toUpperCase());

          // 2. Sauvegarde du profil dans Firestore
          await addDoc(collection(db, "users"), { 
              name: newEmp.name, 
              role: newEmp.role, 
              code: newEmp.code.toUpperCase(),
              email: newEmp.email.toLowerCase()
          }); 

          showFeedback('success', "Employé ajouté et compte créé avec succès !");
          setNewEmp({name:'', role:'Ouvrier', code:'', email:''}); 
      } catch(error) {
          console.error(error);
          alert("Erreur : Cet email est peut-être déjà utilisé.");
      }
      setIsUploading(false);
  }; 
  
  const handleAddRule = async (e) => { e.preventDefault(); await addDoc(collection(db, "chatbot_knowledge"), { keywords: newRule.keywords.toLowerCase(), response: newRule.response, createdAt: serverTimestamp() }); setNewRule({keywords:'', response:''}); };
  
  const handleAddProject = async (e) => {
    e.preventDefault();
    let finalImageUrl = newProject.imageUrl;

    if (!newProject.videoUrl && projectImageFile) {
        const url = await uploadImage(projectImageFile);
        if (url) finalImageUrl = url;
    }

    await addDoc(collection(db, "projects"), { 
        ...newProject, 
        imageUrl: finalImageUrl, 
        createdAt: serverTimestamp() 
    });

    setNewProject({ title: '', type: 'Gros Œuvre', imageUrl: '', videoUrl: '' });
    setProjectImageFile(null);
  };
  
  const handleUpdatePromo = async (e) => {
    e.preventDefault();
    let finalImageUrl = promo.bgImage || ""; 

    if (promoImageFile) {
        const url = await uploadImage(promoImageFile); 
        if (url) finalImageUrl = url;
    }

    try {
        await setDoc(doc(db, "content", "promo"), { 
            ...promo, 
            bgImage: finalImageUrl 
        }, { merge: true });
        
        alert("✅ Promotion mise à jour avec succès !");
        setPromoImageFile(null); 
    } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la sauvegarde.");
    }
  };
  
  const handleUpdateSocials = async (e) => { e.preventDefault(); await setDoc(doc(db, "content", "social_links"), socialLinks); alert("Réseaux sociaux mis à jour !"); };

  const handleSaveLetter = async (e) => {
    e.preventDefault();
    try {
        await setDoc(doc(db, "content", "open_letter"), letter); 
        alert("📜 Lettre ouverte publiée/mise à jour !");
    } catch (error) {
        console.error(error);
        alert("Erreur sauvegarde lettre");
    }
  };

  if (isLoadingAuth) {
     return <div className="min-h-[400px] bg-white flex items-center justify-center rounded-xl"><p className="text-xl font-bold animate-pulse text-gray-500">Vérification de la sécurité...</p></div>;
  }

  if (!isAuthenticated) {
    return (
      <section className="py-20 bg-gray-100 flex justify-center items-center min-h-[500px] rounded-xl">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">KréTan CMS</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Adresse E-mail" 
                  className="w-full border-2 p-3 rounded text-center text-lg" 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  required
                />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  className="w-full border-2 p-3 rounded text-center text-lg" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required
                />
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded transition-colors">
                   Connexion Administrateur
                </button>
            </form>
            {feedback.msg && <p className={`mt-4 text-center font-bold ${feedback.type==='success'?'text-green-600':'text-red-600'}`}>{feedback.msg}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">KréTan Admin</h1>
          <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded font-bold transition-colors">Déconnexion</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-full font-bold ${view === 'dashboard' ? 'bg-orange-500 text-white' : 'bg-white shadow-sm hover:bg-gray-50'}`}>📊 Tableau de bord</button>
          
          {/* RESTRICTION : Seuls les Admins voient ces boutons */}
{currentUserRole && (currentUserRole.toLowerCase() === 'superadmin' || currentUserRole.toLowerCase() === 'admin' || currentUserRole.toLowerCase() === 'directeur') && (
      <>
          <button onClick={() => setView('users')} className={`px-4 py-2 rounded-full font-bold ${view === 'users' ? 'bg-blue-600 text-white' : 'bg-white shadow-sm hover:bg-gray-50'}`}>👥 Équipe</button>
                  <button onClick={() => setView('ai')} className={`px-4 py-2 rounded-full font-bold ${view === 'ai' ? 'bg-purple-600 text-white' : 'bg-white shadow-sm hover:bg-gray-50'}`}>🧠 IA</button>
                  <button onClick={() => setView('website')} className={`px-4 py-2 rounded-full font-bold ${view === 'website' ? 'bg-teal-600 text-white' : 'bg-white shadow-sm hover:bg-gray-50'}`}>🖥️ Site Web</button>
              </>
          )}
        </div>

        {view === 'dashboard' && <div className="bg-white p-6 rounded shadow"><h3 className="font-bold mb-4">Journal des accès</h3><div className="max-h-96 overflow-auto">{accessLogs.map(l=><div key={l.id} className="border-b p-2 flex justify-between"><span>{l.displayDate} - {l.name}</span><span className={l.status==='Succès'?'text-green-600':'text-red-600'}>{l.status}</span></div>)}</div></div>}
        
        {view === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow h-fit border-t-4 border-blue-500">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800"><PlusCircle size={20}/> Nouvel Employé</h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div><label className="text-xs font-bold text-gray-500">Nom Complet</label><input required className="w-full border p-2 rounded" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Ex: Kouassi Jean" /></div>
                
                {/* NOUVEAU CHAMP EMAIL */}
                <div><label className="text-xs font-bold text-gray-500">Email de connexion</label><input type="email" required className="w-full border p-2 rounded" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="Ex: jean@kretanpro.ci" /></div>

                <div>
                  <label className="text-xs font-bold text-gray-500">Rôle / Poste</label>
                  <select className="w-full border p-2 rounded bg-white" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                    <option value="Ouvrier">Ouvrier</option>
                    <option value="Chef de Chantier">Chef de Chantier</option>
                    <option value="Admin">Admin (Accès CMS Complet)</option>
                    <option value="Directeur">Directeur</option>
                  </select>
                </div>
                <div><label className="text-xs font-bold text-gray-500">Code (Mot de passe) - Min 6 caractères</label><input required className="w-full border p-2 rounded uppercase font-mono text-center tracking-widest" value={newEmp.code} onChange={e => setNewEmp({...newEmp, code: e.target.value})} placeholder="Ex: A12345" minLength={6} maxLength={10}/></div>
                <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow-md">{isUploading ? 'Création...' : 'Enregistrer'}</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border-t-4 border-gray-200">
               <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-700">Liste du personnel ({employees.length})</h3></div>
               <div className="overflow-auto max-h-[500px]">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-100 text-gray-600 font-bold text-left sticky top-0">
                     <tr><th className="p-3 rounded-tl-lg">Nom</th><th className="p-3">Rôle</th><th className="p-3">Code interne</th><th className="p-3 rounded-tr-lg text-center">Action</th></tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {employees.map(emp => (
                       <tr key={emp.id} className="hover:bg-blue-50 transition">
                         <td className="p-3 font-bold text-gray-800">{emp.name}</td>
                         <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.role === 'Admin' ? 'bg-purple-100 text-purple-700' : emp.role === 'Chef de Chantier' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{emp.role}</span></td>
                         <td className="p-3 font-mono text-gray-500">{emp.code}</td>
                         <td className="p-3 text-center"><button onClick={() => handleDelete('users', emp.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full hover:bg-red-100 transition"><Trash2 size={16}/></button></td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {employees.length === 0 && <p className="text-center text-gray-400 py-8 italic">Aucun employé enregistré.</p>}
               </div>
            </div>
          </div>
        )}        
        {view === 'ai' && <div className="bg-white p-6 rounded shadow"><h3 className="font-bold mb-4">Cerveau IA</h3><form onSubmit={handleAddRule} className="flex gap-2 mb-4"><input className="border p-2 rounded" placeholder="Mots clés..." value={newRule.keywords} onChange={e=>setNewRule({...newRule, keywords:e.target.value})}/><input className="border p-2 rounded flex-1" placeholder="Réponse..." value={newRule.response} onChange={e=>setNewRule({...newRule, response:e.target.value})}/><button className="bg-purple-500 text-white px-4 rounded">Apprendre</button></form><div>{knowledge.map(k=><div key={k.id} className="flex justify-between border-b p-2"><span><b>Si:</b> {k.keywords} {'->'} <b>Dire:</b> {k.response}</span><button onClick={()=>handleDelete('chatbot_knowledge', k.id)}><Trash2 size={16} className="text-red-500"/></button></div>)}</div></div>}

        {view === 'website' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-orange-800">📢 Gestion de la Promotion</h3>
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border">
                             <span className="text-sm font-bold text-gray-700">Activer la Promo :</span>
                             <button type="button" onClick={() => setPromo({...promo, active: !promo.active})} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${promo?.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${promo?.active ? 'translate-x-6' : ''}`} />
                             </button>
                        </div>
                    </div>
                    <form onSubmit={handleUpdatePromo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 bg-green-50 p-3 rounded border border-green-200">
                            <label className="block text-xs font-bold text-green-800 mb-1">🟢 Texte du Bandeau (Tout en haut du site) :</label>
                            <input className="border p-2 rounded w-full text-sm" placeholder="Ex: Livraison gratuite jusqu'à ce soir..." value={promo?.text || ''} onChange={e => setPromo({...promo, text: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 mb-1">Titre Principal :</label>
                            <input className="border p-2 rounded w-full" placeholder="Ex: Grande Promo Tabaski" value={promo?.title || ''} onChange={e => setPromo({...promo, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Réduction (-XX%) :</label>
                            <input className="border p-2 rounded w-full" placeholder="-20%" value={promo?.discount || ''} onChange={e => setPromo({...promo, discount: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 mb-1">Description détaillée :</label>
                            <textarea className="border p-2 rounded w-full h-20" placeholder="Ex: Valable sur tous les travaux..." value={promo?.description || ''} onChange={e => setPromo({...promo, description: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center mt-2 pt-4 border-t border-dashed border-gray-300">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-orange-600 mb-1">📸 Photo depuis l'ordi :</label>
                                <input type="file" accept="image/*" onChange={(e) => setPromoImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer" />
                            </div>
                            <span className="text-gray-400 font-bold">OU</span>
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold text-gray-600 mb-1">🌐 Lien URL (Internet) :</label>
                                <input className="border p-2 rounded w-full text-sm bg-gray-50" placeholder="https://..." value={promo?.bgImage || ''} onChange={e => setPromo({...promo, bgImage: e.target.value})} />
                            </div>
                        </div>
                        <button disabled={isUploading} className="md:col-span-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 flex justify-center items-center gap-2 mt-4 shadow-md">
                             {isUploading ? "Envoi en cours..." : "Sauvegarder la Promotion"}
                             {!isUploading && <Upload size={18}/>}
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-gray-800 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">📜 Lettre Ouverte / Mot du DG</h3>
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border">
                             <span className="text-sm font-bold text-gray-700">Publier :</span>
                             <button type="button" onClick={() => setLetter({...letter, active: !letter.active})} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${letter.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${letter.active ? 'translate-x-6' : ''}`} />
                             </button>
                        </div>
                    </div>
                    <form onSubmit={handleSaveLetter} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Titre / Objet :</label><input className="w-full border p-2 rounded" value={letter.title} onChange={e => setLetter({...letter, title: e.target.value})} placeholder="Ex: Message à nos partenaires" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Date d'affichage :</label><input className="w-full border p-2 rounded" value={letter.date} onChange={e => setLetter({...letter, date: e.target.value})} /></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Corps de la lettre :</label><textarea className="w-full border p-4 rounded h-40 font-serif text-gray-700 leading-relaxed bg-gray-50" placeholder="Chers partenaires..." value={letter.content} onChange={e => setLetter({...letter, content: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Signature :</label><input className="w-full border p-2 rounded font-bold text-gray-700" value={letter.signature} onChange={e => setLetter({...letter, signature: e.target.value})} placeholder="La Direction KréTan" /></div>
                        <button className="w-full bg-gray-800 text-white font-bold py-3 rounded hover:bg-black transition flex justify-center gap-2">Enregistrer et Publier <Save size={18}/></button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-teal-500">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Layout className="text-teal-500"/> Portfolio</h3>
                    <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-teal-50 p-4 rounded-lg">
                        <input className="border p-2 rounded" placeholder="Titre du projet (ex: Villa Assinie)" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                        <select className="border p-2 rounded" value={newProject.type} onChange={e => setNewProject({...newProject, type: e.target.value})}>
                            <option>Gros Œuvre</option><option>Finition</option><option>Rénovation</option><option>Route / VRD</option>
                        </select>
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-red-600 mb-1 flex items-center gap-1"><Youtube size={14}/> Option Vidéo (Youtube) :</label>
                             <input className="border p-2 rounded w-full border-red-200 bg-red-50 text-sm" placeholder="Collez le lien YouTube ici (ex: https://youtu.be/...)" value={newProject.videoUrl || ''} onChange={e => setNewProject({...newProject, videoUrl: e.target.value})} />
                             <p className="text-[10px] text-gray-500 mt-1 italic">Si vous mettez une vidéo, elle remplacera la photo sur le site.</p>
                        </div>
                        <div className="md:col-span-2 flex gap-2 items-center border-t border-gray-200 pt-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Ou Photo depuis l'ordi :</label>
                                <input type="file" accept="image/*" onChange={(e) => setProjectImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"/>
                            </div>
                        </div>
                        <button disabled={isUploading} className="md:col-span-2 bg-teal-600 text-white font-bold py-2 rounded hover:bg-teal-700 flex justify-center items-center gap-2">
                            {isUploading ? "Envoi..." : "Ajouter ce projet"}
                            {!isUploading && <Upload size={18}/>}
                        </button>
                    </form>
                    <div className="max-h-40 overflow-y-auto">{projects.map(p=><div key={p.id} className="flex justify-between border-b p-1"><span className="text-sm">{p.title}</span><button onClick={()=>handleDelete('projects', p.id)}><Trash2 size={14} className="text-red-500"/></button></div>)}</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-600 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">🌐 Réseaux Sociaux</h3>
                    <form onSubmit={handleUpdateSocials} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500">Facebook</label><input className="w-full border p-2 rounded" placeholder="https://facebook.com/..." value={socialLinks.facebook || ''} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500">YouTube</label><input className="w-full border p-2 rounded" placeholder="https://youtube.com/..." value={socialLinks.youtube || ''} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500">LinkedIn</label><input className="w-full border p-2 rounded" placeholder="https://linkedin.com/..." value={socialLinks.linkedin || ''} onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-gray-500">Instagram</label><input className="w-full border p-2 rounded" placeholder="https://instagram.com/..." value={socialLinks.instagram || ''} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} /></div>
                        <div className="md:col-span-2"><button className="w-full bg-blue-600 text-white font-bold py-2 rounded">Enregistrer les liens</button></div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-purple-600 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">👔 L'Équipe (Visible sur le site)</h3>
                    <form onSubmit={handleAddPublicTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-purple-50 p-4 rounded-lg">
                        <input className="border p-2 rounded" placeholder="Nom" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} />
                        <input className="border p-2 rounded" placeholder="Poste" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} />
                        <div className="md:col-span-2 flex gap-2 items-center">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Choisir une photo locale :</label>
                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
                            </div>
                            <span className="text-gray-400 font-bold">OU</span>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Lien direct (URL) :</label>
                                <input className="border p-2 rounded w-full" placeholder="https://..." value={newTeamMember.imageUrl} onChange={e => setNewTeamMember({...newTeamMember, imageUrl: e.target.value})} />
                            </div>
                        </div>
                        <textarea className="border p-2 rounded md:col-span-2" placeholder="Citation..." value={newTeamMember.quote} onChange={e => setNewTeamMember({...newTeamMember, quote: e.target.value})} />
                        {/* --- LES BOUTONS DU FORMULAIRE ÉQUIPE --- */}
                        <div className="md:col-span-2 flex gap-2">
                            <button disabled={isUploading} type="submit" className="flex-1 bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 flex justify-center items-center gap-2 transition">
                                {isUploading ? "Envoi en cours..." : (editingTeamMemberId ? "Mettre à jour ce membre" : "Ajouter ce membre")}
                                {!isUploading && (editingTeamMemberId ? <Save size={18}/> : <Upload size={18}/>)}
                            </button>
                            
                            {/* Bouton Annuler qui n'apparaît qu'en mode modification */}
                            {editingTeamMemberId && (
                                <button type="button" onClick={cancelEditTeamMember} className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition">
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>

                    {/* --- LA LISTE DES MEMBRES --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {publicTeam.map(member => (
                            <div key={member.id} className={`flex items-center gap-3 border p-2 rounded shadow-sm transition ${editingTeamMemberId === member.id ? 'bg-purple-100 border-purple-400' : 'bg-white'}`}>
                                <img src={member.imageUrl || 'https://via.placeholder.com/50'} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                {/* NOUVEAU : Bouton Éditer (Crayon) */}
                                <button onClick={() => handleEditTeamMember(member)} className="text-blue-500 hover:bg-blue-100 p-2 rounded transition" title="Modifier">
                                    <Edit size={16}/>
                                </button>
                                {/* Ancien Bouton Supprimer */}
                                <button onClick={() => handleDelete('public_team', member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition" title="Supprimer">
                                    <Trash2 size={16}/>
                                </button>
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
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
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword,
    setPersistence,             // <-- À AJOUTER
    browserLocalPersistence     // <-- À AJOUTER
} from 'firebase/auth';

import { db, auth, secondaryAuth } from './firebase';

import AdminProjects from "./admin/AdminProjects";
import AdminTeam from './admin/AdminTeam';
import AdminPromo from './admin/AdminPromo';
import AdminLetters from './admin/AdminLetters';
import AdminSocials from './admin/AdminSocials';
import AdminUsers from './admin/AdminUsers';
import AdminAi from './admin/AdminAi';
import AdminOngoing from './admin/AdminOngoing';
import AdminPartners from './admin/AdminPartners';


const AccessControl = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. On lit la mémoire du navigateur, sinon on va sur 'dashboard' par défaut
  const [view, setView] = useState(() => {
      return localStorage.getItem('kretan_cms_view') || 'dashboard';
  });

  // 2. À chaque fois qu'on change d'onglet, on le sauvegarde dans la mémoire
  useEffect(() => {
      localStorage.setItem('kretan_cms_view', view);
  }, [view]);

  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  
  const [accessLogs, setAccessLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [projects, setProjects] = useState([]);
  const [publicTeam, setPublicTeam] = useState([]);
  
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', quote: '', imageUrl: '', bio: '', cvUrl: '' });
  //const [editingTeamMemberId, setEditingTeamMemberId] = useState(null);
  const [cvFile, setCvFile] = useState(null); // <--- NOUVEAU POUR LE FICHIER PDF

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
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [promosList, setPromosList] = useState([]);
  const [newPromo, setNewPromo] = useState({ text: '', title: '', discount: '', description: '', bgImage: '' });
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [promoImageFile, setPromoImageFile] = useState(null);

// --- NOUVEAUX ÉTATS POUR LA LETTRE OUVERTE MULTIMÉDIA ---
  const [openLetters, setOpenLetters] = useState([]);
  const [newLetter, setNewLetter] = useState({ title: '', content: '', signature: 'La Direction', date: new Date().toLocaleDateString(), imageUrl: '' });
  const [editingLetterId, setEditingLetterId] = useState(null);
  const [letterImageFile, setLetterImageFile] = useState(null);

  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [newOngoing, setNewOngoing] = useState({ title: '', location: '', imageUrl: '', pdfUrl: '' });
  const [ongoingImageFiles, setOngoingImageFiles] = useState([]);
  const [ongoingPdfFile, setOngoingPdfFile] = useState(null);

  const [editingOngoingId, setEditingOngoingId] = useState(null);

  const [partnersList, setPartnersList] = useState([]);
  const [newPartner, setNewPartner] = useState({ name: '', logoUrl: '' });
  const [partnerLogoFile, setPartnerLogoFile] = useState(null);

  const [editingPartnerId, setEditingPartnerId] = useState(null);

  const [editingEmpId, setEditingEmpId] = useState(null);
  const [editingRuleId, setEditingRuleId] = useState(null);
  
  
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

    // Charger l'historique des Promos
    const qPromos = query(collection(db, "promos"), orderBy("createdAt", "desc"));
    const unsubPromos = onSnapshot(qPromos, (snap) => setPromosList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    // N'oubliez pas d'ajouter unsubPromos(); dans le return à la fin de votre useEffect !

// Charger l'historique des lettres ouvertes
    const qLetters = query(collection(db, "open_letters"), orderBy("createdAt", "desc"));
    const unsubLetters = onSnapshot(qLetters, (snap) => setOpenLetters(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));


    const qOngoing = query(collection(db, "ongoing_projects"), orderBy("createdAt", "desc"));
    const unsubOngoing = onSnapshot(qOngoing, (snap) => setOngoingProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
// Pensez à ajouter unsubOngoing() dans le return de nettoyage du useEffect !

    const qPartners = query(collection(db, "partners"), orderBy("name", "asc"));
    const unsubPartners = onSnapshot(qPartners, (snap) => {
    setPartnersList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
// Ajoutez unsubPartners() dans la fonction de nettoyage (return) du useEffect !

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
    

    return () => { unsubLogs(); unsubUsers(); unsubBrain(); unsubProjects(); unsubTeam(); unsubPartners(); unsubPromos(); unsubLetters(); unsubOngoing(); };
  }, [isAuthenticated]); 

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback({ type: '', msg: '' }), 4000);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    // On utilise les variables sécurisées
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
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

    let finalCvUrl = newTeamMember.cvUrl; // <--- NOUVEAU

    let finalImageUrl = newTeamMember.imageUrl; 

    if (imageFile) {
        const url = await uploadImage(imageFile);
        if (url) finalImageUrl = url;
    }

// NOUVEAU : ENVOI DU CV PDF
    if (cvFile) {
        const url = await uploadImage(cvFile);
        if (url) finalCvUrl = url;
    }

    if (editingTeamMemberId) {
        // MODE MODIFICATION : On met à jour le document existant
        await updateDoc(doc(db, "public_team", editingTeamMemberId), {
            ...newTeamMember,
            imageUrl: finalImageUrl,
            cvUrl: finalCvUrl, // <--- NOUVEAU
            updatedAt: serverTimestamp()
        });
        showFeedback('success', "Membre mis à jour avec succès !");
    } else {
        // MODE CRÉATION : On ajoute un nouveau document
        await addDoc(collection(db, "public_team"), { 
            ...newTeamMember, 
            imageUrl: finalImageUrl, 
            cvUrl: finalCvUrl, // <--- NOUVEAU
            createdAt: serverTimestamp() 
        });
        showFeedback('success', "Nouveau membre ajouté !");
    }

    // On remet le formulaire à zéro
    setNewTeamMember({ name: '', role: '', quote: '', imageUrl: '' ,bio: '', cvUrl: '' });
    setEditingTeamMemberId(null);
    setImageFile(null); 
    setCvFile(null);
  };

  // NOUVELLE FONCTION : Quand on clique sur le bouton Modifier
  const handleEditTeamMember = (member) => {
      setNewTeamMember({
          name: member.name || '',
          role: member.role || '',
          quote: member.quote || '',
          imageUrl: member.imageUrl || '',
          bio: member.bio || '', cvUrl: member.cvUrl || ''
      });
      setEditingTeamMemberId(member.id);
      setImageFile(null);
  };

  // NOUVELLE FONCTION : Pour annuler une modification en cours
  const cancelEditTeamMember = () => {
      setNewTeamMember({ name: '', role: '', quote: '', imageUrl: '',bio: '', cvUrl: '' });
      setEditingTeamMemberId(null);
      setImageFile(null);
      setCvFile(null);
  };

  // --- GESTION DES EMPLOYÉS ---
  const handleAddEmployee = async (e) => { 
      if (e && e.preventDefault) e.preventDefault(); 
      if(newEmp.code.length < 6) return showFeedback('error', "Le code doit faire au moins 6 caractères.");
      
      setIsUploading(true);
      try {
          if (editingEmpId) {
              // MODE MODIFICATION : On met à jour le profil Firestore (Note: On ne modifie pas le mot de passe Auth ici pour des raisons de sécurité)
              await updateDoc(doc(db, "users", editingEmpId), {
                  name: newEmp.name, 
                  role: newEmp.role, 
                  code: newEmp.code.toUpperCase(),
                  email: newEmp.email.toLowerCase()
              }); 
              showFeedback('success', "Employé mis à jour avec succès !");
          } else {
              // MODE CRÉATION : On crée dans Auth ET dans Firestore
              await createUserWithEmailAndPassword(secondaryAuth, newEmp.email, newEmp.code.toUpperCase());
              await addDoc(collection(db, "users"), { 
                  name: newEmp.name, 
                  role: newEmp.role, 
                  code: newEmp.code.toUpperCase(),
                  email: newEmp.email.toLowerCase()
              }); 
              showFeedback('success', "Employé ajouté et compte créé avec succès !");
          }
          setNewEmp({name:'', role:'Ouvrier', code:'', email:''}); 
          setEditingEmpId(null);
      } catch(error) {
          console.error(error);
          showFeedback('error', "Erreur : Cet email est peut-être déjà utilisé ou une erreur est survenue.");
      } finally {
          setIsUploading(false);
      }
  }; 

  const handleEditEmployee = (emp) => {
      setNewEmp({ name: emp.name || '', role: emp.role || 'Ouvrier', code: emp.code || '', email: emp.email || '' });
      setEditingEmpId(emp.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- GESTION DU CERVEAU IA ---
  const handleAddRule = async (e) => { 
      if (e && e.preventDefault) e.preventDefault(); 
      if (!newRule.keywords || !newRule.response) return;

      try {
          if (editingRuleId) {
              // MODE MODIFICATION
              await updateDoc(doc(db, "chatbot_knowledge", editingRuleId), { 
                  keywords: newRule.keywords.toLowerCase(), 
                  response: newRule.response 
              });
              showFeedback('success', "Règle mise à jour avec succès !");
          } else {
              // MODE CRÉATION
              await addDoc(collection(db, "chatbot_knowledge"), { 
                  keywords: newRule.keywords.toLowerCase(), 
                  response: newRule.response, 
                  createdAt: serverTimestamp() 
              }); 
              showFeedback('success', "Nouvelle règle apprise !");
          }
          setNewRule({keywords:'', response:''}); 
          setEditingRuleId(null);
      } catch (error) {
          showFeedback('error', "Erreur lors de l'enregistrement de la règle.");
      }
  }; 

  const handleEditRule = (rule) => {
      setNewRule({ keywords: rule.keywords || '', response: rule.response || '' });
      setEditingRuleId(rule.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleAddProject = async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!newProject.title) return showFeedback('error', "Le titre du projet est obligatoire.");

      setIsUploading(true);
      try {
          // On garde l'ancienne image si on est en mode édition et qu'on ne change pas la photo
          let finalImageUrl = newProject.imageUrl || '';

          // Si on upload une nouvelle image (et qu'on n'a pas mis de vidéo à la place)
          if (!newProject.videoUrl && projectImageFile) {
              const url = await uploadImage(projectImageFile);
              if (url) finalImageUrl = url;
          }

          if (editingProjectId) {
              // MODE MODIFICATION
              await updateDoc(doc(db, "projects", editingProjectId), { 
                  ...newProject, 
                  imageUrl: finalImageUrl, 
                  updatedAt: serverTimestamp() 
              });
              showFeedback('success', "Projet mis à jour avec succès !");
          } else {
              // MODE CRÉATION
              await addDoc(collection(db, "projects"), { 
                  ...newProject, 
                  imageUrl: finalImageUrl, 
                  createdAt: serverTimestamp() 
              });
              showFeedback('success', "Nouveau projet ajouté au portfolio !");
          }

          // Nettoyage
          setNewProject({ title: '', type: 'Construction', imageUrl: '', videoUrl: '' });
          setProjectImageFile(null);
          setEditingProjectId(null);
          
      } catch (error) {
          console.error("Erreur:", error);
          showFeedback('error', "Erreur lors de l'enregistrement du projet.");
      } finally {
          setIsUploading(false);
      }
  };

  // NOUVELLE FONCTION : Quand on clique sur le crayon d'un projet
  const handleEditProject = (project) => {
      setNewProject({
          title: project.title || '',
          type: project.type || 'Construction',
          imageUrl: project.imageUrl || '',
          videoUrl: project.videoUrl || ''
      });
      setEditingProjectId(project.id);
      setProjectImageFile(null);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte la page vers le formulaire
  };
  
  // --- NOUVELLES FONCTIONS PROMOTIONS ---
  const handleSavePromo = async (e) => {
      e.preventDefault();
      setIsUploading(true);
      let finalImageUrl = newPromo.bgImage || ""; 

      if (promoImageFile) {
          const url = await uploadImage(promoImageFile); 
          if (url) finalImageUrl = url;
      }

      try {
          if (editingPromoId) {
              await updateDoc(doc(db, "promos", editingPromoId), { 
                  ...newPromo, bgImage: finalImageUrl, updatedAt: serverTimestamp() 
              });
              showFeedback('success', "Promotion mise à jour !");
          } else {
              // Par défaut, une nouvelle promo est inactive
              await addDoc(collection(db, "promos"), { 
                  ...newPromo, bgImage: finalImageUrl, active: false, createdAt: serverTimestamp() 
              });
              showFeedback('success', "Promotion ajoutée aux archives !");
          }
          
          setNewPromo({ text: '', title: '', discount: '', description: '', bgImage: '' });
          setEditingPromoId(null);
          setPromoImageFile(null); 
      } catch (error) {
          console.error("Erreur:", error);
          showFeedback('error', "Erreur lors de la sauvegarde.");
      } finally {
          setIsUploading(false);
      }
  };

  const handleEditPromo = (p) => {
      setNewPromo({
          text: p.text || '', title: p.title || '', discount: p.discount || '', 
          description: p.description || '', bgImage: p.bgImage || ''
      });
      setEditingPromoId(p.id);
      setPromoImageFile(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivatePromo = async (promoId, isCurrentlyActive) => {
      // 1. Si elle est déjà active, on la désactive
      if (isCurrentlyActive) {
          await updateDoc(doc(db, "promos", promoId), { active: false });
          return;
      }
      // 2. Sinon, on désactive d'abord TOUTES les autres promos
      const activePromos = promosList.filter(p => p.active);
      for (const p of activePromos) {
          await updateDoc(doc(db, "promos", p.id), { active: false });
      }
      // 3. Et on active la nouvelle
      await updateDoc(doc(db, "promos", promoId), { active: true });
      showFeedback('success', "La promotion est maintenant en ligne !");
  };
  
  const handleUpdateSocials = async (e) => { e.preventDefault(); await setDoc(doc(db, "content", "social_links"), socialLinks); alert("Réseaux sociaux mis à jour !"); };

  // --- NOUVELLES FONCTIONS LETTRE OUVERTE ---
  const handleSaveOpenLetter = async (e) => {
    e.preventDefault();
    if(!newLetter.title || !newLetter.content) return alert("Le titre et le contenu sont obligatoires.");

    setIsUploading(true);
    let finalImageUrl = newLetter.imageUrl; 
    if (letterImageFile) {
        const url = await uploadImage(letterImageFile);
        if (url) finalImageUrl = url;
    }

    if (editingLetterId) {
        // Mode Mise à jour
        await updateDoc(doc(db, "open_letters", editingLetterId), {
            ...newLetter, imageUrl: finalImageUrl, updatedAt: serverTimestamp()
        });
        showFeedback('success', "Lettre mise à jour avec succès !");
    } else {
        // Mode Création
        await addDoc(collection(db, "open_letters"), { 
            ...newLetter, imageUrl: finalImageUrl, active: false, createdAt: serverTimestamp() 
        });
        showFeedback('success', "Nouvelle lettre sauvegardée dans l'historique !");
    }

    setNewLetter({ title: '', content: '', signature: 'La Direction', date: new Date().toLocaleDateString(), imageUrl: '' });
    setEditingLetterId(null);
    setLetterImageFile(null); 
    setIsUploading(false);
  };

  const handleEditLetter = (lettre) => {
      setNewLetter({
          title: lettre.title || '', content: lettre.content || '', signature: lettre.signature || '', 
          date: lettre.date || '', imageUrl: lettre.imageUrl || ''
      });
      setEditingLetterId(lettre.id);
      setLetterImageFile(null);
  };

  const handleActivateLetter = async (letterId, isCurrentlyActive) => {
      // 1. Si elle est déjà active, on la désactive simplement
      if (isCurrentlyActive) {
          await updateDoc(doc(db, "open_letters", letterId), { active: false });
          return;
      }
      // 2. Sinon, on désactive d'abord toutes les autres lettres
      const activeLetters = openLetters.filter(l => l.active);
      for (const l of activeLetters) {
          await updateDoc(doc(db, "open_letters", l.id), { active: false });
      }
      // 3. Et on active la nouvelle
      await updateDoc(doc(db, "open_letters", letterId), { active: true });
      showFeedback('success', "La lettre est maintenant en ligne sur le site !");
  };

  const handleAddOngoing = async (e) => {
      e.preventDefault();
      setIsUploading(true);
      let uploadedImages = []; 
      let finalPdfUrl = newOngoing.pdfUrl;

      // Upload des nouvelles images s'il y en a
      if (ongoingImageFiles && ongoingImageFiles.length > 0) {
          for (let i = 0; i < ongoingImageFiles.length; i++) {
              const url = await uploadImage(ongoingImageFiles[i]);
              if (url) uploadedImages.push(url);
          }
      }

      if (ongoingPdfFile) {
          const url = await uploadImage(ongoingPdfFile);
          if (url) finalPdfUrl = url;
      }

      // Si on est en mode "Modification" (le crayon a été cliqué)
      if (editingOngoingId) {
          await updateDoc(doc(db, "ongoing_projects", editingOngoingId), {
              title: newOngoing.title,
              location: newOngoing.location,
              // Si on a uploadé de nouvelles images, on remplace. Sinon on garde les anciennes.
              imageUrls: uploadedImages.length > 0 ? uploadedImages : (newOngoing.imageUrls || []),
              pdfUrl: finalPdfUrl,
              updatedAt: serverTimestamp()
          });
          showFeedback('success', "Projet mis à jour avec succès !");
      } else {
          // Mode "Création" (comme avant)
          await addDoc(collection(db, "ongoing_projects"), {
              title: newOngoing.title,
              location: newOngoing.location,
              imageUrls: uploadedImages,
              pdfUrl: finalPdfUrl,
              createdAt: serverTimestamp()
          });
          showFeedback('success', "Projet en cours ajouté !");
      }

      // Nettoyage après sauvegarde
      setNewOngoing({ title: '', location: '', imageUrl: '', imageUrls: [], pdfUrl: '' });
      setOngoingImageFiles([]);
      setOngoingPdfFile(null);
      setEditingOngoingId(null); // On sort du mode édition
      setIsUploading(false);
  };

  // NOUVELLE FONCTION : Quand on clique sur le crayon
  const handleEditOngoing = (proj) => {
      setNewOngoing({
          title: proj.title,
          location: proj.location,
          imageUrls: proj.imageUrls || [],
          pdfUrl: proj.pdfUrl || ''
      });
      setEditingOngoingId(proj.id); // Active le mode modification
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte la page vers le formulaire
  };

  const handleAddPartner = async (e) => {
      if (e && e.preventDefault) e.preventDefault(); 
      if (!newPartner.name || newPartner.name.trim() === '') {
          showFeedback('error', "Veuillez saisir un nom pour le partenaire.");
          return;
      }

      setIsUploading(true);
      try {
          // On garde l'ancien logo si on est en train de modifier et qu'on n'a pas mis de nouveau fichier
          let finalLogoUrl = newPartner.logoUrl || ''; 

          if (partnerLogoFile) {
              const url = await uploadImage(partnerLogoFile);
              if (url) finalLogoUrl = url;
          }

          if (editingPartnerId) {
              // MODE MODIFICATION
              await updateDoc(doc(db, "partners", editingPartnerId), { 
                  name: newPartner.name, 
                  logoUrl: finalLogoUrl 
              });
              showFeedback('success', "Partenaire mis à jour avec succès !");
          } else {
              // MODE CRÉATION
              await addDoc(collection(db, "partners"), { 
                  name: newPartner.name, 
                  logoUrl: finalLogoUrl 
              });
              showFeedback('success', "Partenaire ajouté avec succès !");
          }

          // Nettoyage
          setNewPartner({ name: '', logoUrl: '' });
          setPartnerLogoFile(null);
          setEditingPartnerId(null);
          
      } catch (error) {
          console.error("Erreur:", error);
          showFeedback('error', "Une erreur est survenue lors de l'enregistrement.");
      } finally {
          setIsUploading(false);
      }
  };

  // NOUVELLE FONCTION : Quand on clique sur le crayon
  const handleEditPartner = (partner) => {
      setNewPartner({ name: partner.name, logoUrl: partner.logoUrl || '' });
      setEditingPartnerId(partner.id);
      setPartnerLogoFile(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // On met le CMS en plein écran, par-dessus tout le reste du site (z-50)
    <div className="fixed inset-0 z-50 flex bg-gray-50 h-screen w-screen overflow-hidden font-sans">
      
      {/* --- BARRE LATÉRALE (SIDEBAR) NOIRE ÉLÉGANTE --- */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-6 border-b border-gray-800 bg-gray-950">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-500">
            KréTan Admin
          </h2>
          <p className="text-xs text-gray-500 mt-1">Espace Staff</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-orange-500 text-white font-bold shadow-lg' : 'hover:bg-gray-800 hover:text-white'}`}>
            <Layout size={20}/> Tableau de bord
          </button>
          
          {currentUserRole && (currentUserRole.toLowerCase() === 'superadmin' || currentUserRole.toLowerCase() === 'admin' || currentUserRole.toLowerCase() === 'directeur') && (
            <>
              <button onClick={() => setView('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'users' ? 'bg-blue-600 text-white font-bold shadow-lg' : 'hover:bg-gray-800 hover:text-white'}`}>
                <Users size={20}/> Équipe Interne
              </button>
              <button onClick={() => setView('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'ai' ? 'bg-indigo-600 text-white font-bold shadow-lg' : 'hover:bg-gray-800 hover:text-white'}`}>
                <Brain size={20}/> Cerveau IA
              </button>
              <button onClick={() => setView('website')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'website' ? 'bg-teal-600 text-white font-bold shadow-lg' : 'hover:bg-gray-800 hover:text-white'}`}>
                <Layout size={20}/> Gestion Site Web
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-lg font-bold transition-colors">
            <X size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* --- ZONE CENTRALE (AÉRÉE ET SPACIEUSE) --- */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 relative">
        {/* En-tête mobile (si besoin) */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
            <span className="font-bold">KréTan Admin</span>
            <button onClick={handleLogout} className="text-red-400"><X size={24}/></button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24">
            
            {/* Les messages de succès/erreur */}
            {feedback.msg && (
                <div className={`mb-6 p-4 rounded-lg font-bold shadow-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 'bg-red-100 text-red-800 border-l-4 border-red-500'}`}>
                    {feedback.msg}
                </div>
            )}

            {view === 'dashboard' && <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-xl mb-6 text-gray-800">Journal des accès</h3><div className="max-h-[600px] overflow-auto divide-y">{accessLogs.map(l=><div key={l.id} className="py-3 flex justify-between items-center"><span className="text-gray-600"><span className="font-bold text-gray-900">{l.name}</span> <span className="text-sm ml-2">({l.displayDate})</span></span><span className={`px-3 py-1 rounded-full text-xs font-bold ${l.status==='Succès'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{l.status}</span></div>)}</div></div>}
            
            {view === 'users' && <AdminUsers newEmp={newEmp} setNewEmp={setNewEmp} handleAddEmployee={handleAddEmployee} isUploading={isUploading} employees={employees} handleDelete={handleDelete} editingEmpId={editingEmpId} setEditingEmpId={setEditingEmpId} handleEditEmployee={handleEditEmployee} />}
            
            {view === 'ai' && <AdminAi newRule={newRule} setNewRule={setNewRule} handleAddRule={handleAddRule} knowledge={knowledge} handleDelete={handleDelete} editingRuleId={editingRuleId} setEditingRuleId={setEditingRuleId} handleEditRule={handleEditRule} />}
            {view === 'website' && (
              // Ici, on utilise space-y-12 pour bien espacer les blocs au lieu de les tasser
              <div className="space-y-12">
                <AdminPromo 
                    newPromo={newPromo} 
                    setNewPromo={setNewPromo} 
                    handleSavePromo={handleSavePromo} 
                    setPromoImageFile={setPromoImageFile} 
                    isUploading={isUploading}
                    promosList={promosList}
                    handleEditPromo={handleEditPromo}
                    handleActivatePromo={handleActivatePromo}
                    handleDelete={handleDelete}
                    editingPromoId={editingPromoId}
                    setEditingPromoId={setEditingPromoId}
                />                  
                  {/* C'est ici que viendra le composant AdminPartners ! */}
                  
                  <AdminLetters newLetter={newLetter} setNewLetter={setNewLetter} handleSaveOpenLetter={handleSaveOpenLetter} isUploading={isUploading} setLetterImageFile={setLetterImageFile} editingLetterId={editingLetterId} setEditingLetterId={setEditingLetterId} openLetters={openLetters} handleActivateLetter={handleActivateLetter} handleEditLetter={handleEditLetter} handleDelete={handleDelete} />
                  <AdminPartners 
                    newPartner={newPartner} 
                    setNewPartner={setNewPartner} 
                    setPartnerLogoFile={setPartnerLogoFile} 
                    handleAddPartner={handleAddPartner} 
                    isUploading={isUploading} 
                    partnersList={partnersList} 
                    handleDelete={handleDelete} 
                    editingPartnerId={editingPartnerId}
                    setEditingPartnerId={setEditingPartnerId}
                    handleEditPartner={handleEditPartner}
                  />

                  <AdminProjects 
                    newProject={newProject} 
                    setNewProject={setNewProject} 
                    setProjectImageFile={setProjectImageFile} 
                    handleAddProject={handleAddProject} 
                    isUploading={isUploading} 
                    projects={projects} 
                    handleDelete={handleDelete}
                    editingProjectId={editingProjectId}          // <-- NOUVEAU
                    setEditingProjectId={setEditingProjectId}    // <-- NOUVEAU
                    handleEditProject={handleEditProject}        // <-- NOUVEAU
                     />                  
                <AdminOngoing 
                    newOngoing={newOngoing} 
                    setNewOngoing={setNewOngoing} 
                    handleEditOngoing={handleEditOngoing} 
                    setOngoingImageFile={setOngoingImageFiles} 
                    setOngoingPdfFile={setOngoingPdfFile} 
                    handleAddOngoing={handleAddOngoing} 
                    isUploading={isUploading} 
                    ongoingProjects={ongoingProjects} 
                    handleDelete={handleDelete} 
                />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <AdminSocials socialLinks={socialLinks} setSocialLinks={setSocialLinks} handleUpdateSocials={handleUpdateSocials} />
                  </div>
                  <AdminTeam newTeamMember={newTeamMember} setNewTeamMember={setNewTeamMember} setImageFile={setImageFile} setCvFile={setCvFile} handleAddPublicTeam={handleAddPublicTeam} isUploading={isUploading} editingTeamMemberId={editingTeamMemberId} cancelEditTeamMember={cancelEditTeamMember} publicTeam={publicTeam} handleEditTeamMember={handleEditTeamMember} handleDelete={handleDelete} />
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AccessControl;
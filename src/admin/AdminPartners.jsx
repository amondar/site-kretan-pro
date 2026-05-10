import React from 'react';
import { Briefcase, Upload, Trash2 } from 'lucide-react';

const AdminPartners = ({ 
    newPartner, 
    setNewPartner, 
    setPartnerLogoFile, 
    handleAddPartner, 
    isUploading, 
    partnersList, 
    handleDelete 
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
            <Briefcase className="text-gray-500" /> Partenaires & Confiance
        </h3>
        
        <form onSubmit={handleAddPartner} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom de l'entreprise :</label>
                <input 
                    required 
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none" 
                    placeholder="Ex: Immo-Ivoire" 
                    value={newPartner.name} 
                    onChange={e => setNewPartner({...newPartner, name: e.target.value})} 
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo (PNG/JPG) :</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setPartnerLogoFile(e.target.files[0])} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" 
                />
            </div>

            <button disabled={isUploading} type="submit" className="md:col-span-2 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-black flex justify-center items-center gap-2 transition shadow-md">
                {isUploading ? "Ajout en cours..." : "Ajouter ce partenaire"}
                {!isUploading && <Upload size={18}/>}
            </button>
        </form>

        {/* LISTE DES PARTENAIRES ENREGISTRÉS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partnersList.map(partner => (
                <div key={partner.id} className="border border-gray-100 p-4 rounded-xl flex flex-col items-center justify-center gap-3 bg-white shadow-sm hover:shadow-md transition group relative">
                    <button 
                        onClick={() => handleDelete('partners', partner.id)} 
                        className="absolute top-2 right-2 text-red-300 hover:text-red-500 bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                        <Trash2 size={16}/>
                    </button>
                    {partner.logoUrl ? (
                        <img src={partner.logoUrl} className="h-12 object-contain" alt={partner.name} />
                    ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Briefcase size={20}/>
                        </div>
                    )}
                    <span className="font-bold text-xs text-gray-600 text-center uppercase tracking-wider">
                        {partner.name}
                    </span>
                </div>
            ))}
            {partnersList.length === 0 && <p className="col-span-full text-center text-gray-400 italic py-4">Aucun partenaire enregistré.</p>}
        </div>
    </div>
  );
};

export default AdminPartners;
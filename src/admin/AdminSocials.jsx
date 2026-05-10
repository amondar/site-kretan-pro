import React from 'react';

const AdminSocials = ({ socialLinks, setSocialLinks, handleUpdateSocials }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-600 lg:col-span-2">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
            🌐 Réseaux Sociaux
        </h3>
        <form onSubmit={handleUpdateSocials} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500">Facebook</label>
                <input 
                    className="w-full border p-2 rounded" 
                    placeholder="https://facebook.com/..." 
                    value={socialLinks.facebook || ''} 
                    onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})} 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">YouTube</label>
                <input 
                    className="w-full border p-2 rounded" 
                    placeholder="https://youtube.com/..." 
                    value={socialLinks.youtube || ''} 
                    onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})} 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">LinkedIn</label>
                <input 
                    className="w-full border p-2 rounded" 
                    placeholder="https://linkedin.com/..." 
                    value={socialLinks.linkedin || ''} 
                    onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})} 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">Instagram</label>
                <input 
                    className="w-full border p-2 rounded" 
                    placeholder="https://instagram.com/..." 
                    value={socialLinks.instagram || ''} 
                    onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} 
                />
            </div>
            <div className="md:col-span-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-2 rounded shadow-sm">
                    Enregistrer les liens
                </button>
            </div>
        </form>
    </div>
  );
};

export default AdminSocials;
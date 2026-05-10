import React, { useState } from 'react';
import { ArrowRight, X, Download, User } from 'lucide-react';

const Team = ({ teamList }) => {
  // L'état de la pop-up vit désormais uniquement ici !
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  return (
    <>
      {/* --- L'ÉQUIPE DIRIGEANTE --- */}
      <section id="team" className="bg-gray-50 py-16 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Une Direction Engagée</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamList.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 italic py-10">
                    Chargement de l'équipe ou liste vide...<br/><span className="text-xs">Ajoutez des membres via l'Espace Pro.</span>
                </div>
            )}
            
            {teamList.map((member, index) => (
                <div key={index} className="text-center group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300">
                  <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner group-hover:border-orange-500 transition duration-300 cursor-pointer" onClick={() => setSelectedTeamMember(member)}>
                    <img src={member.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={member.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-orange-600 font-medium text-sm uppercase tracking-wide mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm italic mb-4 line-clamp-2">"{member.quote}"</p>
                  
                  <button onClick={() => setSelectedTeamMember(member)} className="text-teal-600 font-bold text-sm flex items-center justify-center gap-1 mx-auto hover:text-teal-800 transition">
                      Voir le profil complet <ArrowRight size={16}/>
                  </button>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODAL PROFIL ÉQUIPE (Pop-up) --- */}
      {selectedTeamMember && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTeamMember(null)}></div>
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row animate-fade-in-up">
                
                <button onClick={() => setSelectedTeamMember(null)} className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 transition z-20 bg-white rounded-full p-1 shadow-md">
                    <X size={24} />
                </button>
                
                <div className="md:w-2/5 bg-gray-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
                    <img src={selectedTeamMember.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={selectedTeamMember.name} className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover object-top shadow-lg mb-6 border-4 border-white" />
                    <h3 className="text-2xl font-black text-gray-900 text-center">{selectedTeamMember.name}</h3>
                    <p className="text-orange-600 font-bold text-sm uppercase tracking-wider text-center mt-2">{selectedTeamMember.role}</p>
                    
                    {selectedTeamMember.cvUrl && (
                        <a href={selectedTeamMember.cvUrl} target="_blank" rel="noopener noreferrer" className="mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition w-full shadow-md">
                            <Download size={18}/> Télécharger le CV
                        </a>
                    )}
                </div>
                
                <div className="md:w-3/5 p-8 md:p-10">
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                        <User size={24} className="text-teal-600"/> Biographie & Parcours
                    </h4>
                    
                    <div className="prose prose-sm md:prose-base text-gray-600 text-justify whitespace-pre-line leading-relaxed">
                        {selectedTeamMember.bio || "Le parcours détaillé de ce collaborateur sera bientôt disponible."}
                    </div>
                    
                    {selectedTeamMember.quote && (
                        <blockquote className="mt-8 border-l-4 border-orange-500 pl-5 italic text-gray-500 text-sm bg-orange-50 p-4 rounded-r-lg">
                            "{selectedTeamMember.quote}"
                        </blockquote>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Team;
import React from 'react';
import { Youtube, Facebook } from 'lucide-react';

// La fonction de configuration vidéo est maintenant rangée ici
const getVideoConfig = (url) => {
    if (!url) return { type: null };

    const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const ytMatch = url.match(ytRegExp);
    if (ytMatch && ytMatch[2].length === 11) {
        const videoId = ytMatch[2];
        return { 
            type: 'youtube', 
            src: `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&modestbranding=1` 
        };
    }

    if (url.includes('facebook.com') || url.includes('fb.watch')) {
        const encodedUrl = encodeURIComponent(url);
        return { 
            type: 'facebook', 
            src: `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=0&width=560&autoplay=0` 
        };
    }

    return { type: null };
};

const Projects = ({ projectsList, t, setSelectedImage }) => {
  return (
    <section id="projects" className="bg-gray-50 py-16 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.nav_projects}</h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectsList.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 italic">
              Aucune réalisation affichée pour le moment.
            </div>
          )}

          {projectsList.map((proj, index) => {
            const videoConfig = getVideoConfig(proj.videoUrl); 
            return (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg bg-white h-72">
                {videoConfig.type ? (
                  <div className="w-full h-full relative bg-black">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={videoConfig.src} 
                      title={proj.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      style={{ border: 'none', overflow: 'hidden' }} 
                      scrolling="no"
                    ></iframe>
                    <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow ${videoConfig.type === 'youtube' ? 'bg-red-600' : 'bg-blue-600'}`}>
                      {videoConfig.type === 'youtube' ? <Youtube size={12}/> : <Facebook size={12}/>} Vidéo
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      src={proj.imageUrl || "https://via.placeholder.com/400"} 
                      alt={proj.title} 
                      onClick={() => setSelectedImage(proj.imageUrl)}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 cursor-zoom-in"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 pointer-events-none">
                      <div>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 inline-block">{proj.type}</span>
                        <h3 className="text-white font-bold text-xl">{proj.title}</h3>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
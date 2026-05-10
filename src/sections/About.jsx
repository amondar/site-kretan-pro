import React from 'react';
import { HardHat, Home, Users } from 'lucide-react';

const About = () => {
  return (
    <section id="propos" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Notre Philosophie</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">L'excellence technique centralisée</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Née de la volonté d'offrir une expertise transversale en Côte d'Ivoire.</p>
        </div>
        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <HardHat size={24} />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Infrastructures & BTP</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">Projets d'envergure : construction de ponts, génie civil et VRD.</dd>
            </div>
            
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                  <Home size={24} />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Habitat & Design</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">Architecture, construction de maison, décoration et vente de terrains.</dd>
            </div>
            
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <Users size={24} />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Services & Gestion</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">Gestion immobilière, nettoyage professionnel et maintenance.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
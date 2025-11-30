import { useState } from 'react';
import { Event } from '../types';
import Footer from '../components/Footer';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const events: Event[] = [
    {
      id: '1',
      title: 'Mariage Sophie & Thomas',
      date: '2024-06-15',
      type: 'Mariage',
      images: [
        'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      id: '2',
      title: 'Lancement Produit TechCorp',
      date: '2024-05-20',
      type: 'Réunion Pro',
      images: [
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      id: '3',
      title: 'Anniversaire 50 ans Marie',
      date: '2024-04-10',
      type: 'Réception',
      images: [
        'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      id: '4',
      title: 'Gala de Charité',
      date: '2024-03-22',
      type: 'Autres',
      images: [
        'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      id: '5',
      title: 'Mariage Laura & Pierre',
      date: '2024-02-14',
      type: 'Mariage',
      images: [
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
    {
      id: '6',
      title: 'Séminaire Innovation',
      date: '2024-01-18',
      type: 'Réunion Pro',
      images: [
        'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      ],
    },
  ];

  const filters = ['all', 'Mariage', 'Réception', 'Réunion Pro', 'Autres'];

  const filteredEvents =
    selectedFilter === 'all'
      ? events
      : events.filter((event) => event.type === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#111827] mb-6">
              Galerie Événements
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos créations et laissez-vous inspirer par nos réalisations passées
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }}></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }}></div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'Tous' : filter}
              </button>
            ))}
          </div>

          <div className="space-y-16">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
              >
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full text-sm font-medium mb-4 w-fit shadow-md">
                      {event.type}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Un événement mémorable orchestré avec passion et professionnalisme.
                      Chaque détail a été pensé pour créer une expérience unique et inoubliable.
                    </p>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-fit"
                    >
                      Voir plus de photos
                    </button>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 p-4 ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                    {event.images.map((image, idx) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                          idx === 0 ? 'col-span-2 h-80' : 'h-48'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${event.title} ${idx + 1}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-[#ad5945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl text-gray-500 mb-4">
                Aucun événement trouvé pour cette catégorie
              </p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="px-6 py-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Voir tous les événements
              </button>
            </div>
          )}

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Prêt à créer votre événement ?
                </h3>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Laissez-nous transformer votre vision en réalité avec notre expertise événementielle
                </p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-white text-[#ad5945] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 group"
                >
                  <span>Commencer votre projet</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Event } from '../types';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Setup intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [filteredEvents]);

  return (
    <div className="min-h-screen font-playfair text-[#111827] overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8) rotateX(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }

        @keyframes morphBlob {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(173, 89, 69, 0.3), inset 0 0 20px rgba(173, 89, 69, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(211, 128, 116, 0.5), inset 0 0 20px rgba(173, 89, 69, 0.2);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(173, 89, 69, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(211, 128, 116, 0.6), 0 0 30px rgba(173, 89, 69, 0.4);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }

        @keyframes blinkGlow {
          0%, 100% {
            background-color: rgba(173, 89, 69, 0.2);
            box-shadow: 0 0 20px rgba(173, 89, 69, 0.3);
          }
          50% {
            background-color: rgba(211, 128, 116, 0.3);
            box-shadow: 0 0 30px rgba(211, 128, 116, 0.5);
          }
        }

        .font-playfair {
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.5px;
        }

        .font-dm-serif {
          font-family: 'DM Serif Display', serif;
          letter-spacing: -0.3px;
        }

        .font-raleway {
          font-family: 'Raleway', sans-serif;
          letter-spacing: 0.3px;
        }

        .font-lora {
          font-family: 'Lora', serif;
          letter-spacing: 0.2px;
        }

        .font-inter {
          font-family: 'Raleway', sans-serif;
          letter-spacing: 0.3px;
        }

        .font-cormorant {
          font-family: 'Lora', serif;
          letter-spacing: 0.2px;
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        .glowing-badge {
          animation: blinkGlow 3s ease-in-out infinite;
        }

        .text-glow {
          animation: textGlow 3s ease-in-out infinite;
        }

        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="pt-32 pb-20 relative">
        {/* Blobs animés en arrière-plan */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-96 h-96 bg-[#ad5945] rounded-full blur-3xl"
            style={{ animation: 'morphBlob 10s ease-in-out infinite' }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#d38074] rounded-full blur-3xl"
            style={{ animation: 'morphBlob 12s ease-in-out infinite', animationDelay: '2s' }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div 
              style={{ animation: 'slideDown 0.8s ease-out' }}
              className="inline-block mb-6"
            >
              <span className="inline-block bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-6 py-3 rounded-full font-inter text-sm font-semibold uppercase tracking-widest shimmer-effect glowing-badge">
                Galerie Événements
              </span>
            </div>
            
            <h1 
              className="font-playfair text-5xl md:text-7xl font-bold text-[#111827] mb-6 text-glow"
              style={{ animation: 'slideDown 0.8s ease-out 0.1s both' }}
            >
              Nos Réalisations
            </h1>
            
            <p 
              className="font-inter text-xl text-gray-600 max-w-3xl mx-auto font-light mb-8"
              style={{ animation: 'slideUp 0.8s ease-out 0.2s both' }}
            >
              Découvrez nos créations et laissez-vous inspirer par nos réalisations passées
            </p>
            
            <div 
              className="flex justify-center gap-2"
              style={{ animation: 'fadeInUp 1s ease-out 0.3s both' }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }}></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }}></div>
            </div>
          </div>

          <div 
            className="flex flex-wrap justify-center gap-3 mb-16"
            style={{ animation: 'scaleUp 0.6s ease-out 0.4s both' }}
          >
            {filters.map((filter, index) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-3 rounded-full font-inter font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white shadow-lg hover:shadow-xl hover:scale-110'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md border border-gray-200 hover:border-[#ad5945]/30'
                }`}
                style={{
                  animation: `slideUp 0.6s ease-out ${0.45 + index * 0.08}s both`
                }}
              >
                {filter === 'all' ? 'Tous' : filter}
              </button>
            ))}
          </div>

          <div className="space-y-16">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                id={`event-${event.id}`}
                data-animate
                className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-100 hover:border-[#ad5945]/20 group"
                style={{
                  opacity: isVisible[`event-${event.id}`] ? 1 : 0,
                  transform: isVisible[`event-${event.id}`] ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full text-sm font-inter font-semibold mb-4 w-fit shadow-md shimmer-effect group-hover:scale-110 transition-transform duration-300">
                      {event.type}
                    </span>
                    
                    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#111827] mb-4 group-hover:text-[#ad5945] transition-colors duration-300">
                      {event.title}
                    </h2>
                    
                    <p className="font-inter text-gray-600 text-lg mb-6 font-light">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    
                    <p className="font-inter text-gray-600 leading-relaxed font-light mb-6">
                      Un événement mémorable orchestré avec passion et professionnalisme.
                      Chaque détail a été pensé pour créer une expérience unique et inoubliable.
                    </p>
                    
                    <button
                      onClick={() => onNavigate('contact')}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full font-inter font-semibold hover:shadow-lg transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 w-fit overflow-hidden relative group/btn inline-flex items-center gap-2"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-8px) scale(1.1)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = '';
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#d38074] to-[#ca715b] translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></span>
                      <span className="relative z-10">Voir plus de photos</span>
                      <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 p-4 ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                    {event.images.map((image, idx) => (
                      <div
                        key={idx}
                        className={`relative overflow-hidden rounded-xl group/img cursor-pointer transform transition-all duration-500 ${
                          idx === 0 ? 'col-span-2 h-80' : 'h-48'
                        } hover:scale-105 hover:shadow-2xl hover:shadow-[#ad5945]/30`}
                        onMouseEnter={() => setIsHovering(`image-${event.id}-${idx}`)}
                        onMouseLeave={() => setIsHovering(null)}
                      >
                        <img
                          src={image}
                          alt={`${event.title} ${idx + 1}`}
                          className="w-full h-full object-cover transform group-hover/img:scale-125 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 transform group-hover/img:scale-100 scale-75">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover/img:scale-125 group-hover/img:rotate-12 transition-all duration-500" style={{ animation: isHovering === `image-${event.id}-${idx}` ? 'pulse 1.5s ease-in-out infinite' : 'none' }}>
                            <svg className="w-8 h-8 text-[#ad5945]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Effet de bordure lumineuse */}
                        <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ad5945] to-transparent"></div>
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d38074] to-transparent"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div 
              className="text-center py-20"
              style={{ animation: 'scaleUp 0.6s ease-out' }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg glow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-inter text-xl text-gray-500 mb-4 font-light">
                Aucun événement trouvé pour cette catégorie
              </p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="px-8 py-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full font-inter font-semibold hover:shadow-lg transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Voir tous les événements</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div 
            id="cta-section"
            data-animate
            className="text-center mt-16"
            style={{
              opacity: isVisible['cta-section'] ? 1 : 0,
              transform: isVisible['cta-section'] ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(40px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="bg-gradient-to-br from-[#ad5945] via-[#d38074] to-[#ca715b] rounded-3xl p-12 text-white relative overflow-hidden group/cta">
              <div className="absolute inset-0 opacity-10">
                <div 
                  className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
                  style={{ 
                    animation: 'float 8s ease-in-out infinite',
                    transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
                  }}
                ></div>
                <div 
                  className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"
                  style={{ 
                    animation: 'float 10s ease-in-out infinite', 
                    animationDelay: '2s',
                    transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`
                  }}
                ></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-glow">
                  Prêt à créer votre événement ?
                </h3>
                <p className="font-inter text-xl mb-8 text-white/90 max-w-2xl mx-auto font-light">
                  Laissez-nous transformer votre vision en réalité avec notre expertise événementielle
                </p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-white text-[#ad5945] px-10 py-4 rounded-full font-inter font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 inline-flex items-center gap-3 group/cta-btn relative overflow-hidden"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    e.currentTarget.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-8px) scale(1.1)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 translate-y-full group-hover/cta-btn:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10">Commencer votre projet</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover/cta-btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

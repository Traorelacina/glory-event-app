import { ArrowRight } from 'lucide-react';
import { Testimonial } from '../types';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Footer from '../components/Footer';
import { statisticsService } from '../../services/statisticsService';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState({ events: 0, years: 0, satisfaction: 0, partners: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Images et textes pour le slider hero
  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Créez des Moments Inoubliables',
      subtitle: 'Transformez vos visions en moments magiques. De l\'organisation d\'événements premium à notre collection exclusive de parfums.',
      cta1: 'Commencer votre projet',
      cta2: 'Voir nos réalisations'
    },
    {
      image: 'https://images.pexels.com/photos/1488467/pexels-photo-1488467.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Mariages de Rêve',
      subtitle: 'Des cérémonies inoubliables orchestrées avec élégance et raffinement. Chaque détail compte pour votre jour parfait.',
      cta1: 'Planifier mon mariage',
      cta2: 'Découvrir nos services'
    },
    {
      image: 'https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Événements Corporate',
      subtitle: 'Solutions professionnelles pour vos séminaires et réceptions d\'entreprise. Excellence et innovation au rendez-vous.',
      cta1: 'Organiser un événement',
      cta2: 'Voir le portfolio'
    },
    {
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Réceptions Privées',
      subtitle: 'Créez des moments mémorables pour vos célébrations personnelles. Anniversaires, baptêmes et fêtes sur mesure.',
      cta1: 'Réserver maintenant',
      cta2: 'Nos prestations'
    },
    {
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Décoration d\'Exception',
      subtitle: 'Ambiances uniques adaptées à votre vision et votre style. Design et mise en scène sur mesure pour chaque occasion.',
      cta1: 'Obtenir un devis',
      cta2: 'Galerie photos'
    }
  ];

  // Track page view
  useEffect(() => {
    statisticsService.trackView('home');
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Services principaux
  const services = [
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
      title: 'Mariages de Luxe',
      description: 'Des cérémonies inoubliables orchestrées avec élégance et raffinement',
      color: 'from-[#ad5945] to-[#d38074]',
      img: 'https://images.pexels.com/photos/1488467/pexels-photo-1488467.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/1067/1067566.png',
      title: 'Événements Corporate',
      description: "Solutions professionnelles pour vos séminaires et réceptions d'entreprise",
      color: 'from-[#ca715b] to-[#ad5945]',
      img: 'https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/3290/3290425.png',
      title: 'Réceptions Privées',
      description: 'Créez des moments mémorables pour vos célébrations personnelles',
      color: 'from-[#d38074] to-[#ad5945]',
      img: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png',
      title: 'Décoration sur Mesure',
      description: 'Ambiances uniques adaptées à votre vision et votre style',
      color: 'from-[#ad5945] to-[#ca715b]',
      img: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
  ];

  // Services détaillés
  const detailedServices = [
    {
      icon: 'https://img.icons8.com/?size=100&id=34F8IE9yR8fJ&format=png&color=000000',
      title: 'Organisation de Mariage',
      description: 'Wedding planning complet pour votre jour parfait',
      color: 'from-[#ad5945] to-[#d38074]',
      slug: 'mariage'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=103937&format=png&color=000000',
      title: 'Réunion Professionnelle',
      description: 'Séminaires et conférences de haut niveau',
      color: 'from-[#ca715b] to-[#d38074]',
      slug: 'reunion-professionnelle'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=A8fp9eO99uvg&format=png&color=000000',
      title: 'Décoration',
      description: 'Design et mise en scène sur mesure',
      color: 'from-[#ad5945] to-[#ca715b]',
      slug: 'decoration'
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/2738/2738730.png',
      title: 'Restauration',
      description: 'Cuisine africaine, européenne et américaine',
      color: 'from-[#d38074] to-[#ad5945]',
      slug: 'restauration'
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/3290/3290471.png',
      title: 'Événementiel',
      description: 'Organisation complète de tous types d\'événements',
      color: 'from-[#ca715b] to-[#ad5945]',
      slug: 'evenementiel'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=108783&format=png&color=000000',
      title: 'Réceptions Privées',
      description: 'Anniversaires, baptêmes et célébrations familiales',
      color: 'from-[#d38074] to-[#ca715b]',
      slug: 'reception'
    },
  ];

  // Features
  const features = [
    {
      icon: 'https://img.icons8.com/?size=100&id=NEUI7OgKJl6r&format=png&color=000000',
      title: 'Service Personnalisé',
      description: 'Chaque événement est unique et mérite une attention particulière'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=SsUyXplSFORf&format=png&color=000000',
      title: 'Respect des Délais',
      description: 'Livraison dans les temps avec une qualité constante'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=tt6pu1n8E0QU&format=png&color=000000',
      title: 'Excellence Garantie',
      description: 'Des prestations haut de gamme pour des résultats exceptionnels'
    },
    {
      icon: 'https://img.icons8.com/?size=100&id=104233&format=png&color=000000',
      title: 'Innovation Créative',
      description: 'Des concepts novateurs qui marquent les esprits'
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sophie Martin',
      text: 'Une équipe exceptionnelle qui a transformé notre mariage en un conte de fées. Chaque détail était parfait.',
    },
    {
      id: '2',
      name: 'Jean Dupont',
      text: 'Professionnalisme et créativité au rendez-vous. Notre événement corporate a été un véritable succès.',
    },
    {
      id: '3',
      name: 'Marie Laurent',
      text: 'Des prestations haut de gamme et une écoute attentive. Je recommande sans hésitation!',
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const targets = { events: 500, years: 15, satisfaction: 98, partners: 50 };
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        events: Math.floor(targets.events * easeOut),
        years: Math.floor(targets.years * easeOut),
        satisfaction: Math.floor(targets.satisfaction * easeOut),
        partners: Math.floor(targets.partners * easeOut),
      });

      if (currentStep >= steps) clearInterval(interval);
    }, stepDuration);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen font-playfair text-[#111827] overflow-x-hidden">
      {/* Import des polices et animations CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
          }
          50% { 
            transform: translateY(-10px) translateX(-10px); 
          }
          75% { 
            transform: translateY(-15px) translateX(5px); 
          }
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .font-cormorant {
          font-family: 'Cormorant Garamond', serif;
        }

        .text-shadow-gentle {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .text-shadow-elegant {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
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

        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-tilt {
          transform-style: preserve-3d;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .parallax-layer {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Section Hero avec Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slides avec effet de zoom */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-all duration-1000 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: currentSlide === index ? 1 : 0,
              transform: currentSlide === index 
                ? `translateY(${scrollY * 0.5}px) scale(1.05)` 
                : `translateY(${scrollY * 0.5}px) scale(1)`,
              zIndex: currentSlide === index ? 1 : 0
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#ad5945]/30 to-black/60"></div>
          </div>
        ))}

        {/* Particules flottantes décoratives */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"
            style={{ 
              animation: 'float 6s ease-in-out infinite',
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full"
            style={{ 
              animation: 'float 8s ease-in-out infinite',
              animationDelay: '2s',
              transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/25 rounded-full"
            style={{ 
              animation: 'float 10s ease-in-out infinite',
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
            }}
          ></div>
        </div>

        {/* Content avec animations élégantes */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto text-white">
          <div 
            className="inline-block mb-6 overflow-hidden"
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <span className="font-inter text-sm font-semibold uppercase tracking-widest">
                Excellence & Élégance
              </span>
            </div>
          </div>

          <h1 
            className="font-cormorant text-5xl md:text-7xl lg:text-6xl font-light mb-8 tracking-tight text-shadow-elegant parallax-layer"
            style={{ 
              animation: 'fadeInUp 1s ease-out 0.2s both',
              transform: `translateY(${mousePosition.y * -5}px)`
            }}
          >
            {heroSlides[currentSlide].title}
          </h1>

          <p 
            className="font-inter text-xl md:text-2xl lg:text-3xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed font-light tracking-wide parallax-layer"
            style={{ 
              animation: 'fadeInUp 1s ease-out 0.4s both',
              transform: `translateY(${mousePosition.y * -3}px)`
            }}
          >
            {heroSlides[currentSlide].subtitle}
          </p>

          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
          >
            <button 
              onClick={() => onNavigate('contact')} 
              className="group relative bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-10 py-5 rounded-full font-inter font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden magnetic-button"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-8px) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#d38074] to-[#ca715b] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative z-10 tracking-wide">{heroSlides[currentSlide].cta1}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>

            <button 
              onClick={() => onNavigate('gallery')} 
              className="group relative bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-full font-inter font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center gap-3 overflow-hidden hover:-translate-y-2 hover:scale-105 magnetic-button"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-8px) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <span className="relative z-10 tracking-wide">{heroSlides[currentSlide].cta2}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Indicateurs de slides */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index 
                  ? 'w-12 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-2 text-white/70"
          style={{ animation: 'bounce 2s ease-in-out infinite' }}
        >
          <span className="font-inter text-xs uppercase tracking-widest rotate-90 mb-8">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/70 to-transparent"></div>
        </div>
      </section>

      {/* Section Features avec animations au scroll */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Blobs animés en arrière-plan */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
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
          <div 
            id="features-header"
            data-animate
            className="text-center mb-20"
            style={{
              opacity: isVisible['features-header'] ? 1 : 0,
              transform: isVisible['features-header'] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span className="inline-block bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-6 py-3 rounded-full font-inter text-sm font-semibold uppercase tracking-widest mb-6 shimmer-effect">
              Notre Engagement
            </span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight">
              L'Excellence dans
              <span className="block font-playfair italic text-5xl md:text-6xl text-[#ad5945] mt-2">
                Chaque Détail
              </span>
            </h2>
            <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Nous combinons créativité, professionnalisme et expertise pour donner vie à vos projets les plus ambitieux
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className="text-center group p-8 rounded-3xl hover:bg-gradient-to-br hover:from-[#ad5945]/5 hover:to-[#d38074]/5 transition-all duration-500 cursor-default border border-transparent hover:border-[#ad5945]/10 card-tilt"
                style={{
                  opacity: isVisible[`feature-${index}`] ? 1 : 0,
                  transform: isVisible[`feature-${index}`] ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(-10deg)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg border border-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ad5945]/10 to-[#d38074]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-4 tracking-tight group-hover:text-[#ad5945] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="font-inter text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Services avec animations avancées */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-[#ad5945] rounded-full blur-3xl"
            style={{ 
              animation: 'float 8s ease-in-out infinite',
              transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#d38074] rounded-full blur-3xl"
            style={{ 
              animation: 'float 10s ease-in-out infinite', 
              animationDelay: '2s',
              transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ca715b] rounded-full blur-3xl"
            style={{ 
              animation: 'float 12s ease-in-out infinite', 
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="services-header"
            data-animate
            className="text-center mb-20"
            style={{
              opacity: isVisible['services-header'] ? 1 : 0,
              transform: isVisible['services-header'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <span className="inline-block bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-6 py-3 rounded-full font-inter text-sm font-semibold uppercase tracking-widest mb-6 shimmer-effect">
              Notre Expertise
            </span>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light text-white mb-8 tracking-tight">
              Services Premium
              <span className="block font-playfair italic text-5xl md:text-6xl text-[#d38074] mt-2">
                à Votre Disposition
              </span>
            </h2>
            <p className="font-inter text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              De l'organisation de mariages de rêve aux événements corporate sophistiqués, nous maîtrisons tous les aspects de l'événementiel de luxe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedServices.map((service, index) => (
              <div
                key={index}
                id={`service-${index}`}
                data-animate
                className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-[#d38074]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#ad5945]/20 cursor-pointer overflow-hidden"
                onClick={() => onNavigate('services')}
                onMouseEnter={() => setIsHovering(`service-${index}`)}
                onMouseLeave={() => setIsHovering(null)}
                style={{
                  opacity: isVisible[`service-${index}`] ? 1 : 0,
                  transform: isVisible[`service-${index}`] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <div className={`relative w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ad5945]/20 to-[#d38074]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      animation: isHovering === `service-${index}` ? 'pulse 1s ease-in-out infinite' : 'none'
                    }}
                  />
                </div>

                <h3 className="font-playfair text-2xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ad5945] group-hover:to-[#d38074] transition-all tracking-tight">
                  {service.title}
                </h3>
                <p className="font-inter text-gray-300 leading-relaxed mb-6 font-light">
                  {service.description}
                </p>

                <div className="flex items-center text-[#d38074] font-inter font-medium text-sm group-hover:text-[#ca715b] transition-colors tracking-wide">
                  <span className="mr-3">En savoir plus</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                </div>

                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          <div 
            id="services-cta"
            data-animate
            className="text-center mt-20"
            style={{
              opacity: isVisible['services-cta'] ? 1 : 0,
              transform: isVisible['services-cta'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out 0.3s',
            }}
          >
            <button
              onClick={() => onNavigate('services')}
              className="group relative bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-12 py-6 rounded-full font-inter font-semibold text-lg hover:shadow-2xl hover:shadow-[#ad5945]/50 transform hover:-translate-y-2 hover:scale-105 transition-all inline-flex items-center gap-3 overflow-hidden magnetic-button"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-8px) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#d38074] to-[#ca715b] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <span className="relative z-10 tracking-wide">Explorer tous nos services</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Section Portfolio avec effet de révélation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="portfolio-header"
            data-animate
            className="text-center mb-20"
            style={{
              opacity: isVisible['portfolio-header'] ? 1 : 0,
              transform: isVisible['portfolio-header'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <h2 className="font-cormorant text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Nos Réalisations
              <span className="block font-playfair italic text-4xl md:text-5xl text-[#ad5945] mt-3">
                d'Exception
              </span>
            </h2>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Des prestations sur mesure pour faire de votre événement un moment d'exception
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                id={`portfolio-${index}`}
                data-animate
                className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                onClick={() => onNavigate('services')}
                onMouseEnter={() => setIsHovering(`portfolio-${index}`)}
                onMouseLeave={() => setIsHovering(null)}
                style={{
                  opacity: isVisible[`portfolio-${index}`] ? 1 : 0,
                  transform: isVisible[`portfolio-${index}`] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`,
                }}
              > 
                <div className="relative overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{
                      filter: isHovering === `portfolio-${index}` ? 'brightness(1.1)' : 'brightness(1)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-75">
                    <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl ${isHovering === `portfolio-${index}` ? 'animate-pulse' : ''}`}>
                      <img 
                        src={service.icon} 
                        alt={service.title}
                        className="w-12 h-12"
                      />
                    </div>
                  </div>

                  {/* Effet de bordure lumineuse */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ad5945] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d38074] to-transparent"></div>
                  </div>
                </div>
                
                <div className="p-8 bg-white relative z-10">
                  <h3 className="font-playfair text-xl font-semibold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#ad5945] group-hover:to-[#d38074] transition-all tracking-tight">
                    {service.title}
                  </h3>
                  <p className="font-inter text-gray-700 text-sm mb-4 font-light">{service.description}</p>
                  
                  <div className="flex items-center text-[#ad5945] font-inter font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 tracking-wide">
                    <span className="mr-2">Découvrir</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Particule décorative */}
                <div 
                  className="absolute top-4 right-4 w-3 h-3 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ animation: isHovering === `portfolio-${index}` ? 'pulse 2s ease-in-out infinite' : 'none' }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Témoignages avec carousel amélioré */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="testimonials-header"
            data-animate
            className="text-center mb-20"
            style={{
              opacity: isVisible['testimonials-header'] ? 1 : 0,
              transform: isVisible['testimonials-header'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <h2 className="font-cormorant text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Témoignages
              <span className="block font-playfair italic text-4xl md:text-5xl text-[#ad5945] mt-3">
                de nos Clients
              </span>
            </h2>
            <p className="font-inter text-xl text-gray-600 font-light">Leur satisfaction est notre plus belle récompense</p>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={windowWidth < 768 ? 1 : 3}
            loop
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div 
                  className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col group hover:-translate-y-3 border border-gray-100 relative overflow-hidden"
                  onMouseEnter={() => setIsHovering(`testimonial-${testimonial.id}`)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>


                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center text-white font-playfair font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform relative overflow-hidden">
                      <span className="relative z-10">{testimonial.name.charAt(0)}</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="ml-5">
                      <h4 className="font-playfair font-semibold text-[#111827] text-lg group-hover:text-[#ad5945] transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="font-inter text-sm text-gray-500 font-light">Client vérifié</p>
                    </div>
                  </div>
                  <p className="font-inter text-gray-600 italic leading-relaxed flex-1 text-lg font-light mb-6 relative z-10">
                    "{testimonial.text}"
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-2 text-sm text-green-600 font-inter font-medium">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                      alt="Verified"
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                    />
                    <span>Témoignage vérifié</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Section Boutique avec animations dynamiques */}
      <section 
        id="boutique-section"
        data-animate
        className="py-24 bg-gradient-to-br from-[#ad5945] via-[#d38074] to-[#ca715b] text-white text-center relative overflow-hidden"
        style={{
          opacity: isVisible['boutique-section'] ? 1 : 0,
          transform: isVisible['boutique-section'] ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.8s ease-out',
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            style={{ 
              animation: 'float 6s ease-in-out infinite',
              transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`
            }}
          ></div>
          <div 
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            style={{ 
              animation: 'float 8s ease-in-out infinite', 
              animationDelay: '2s',
              transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            style={{ 
              animation: 'float 10s ease-in-out infinite', 
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`
            }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 mb-8 shimmer-effect">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
              alt="Sparkles"
              className="w-5 h-5"
              style={{ animation: 'rotate 3s linear infinite' }}
            />
            <span className="font-inter text-sm font-semibold uppercase tracking-widest">Collection Exclusive</span>
          </div>

          <h2 className="font-cormorant text-5xl md:text-6xl font-light mb-8 tracking-tight">
            Découvrez notre
            <span className="block font-playfair italic text-5xl md:text-6xl text-white mt-2">
              Collection de Parfums
            </span>
          </h2>
          <p className="font-inter text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Des fragrances exclusives pour sublimer vos événements et créer une ambiance unique
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {['Fragrances Premium', 'Fabrication Artisanale', 'Livraison Rapide'].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full font-inter font-light hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                  alt="Check"
                  className="w-5 h-5"
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('boutique')}
            className="group relative bg-white text-[#ad5945] px-12 py-6 rounded-full font-inter font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 overflow-hidden magnetic-button"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              e.currentTarget.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-8px) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
              alt="Sparkles"
              className="relative z-10 w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
            />
            <span className="relative z-10 tracking-wide">Explorer la boutique</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
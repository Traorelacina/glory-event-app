import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, AlertCircle, Loader, Sparkles, Star, CheckCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Effet parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer pour les animations
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setLocalError(err.message || 'Erreur de connexion');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen font-sans text-[#111827] overflow-x-hidden">
      {/* Hero Section avec Background Animé */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background avec parallax */}
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/80 to-slate-900/90"></div>
        </div>

        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          ></div>
        </div>

        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div 
            id="login-header"
            data-animate
            className="text-center mb-8"
            style={{
              opacity: isVisible['login-header'] ? 1 : 0,
              transform: isVisible['login-header'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-semibold text-sm uppercase tracking-wider text-white">Espace Administrateur</span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              Connexion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#EC4899] to-[#8B5CF6]">
                Administrateur
              </span>
            </h1>
            
            <p className="text-lg text-gray-200">
              Accédez à votre tableau de bord de gestion
            </p>
          </div>

          {/* Carte de connexion */}
          <div 
            id="login-card"
            data-animate
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500"
            style={{
              opacity: isVisible['login-card'] ? 1 : 0,
              transform: isVisible['login-card'] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.6s ease-out 0.2s',
            }}
          >
            {displayError && (
              <div 
                id="error-message"
                data-animate
                className="mb-6 p-4 bg-orange-500/20 backdrop-blur-sm border-2 border-orange-400/50 rounded-xl flex gap-3"
                style={{
                  opacity: isVisible['error-message'] ? 1 : 0,
                  transform: isVisible['error-message'] ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.4s ease-out',
                }}
              >
                <AlertCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-orange-100 text-sm font-medium">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Email */}
              <div
                id="email-field"
                data-animate
                style={{
                  opacity: isVisible['email-field'] ? 1 : 0,
                  transform: isVisible['email-field'] ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.6s ease-out 0.3s',
                }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                  Email Administrateur
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-white transition-colors" size={20} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div
                id="password-field"
                data-animate
                style={{
                  opacity: isVisible['password-field'] ? 1 : 0,
                  transform: isVisible['password-field'] ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.6s ease-out 0.4s',
                }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-white transition-colors" size={20} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#8B5CF6] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                {isLoading ? (
                  <>
                    <Loader className="relative z-10 animate-spin" size={20} />
                    <span className="relative z-10">Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="relative z-10 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative z-10">Se connecter</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Lien support */}
            <div 
              id="support-link"
              data-animate
              className="mt-8 text-center"
              style={{
                opacity: isVisible['support-link'] ? 1 : 0,
                transform: isVisible['support-link'] ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease-out 0.5s',
              }}
            >
              <p className="text-gray-300 text-sm">
                Besoin d'aide?{' '}
                <a href="#" className="text-purple-300 hover:text-white font-medium transition-colors duration-300 hover:underline">
                  Contacter le support
                </a>
              </p>
            </div>
          </div>

          {/* Informations environnement */}
          <div 
            id="environment-info"
            data-animate
            className="mt-8 text-center"
            style={{
              opacity: isVisible['environment-info'] ? 1 : 0,
              transform: isVisible['environment-info'] ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.6s',
            }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm font-medium">
                Environnement: <span className="text-orange-400">Développement</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
            <span className="text-white text-sm font-medium">Informations de sécurité</span>
            <ArrowRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </div>
      </section>

      

      {/* Animations CSS */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
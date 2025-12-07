import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Mail, Lock, AlertCircle, Loader, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, checkAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Ref pour éviter les doubles redirections
  const hasRedirected = useRef(false);
  const isSubmitting = useRef(false);

  // ==============================
  // VÉRIFICATION INITIALE D'AUTHENTIFICATION
  // ==============================
  useEffect(() => {
    const isAuth = checkAuth();
    
    if (isAuth && !hasRedirected.current) {
      console.log('✅ Utilisateur déjà authentifié, redirection immédiate...');
      hasRedirected.current = true;
      navigate('/admin/dashboard', { replace: true });
    }
  }, [checkAuth, navigate]);

  // ==============================
  // VÉRIFICATION APRÈS LOGIN
  // ==============================
  useEffect(() => {
    // Ne vérifier qu'après un login réussi (pas de loading, pas d'erreur)
    if (!isLoading && !error && !hasRedirected.current) {
      const isAuth = checkAuth();
      
      if (isAuth) {
        console.log('✅ Login réussi, redirection vers dashboard...');
        hasRedirected.current = true;
        
        // Petit délai pour s'assurer que le store est bien persisté
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100);
      }
    }
  }, [isLoading, error, checkAuth, navigate]);

  // ==============================
  // EFFET PARALLAX
  // ==============================
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ==============================
  // ANIMATION INITIALE
  // ==============================
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ==============================
  // GESTION DE LA SOUMISSION
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Éviter les doubles soumissions
    if (isLoading || isSubmitting.current) {
      console.warn('⚠️ Soumission déjà en cours');
      return;
    }

    // Validation côté client
    if (!email.trim() || !password.trim()) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Veuillez entrer une adresse email valide');
      return;
    }

    // Réinitialiser les erreurs
    setLocalError(null);
    clearError();
    isSubmitting.current = true;

    try {
      console.log('🔑 Tentative de connexion pour:', email.trim());
      
      await login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      console.log('✅ Login effectué avec succès');
      // La redirection se fera automatiquement via useEffect
      
    } catch (err: any) {
      console.error('❌ Erreur lors de la connexion:', err);
      
      const errorMessage = err.message || 'Erreur de connexion. Veuillez réessayer.';
      setLocalError(errorMessage);
      
      // Réinitialiser le mot de passe en cas d'erreur
      setPassword('');
      
    } finally {
      isSubmitting.current = false;
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
          {/* Header */}
          <div 
            className="text-center mb-8 transition-all duration-800 ease-out"
            style={{
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0)' : 'translateY(30px)',
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
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500"
            style={{
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transitionDelay: '200ms',
            }}
          >
            {/* Message d'erreur */}
            {displayError && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-xl flex gap-3 animate-shake">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-100 text-sm font-medium">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ Email */}
              <div
                className="transition-all duration-600 ease-out"
                style={{
                  opacity: hasAnimated ? 1 : 0,
                  transform: hasAnimated ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: '300ms',
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
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div
                className="transition-all duration-600 ease-out"
                style={{
                  opacity: hasAnimated ? 1 : 0,
                  transform: hasAnimated ? 'translateX(0)' : 'translateX(-20px)',
                  transitionDelay: '400ms',
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
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading || isSubmitting.current}
                className="w-full group relative bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#EC4899] hover:to-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/50 disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-3 overflow-hidden"
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
              className="mt-8 text-center transition-all duration-600 ease-out"
              style={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '500ms',
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
            className="mt-8 text-center transition-all duration-600 ease-out"
            style={{
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '600ms',
            }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm font-medium">
                Environnement: <span className="text-green-400">Connecté</span>
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
            <span className="text-white text-sm font-medium">Informations de sécurité</span>
            <ArrowRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </div>
      </section>

      {/* Animations CSS */}
      <style>{`
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

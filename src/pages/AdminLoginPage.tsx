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
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const hasRedirected = useRef(false);
  const isSubmitting = useRef(false);

  // ==============================
  // VÉRIFICATION INITIALE
  // ==============================
  useEffect(() => {
    // Forcer l'hydratation si nécessaire
    const currentState = useAuthStore.getState();
    if (!currentState._hasHydrated) {
      console.log('⚠️ Login - Forçage hydratation');
      useAuthStore.setState({ _hasHydrated: true });
    }

    // Vérifier si déjà connecté
    const isAuth = checkAuth();
    
    if (isAuth && !hasRedirected.current) {
      console.log('✅ Déjà authentifié, redirection...');
      hasRedirected.current = true;
      navigate('/admin/dashboard', { replace: true });
    }
  }, [checkAuth, navigate]);

  // ==============================
  // REDIRECTION APRÈS LOGIN
  // ==============================
  useEffect(() => {
    // Ne vérifier que si pas en cours de chargement et pas d'erreur
    if (isLoading || error || hasRedirected.current) {
      return;
    }
    
    const isAuth = checkAuth();
    
    if (isAuth) {
      console.log('✅ Login réussi, redirection...');
      hasRedirected.current = true;
      
      // Petit délai pour s'assurer que la persistence est complète
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 100);
    }
  }, [isLoading, error, checkAuth, navigate]);

  // Animation
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ==============================
  // SOUMISSION
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || isSubmitting.current) {
      console.warn('⚠️ Soumission déjà en cours');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Email invalide');
      return;
    }

    setLocalError(null);
    clearError();
    isSubmitting.current = true;

    try {
      console.log('🔑 Connexion:', email.trim());
      
      await login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      console.log('✅ Login effectué');
      
    } catch (err: any) {
      console.error('❌ Erreur login:', err);
      setLocalError(err.message || 'Erreur de connexion');
      setPassword('');
    } finally {
      isSubmitting.current = false;
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Header */}
          <div 
            className="text-center mb-8 transition-all duration-800"
            style={{
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="font-semibold text-sm uppercase tracking-wider text-white">Espace Admin</span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              Connexion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                Administrateur
              </span>
            </h1>
            
            <p className="text-lg text-gray-200">
              Accédez à votre tableau de bord
            </p>
          </div>

          {/* Carte */}
          <div 
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
            style={{
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transitionDelay: '200ms',
            }}
          >
            {/* Erreur */}
            {displayError && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-xl flex gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-100 text-sm font-medium">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={isLoading || isSubmitting.current}
                className="w-full group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl disabled:hover:transform-none flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Se connecter</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Support */}
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                Besoin d'aide?{' '}
                <a href="#" className="text-purple-300 hover:text-white font-medium transition-colors hover:underline">
                  Support
                </a>
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm font-medium">
                Environnement: <span className="text-green-400">Connecté</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

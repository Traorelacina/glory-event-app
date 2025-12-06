// pages/AdminLoginPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Mail, Lock, AlertCircle, Loader, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, admin, token, _hasHydrated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // ==============================
  // REDIRECTION SI DÉJÀ CONNECTÉ - VERSION SIMPLIFIÉE
  // ==============================
  useEffect(() => {
    // Attendre que le store soit hydraté
    if (!_hasHydrated) {
      console.log('⏳ Login: Store en cours d\'hydratation...');
      return;
    }

    // Vérifier si l'utilisateur est déjà connecté
    if (admin && token && !isRedirecting) {
      console.log('✅ Login: Déjà connecté, redirection vers dashboard...');
      setIsRedirecting(true);
      
      // Petit délai pour éviter les conflits de rendu
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 100);
    }
  }, [_hasHydrated, admin, token, navigate, isRedirecting]);

  // ==============================
  // GESTION DE LA SOUMISSION
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      console.log('⏳ Connexion déjà en cours...');
      return;
    }

    // Validation simple
    if (!email.trim() || !password.trim()) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    setLocalError(null);
    clearError();

    try {
      console.log('🔑 Tentative de connexion...');
      await login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      // La redirection se fera automatiquement via useEffect
      
    } catch (err: any) {
      console.error('❌ Erreur de connexion:', err);
      const errorMessage = err.message || 'Erreur de connexion. Veuillez réessayer.';
      setLocalError(errorMessage);
      setPassword('');
    }
  };

  const displayError = localError || error;

  // ==============================
  // AFFICHAGE SIMPLE SANS ÉCRAN D'INITIALISATION
  // ==============================
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si on est en train de rediriger, on montre un loader simple
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // FORMULAIRE DE CONNEXION
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-sm uppercase tracking-wider text-white">Espace Administrateur</span>
          </div>

          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Connexion
          </h1>
          
          <p className="text-gray-200">
            Accédez à votre tableau de bord
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Message d'erreur */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border-2 border-red-400/50 rounded-xl flex gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-100 text-sm font-medium">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemple.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
                  disabled={isLoading}
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

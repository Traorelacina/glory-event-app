// pages/AdminLoginPage.tsx - VERSION DIRECTE
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, admin, token } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // ==============================
  // REDIRECTION SI DÉJÀ CONNECTÉ
  // ==============================
  useEffect(() => {
    // Vérification SIMPLE : si token et admin existent, on redirige
    if (token && admin) {
      console.log('✅ Déjà connecté, redirection...');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, admin, navigate]);

  // ==============================
  // GESTION DE LA SOUMISSION
  // ==============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) {
      console.warn('Connexion déjà en cours');
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
  // RENDU SIMPLE
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Connexion Admin
          </h1>
          <p className="text-gray-300">
            Entrez vos identifiants pour continuer
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Message d'erreur */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-100 text-sm">{displayError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@exemple.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                  disabled={isLoading}
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
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Connexion...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Info basique */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Pour toute assistance, contactez le support technique
          </p>
        </div>
      </div>
    </div>
  );
}

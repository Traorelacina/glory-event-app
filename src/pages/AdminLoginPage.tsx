// components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { Loader, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  showLoader?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = true,
  showLoader = true 
}: ProtectedRouteProps) {
  const location = useLocation();
  const { _hasHydrated, token, admin, isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [checkStep, setCheckStep] = useState(0);

  useEffect(() => {
    if (!_hasHydrated) {
      console.log('🛡️ ProtectedRoute: En attente d\'hydratation...');
      setCheckStep(1);
      return;
    }

    const performChecks = async () => {
      setChecking(true);
      
      // Étape 1: Vérifier l'authentification
      setCheckStep(2);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isAuthenticated()) {
        console.log('🛡️ ProtectedRoute: Non authentifié');
        setCheckStep(3);
        await new Promise(resolve => setTimeout(resolve, 300));
        setChecking(false);
        return;
      }

      // Étape 2: Vérifier les permissions admin si nécessaire
      setCheckStep(4);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (requireAdmin && admin?.role !== 'admin') {
        console.log('🛡️ ProtectedRoute: Permissions insuffisantes');
        setCheckStep(5);
        await new Promise(resolve => setTimeout(resolve, 300));
        setChecking(false);
        return;
      }

      // Étape 3: Accès autorisé
      setCheckStep(6);
      console.log('🛡️ ProtectedRoute: Accès autorisé');
      await new Promise(resolve => setTimeout(resolve, 100));
      setChecking(false);
    };

    performChecks();
  }, [_hasHydrated, isAuthenticated, admin?.role, requireAdmin]);

  // Affichage pendant les vérifications
  if (checking && showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Animation de chargement */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-white to-blue-50 rounded-full shadow-2xl flex items-center justify-center">
                {checkStep <= 3 ? (
                  <Loader className="w-16 h-16 text-blue-600 animate-spin" />
                ) : checkStep <= 5 ? (
                  <ShieldAlert className="w-16 h-16 text-amber-600" />
                ) : (
                  <ShieldCheck className="w-16 h-16 text-green-600 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Messages d'étape */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {checkStep === 1 && 'Initialisation de la sécurité...'}
              {checkStep === 2 && 'Vérification de votre session...'}
              {checkStep === 3 && 'Session expirée ou invalide'}
              {checkStep === 4 && 'Vérification des permissions...'}
              {checkStep === 5 && 'Permissions insuffisantes'}
              {checkStep === 6 && 'Accès autorisé!'}
            </h2>
            
            <p className="text-gray-600">
              {checkStep === 1 && 'Chargement des paramètres de sécurité...'}
              {checkStep === 2 && 'Vérification de votre token d\'authentification...'}
              {checkStep === 3 && 'Redirection vers la page de connexion...'}
              {checkStep === 4 && 'Vérification de vos droits d\'accès...'}
              {checkStep === 5 && 'Vous n\'avez pas les permissions nécessaires'}
              {checkStep === 6 && 'Préparation de votre espace...'}
            </p>
          </div>

          {/* Indicateur de progression */}
          <div className="bg-white rounded-full p-1 shadow-inner border border-gray-200 max-w-xs mx-auto">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(checkStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to="/admin/login" 
        replace 
        state={{ 
          from: location,
          message: 'Veuillez vous connecter pour accéder à cette page',
          requiresAuth: true
        }}
      />
    );
  }

  // Erreur de permissions
  if (requireAdmin && admin?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-amber-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <ShieldAlert className="text-white w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Accès Restreint
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Vous essayez d'accéder à une section réservée aux administrateurs.
            <br />
            <span className="font-semibold text-amber-700">
              {admin?.email}
            </span> n'a pas les permissions nécessaires.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              ← Retour à la page précédente
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Aller au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tout est bon, afficher le contenu
  return <>{children}</>;
}

// pages/AdminDashboardPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { adminApi } from '../../services/api';
import { statisticsService } from '../../services/statisticsService';
import { 
  Loader, AlertCircle, Package, ShoppingCart, Clock, 
  Mail, TrendingUp, Activity, Sparkles, Star, ArrowRight,
  Eye, Calendar, BarChart3, RefreshCw, Home, Users, Settings
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { Chart, Bars, Transform, Layer, Ticks, Labels } from 'rumble-charts';

interface ViewStatistics {
  total_views: number;
  today_views: number;
  month_views: number;
  year_views: number;
  daily_views: Array<{ date: string; views: number }>;
  monthly_views: Array<{ year: number; month: number; views: number }>;
  page_views: Array<{ page_name: string; views: number }>;
}

interface DashboardStats {
  total_services: number;
  total_produits: number;
  total_commandes: number;
  commandes_en_attente: number;
  total_contacts: number;
  total_portfolio: number;
}

// Types pour les composants enfants
interface StatCardProps {
  label: string;
  value: number;
  icon: any;
  gradient: string;
  subtitle?: string;
  highlight?: boolean;
  loading?: boolean;
}

interface ViewsBarChartProps {
  data: Array<{ date: string; views: number }>;
  loading: boolean;
}

interface MonthlyViewsChartProps {
  data: Array<{ year: number; month: number; views: number }>;
  loading: boolean;
}

interface PageViewsChartProps {
  data: Array<{ page_name: string; views: number }>;
  loading: boolean;
}

interface RecentViewsProps {
  data: Array<{ date: string; views: number }>;
  loading: boolean;
}

interface QuickActionButtonProps {
  label: string;
  href: string;
  icon: any;
  gradient: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, admin, _hasHydrated, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewStats, setViewStats] = useState<ViewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // ==============================
  // VÉRIFICATION AUTH
  // ==============================
  useEffect(() => {
    if (!_hasHydrated) {
      console.log('⏳ Dashboard: En attente d\'hydratation...');
      return;
    }

    console.log('🔍 Dashboard: Vérification auth...', { 
      hasToken: !!token, 
      hasAdmin: !!admin,
      hydrated: _hasHydrated,
      authenticated: isAuthenticated()
    });
    
    if (!isAuthenticated()) {
      console.log('🚫 Dashboard: Non authentifié, redirection...');
      navigate('/admin/login', { 
        replace: true,
        state: { from: '/admin/dashboard' }
      });
      return;
    }
    
    console.log('✅ Dashboard: Prêt à charger les données');
  }, [_hasHydrated, isAuthenticated, navigate]);

  // ==============================
  // CHARGEMENT DES DONNÉES
  // ==============================
  const fetchDashboardData = useCallback(async () => {
    if (!token || !isAuthenticated()) return;

    try {
      setLoading(true);
      setError(null);
      console.log('📥 Dashboard: Chargement des données...');

      // Timeout pour éviter les blocages
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Le chargement a pris trop de temps')), 30000)
      );

      // Chargement parallèle des données
      const [dashboardResponse, statisticsResponse] = await Promise.race([
        Promise.allSettled([
          adminApi.getDashboard(token),
          statisticsService.getStatistics(token)
        ]),
        timeoutPromise
      ]) as PromiseSettledResult<any>[];

      // Traitement des réponses
      if (dashboardResponse.status === 'fulfilled') {
        setStats(dashboardResponse.value.data);
        console.log('✅ Dashboard: Stats principales chargées');
      } else {
        console.error('❌ Erreur dashboard:', dashboardResponse.reason);
        setError('Impossible de charger les statistiques principales');
      }

      if (statisticsResponse.status === 'fulfilled') {
        setViewStats(statisticsResponse.value);
        console.log('✅ Dashboard: Statistiques vues chargées');
      } else {
        console.warn('⚠️ Stats vues non disponibles:', statisticsResponse.reason);
        // Pas d'erreur fatale pour les stats vues
      }

      setLastUpdate(new Date());

    } catch (error: any) {
      console.error('❌ Erreur générale dashboard:', error);
      
      if (error.message?.includes('Timeout')) {
        setError('Le chargement a pris trop de temps. Vérifiez votre connexion.');
      } else {
        setError(error.message || 'Erreur lors du chargement du dashboard');
      }
    } finally {
      setLoading(false);
      setStatsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated()) {
      return;
    }

    fetchDashboardData();
  }, [_hasHydrated, isAuthenticated, fetchDashboardData]);

  // ==============================
  // ANIMATIONS INTERSECTION OBSERVER
  // ==============================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id') || entry.target.getAttribute('data-animate-id') || 'unknown';
            setIsVisible((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, [stats, viewStats]);

  // ==============================
  // HANDLERS
  // ==============================
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  // ==============================
  // AFFICHAGES DE CHARGEMENT
  // ==============================
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <Loader className="w-24 h-24 text-purple-600 animate-spin relative" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Initialisation du tableau de bord</h2>
          <p className="text-gray-600">Chargement de votre session administrateur...</p>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="min-h-screen p-4 md:p-8">
          {/* Skeleton Header */}
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse h-40"></div>
          
          {/* Refresh Button Skeleton */}
          <div className="mb-8 flex justify-end">
            <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-10 w-24 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="h-64 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Header avec bouton refresh */}
        <section className="relative mb-8 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
            <div className="absolute inset-0 opacity-40">
              <div 
                className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full blur-3xl"
                style={{ animation: 'float 8s ease-in-out infinite' }}
              ></div>
              <div 
                className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600 rounded-full blur-3xl"
                style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }}
              ></div>
            </div>
          </div>

          <div className="relative z-10 p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4">
                  <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Tableau de Bord Administrateur</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                  <Activity className="animate-pulse" size={32} />
                  Bienvenue, {admin?.name?.split(' ')[0] || 'Admin'}
                </h1>
                <p className="text-purple-100 text-lg">
                  Vue d'ensemble complète de votre plateforme
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <p className="text-sm text-purple-200 mb-1">Dernière mise à jour</p>
                  <p className="text-xl font-bold">{lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="p-4 md:p-6">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl shadow-xl">
              <div className="flex gap-4">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <p className="text-red-900 font-bold text-lg mb-1">Erreur de chargement</p>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div 
            id="stats-grid"
            data-animate
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            style={{
              opacity: isVisible['stats-grid'] ? 1 : 0,
              transform: isVisible['stats-grid'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <StatCard 
              label="Vues Total" 
              value={viewStats?.total_views || 0} 
              icon={Eye}
              gradient="from-indigo-500 to-blue-500"
              subtitle="Depuis le début"
              loading={statsLoading}
            />
            <StatCard 
              label="Vues Aujourd'hui" 
              value={viewStats?.today_views || 0} 
              icon={Calendar}
              gradient="from-green-500 to-emerald-500"
              subtitle="Visites du jour"
              loading={statsLoading}
            />
            <StatCard 
              label="Vues Ce Mois" 
              value={viewStats?.month_views || 0} 
              icon={TrendingUp}
              gradient="from-purple-500 to-pink-500"
              subtitle="Ce mois-ci"
              loading={statsLoading}
            />
            <StatCard 
              label="Vues Cette Année" 
              value={viewStats?.year_views || 0} 
              icon={BarChart3}
              gradient="from-orange-500 to-amber-500"
              subtitle="Année en cours"
              loading={statsLoading}
            />
            <StatCard 
              label="Produits" 
              value={stats?.total_produits || 0} 
              icon={Package}
              gradient="from-pink-500 to-rose-500"
              subtitle="Parfums en catalogue"
              loading={loading}
            />
            <StatCard 
              label="Commandes" 
              value={stats?.total_commandes || 0} 
              icon={ShoppingCart}
              gradient="from-blue-500 to-cyan-500"
              subtitle="Commandes totales"
              loading={loading}
            />
            <StatCard 
              label="En attente" 
              value={stats?.commandes_en_attente || 0} 
              icon={Clock}
              gradient="from-amber-500 to-orange-500"
              subtitle="À traiter"
              highlight={true}
              loading={loading}
            />
            <StatCard 
              label="Contacts" 
              value={stats?.total_contacts || 0} 
              icon={Mail}
              gradient="from-teal-500 to-emerald-500"
              subtitle="Demandes reçues"
              loading={loading}
            />
          </div>

          {/* Graphiques et données détaillées */}
          {viewStats && (
            <>
              {/* Graphique 7 derniers jours */}
              <div 
                id="weekly-chart"
                data-animate
                className="mb-8"
                style={{
                  opacity: isVisible['weekly-chart'] ? 1 : 0,
                  transform: isVisible['weekly-chart'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.2s',
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Vues des 7 derniers jours</h3>
                        <p className="text-gray-600">Évolution du trafic quotidien</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {(viewStats.daily_views?.slice(-7) || []).reduce((sum, day) => sum + day.views, 0).toLocaleString()} vues
                    </div>
                  </div>
                  <ViewsBarChart 
                    data={viewStats.daily_views?.slice(-7) || []} 
                    loading={statsLoading} 
                  />
                </div>
              </div>

              {/* Graphique mensuel */}
              <div 
                id="monthly-chart"
                data-animate
                className="mb-8"
                style={{
                  opacity: isVisible['monthly-chart'] ? 1 : 0,
                  transform: isVisible['monthly-chart'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.3s',
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-teal-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">Vues par Mois</h3>
                      <p className="text-gray-600">Évolution annuelle des visites</p>
                    </div>
                  </div>
                  <MonthlyViewsChart 
                    data={viewStats.monthly_views || []} 
                    loading={statsLoading} 
                  />
                </div>
              </div>

              {/* Section détaillée */}
              <div 
                id="detailed-stats"
                data-animate
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                style={{
                  opacity: isVisible['detailed-stats'] ? 1 : 0,
                  transform: isVisible['detailed-stats'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out 0.4s',
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-purple-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Eye className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Performance des Pages</h3>
                  </div>
                  <PageViewsChart 
                    data={viewStats.page_views || []} 
                    loading={statsLoading} 
                  />
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Vues Récentes</h3>
                  </div>
                  <RecentViews 
                    data={viewStats.daily_views?.slice(-5) || []} 
                    loading={statsLoading} 
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions rapides */}
          <div 
            id="quick-actions"
            data-animate
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-purple-100"
            style={{
              opacity: isVisible['quick-actions'] ? 1 : 0,
              transform: isVisible['quick-actions'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out 0.5s',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Actions Rapides</h2>
              </div>
              <p className="text-gray-600">Accès direct aux principales sections</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionButton 
                label="Gérer Produits"
                href="/admin/produits"
                icon={Package}
                gradient="from-purple-600 to-indigo-600"
              />
              <QuickActionButton 
                label="Commandes"
                href="/admin/commandes"
                icon={ShoppingCart}
                gradient="from-pink-600 to-rose-600"
              />
              <QuickActionButton 
                label="Contacts"
                href="/admin/contacts"
                icon={Mail}
                gradient="from-blue-600 to-cyan-600"
              />
              <QuickActionButton 
                label="Services"
                href="/admin/services"
                icon={Home}
                gradient="from-green-600 to-emerald-600"
              />
              <QuickActionButton 
                label="Utilisateurs"
                href="/admin/utilisateurs"
                icon={Users}
                gradient="from-orange-600 to-amber-600"
              />
              <QuickActionButton 
                label="Statistiques"
                href="/admin/statistiques"
                icon={BarChart3}
                gradient="from-indigo-600 to-blue-600"
              />
              <QuickActionButton 
                label="Paramètres"
                href="/admin/parametres"
                icon={Settings}
                gradient="from-gray-600 to-slate-600"
              />
              <QuickActionButton 
                label="Portfolio"
                href="/admin/portfolio"
                icon={Eye}
                gradient="from-teal-600 to-emerald-600"
              />
            </div>
          </div>

          {/* Pied de page info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <span>Dashboard v1.0.0</span>
              <span>•</span>
              <span>Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}</span>
              <span>•</span>
              <span>Connecté en tant que: {admin?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(10px); }
          50% { transform: translateY(-5px) translateX(-10px); }
          75% { transform: translateY(-10px) translateX(5px); }
        }
      `}</style>
    </AdminLayout>
  );
}

// ==============================
// COMPOSANTS INTERNES
// ==============================

function StatCard({ label, value, icon: Icon, gradient, subtitle, highlight, loading }: StatCardProps) {
  return (
    <div className={`group relative bg-white backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden ${highlight ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="text-white" size={24} />
          </div>
          {highlight && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow animate-pulse">
              <Sparkles className="w-3 h-3" />
              URGENT
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">{label}</p>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <p className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient} text-3xl font-bold mb-2`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-gray-500 text-sm">{subtitle}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ViewsBarChart({ data, loading }: ViewsBarChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <Loader className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-700 font-semibold">Chargement du graphique...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <BarChart3 className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-lg font-bold text-gray-600 mb-2">Aucune donnée disponible</p>
        <p className="text-gray-500 text-center">Les données apparaîtront après les premières visites</p>
      </div>
    );
  }

  const last7Days = [...data].slice(-7);
  const maxViews = Math.max(...last7Days.map(day => day.views)) || 1;

  const chartData = {
    series: [{
      data: last7Days.map(day => day.views)
    }]
  };

  return (
    <div className="w-full">
      <div className="h-64 px-4">
        <Chart width={800} height={250} series={chartData.series} minY={0}>
          <Layer width="90%" height="85%" position="middle center">
            <Ticks
              axis="y"
              ticks={{ maxTicks: 6 }}
              lineLength="100%"
              lineStyle={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              labelStyle={{ fill: '#6b7280', fontSize: 11 }}
            />
            <Bars
              innerPadding={20}
              barStyle={{
                fill: '#3b82f6',
                cursor: 'pointer',
                transition: 'opacity 0.3s',
              }}
              barAttributes={({ pointIndex }: { pointIndex: number }) => ({
                onMouseOver: () => setSelectedIndex(pointIndex),
                onMouseOut: () => setSelectedIndex(null),
                style: {
                  opacity: selectedIndex === null || selectedIndex === pointIndex ? 1 : 0.5
                }
              })}
            />
          </Layer>
        </Chart>
      </div>
      
      <div className="flex justify-between mt-4 px-4">
        {last7Days.map((day, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div 
              key={index}
              className="flex flex-col items-center"
              onMouseOver={() => setSelectedIndex(index)}
              onMouseOut={() => setSelectedIndex(null)}
            >
              <div className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
              </div>
              <div className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                {day.views}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyViewsChart({ data, loading }: MonthlyViewsChartProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <Calendar className="w-16 h-16 mb-4 text-gray-400" />
        <p className="font-medium">Aucune donnée mensuelle</p>
      </div>
    );
  }

  // Code existant pour MonthlyViewsChart...
  // (Conserver votre code existant ici)
  
  return (
    <div className="text-center p-8 text-gray-500">
      <p>Graphique mensuel des vues</p>
    </div>
  );
}

function PageViewsChart({ data, loading }: PageViewsChartProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  // Code existant pour PageViewsChart...
  // (Conserver votre code existant ici)
  
  return (
    <div className="text-center p-8 text-gray-500">
      <p>Graphique des pages les plus visitées</p>
    </div>
  );
}

function RecentViews({ data, loading }: RecentViewsProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // Code existant pour RecentViews...
  // (Conserver votre code existant ici)
  
  return (
    <div className="text-center p-8 text-gray-500">
      <p>Liste des vues récentes</p>
    </div>
  );
}

function QuickActionButton({ label, href, icon: Icon, gradient }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className={`group relative flex items-center gap-3 p-4 bg-gradient-to-r ${gradient} text-white rounded-xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 font-medium`}
    >
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      <span>{label}</span>
      <ArrowRight className="ml-auto w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

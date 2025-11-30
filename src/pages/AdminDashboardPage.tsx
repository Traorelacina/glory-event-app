import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminApi } from '../../services/api';
import { statisticsService } from '../../services/statisticsService';
import { 
  Loader, AlertCircle, Briefcase, Package, ShoppingCart, Clock, 
  Mail, Image, TrendingUp, Activity, Sparkles, Star, ArrowRight,
  Eye, Calendar, BarChart3
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface ViewStatistics {
  total_views: number;
  today_views: number;
  month_views: number;
  year_views: number;
  daily_views: Array<{ date: string; views: number }>;
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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewStats, setViewStats] = useState<ViewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboard(token);
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du dashboard');
      } finally {
        setLoading(false);
      }
    };

    const fetchViewStatistics = async () => {
      try {
        setStatsLoading(true);
        const statistics = await statisticsService.getStatistics(token);
        console.log('📊 Données statistiques reçues:', statistics);
        setViewStats(statistics);
      } catch (err: any) {
        console.error('Erreur lors du chargement des statistiques de vues:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboard();
    fetchViewStatistics();
  }, [token, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
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
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [stats, viewStats]);

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Hero Header Section */}
        <section className="relative mb-8 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
            <div className="absolute inset-0 opacity-30">
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

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div 
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4"
                  style={{ animation: 'slideDown 0.8s ease-out' }}
                >
                  <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Tableau de Bord Admin</span>
                </div>
                
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3"
                  style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
                >
                  <Activity className="animate-pulse" size={40} />
                  Dashboard
                </h1>
                <p 
                  className="text-purple-100 text-lg md:text-xl"
                  style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
                >
                  Vue d'ensemble de votre plateforme événementielle
                </p>
              </div>
              
              <div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
              >
                <p className="text-sm text-purple-200 mb-1 font-medium">Dernière mise à jour</p>
                <p className="text-2xl font-bold">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl shadow-xl flex gap-4"
            style={{ animation: 'slideInLeft 0.6s ease-out' }}
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-red-900 font-bold text-lg mb-1">Erreur de chargement</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl border border-purple-100">
            <Loader className="animate-spin text-purple-600 mb-4" size={60} />
            <p className="text-gray-700 font-semibold text-lg">Chargement des statistiques...</p>
            <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
          </div>
        ) : stats ? (
          <>
            {/* Main Stats Grid - Avec statistiques de vues */}
            <div 
              id="stats-grid"
              data-animate
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              style={{
                opacity: isVisible['stats-grid'] ? 1 : 0,
                transform: isVisible['stats-grid'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out',
              }}
            >
              {/* Statistiques de vues */}
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
                label="Services" 
                value={stats.total_services} 
                icon={Briefcase}
                gradient="from-purple-500 to-indigo-500"
                subtitle="Services actifs"
              />
              <StatCard 
                label="Produits" 
                value={stats.total_produits} 
                icon={Package}
                gradient="from-pink-500 to-rose-500"
                subtitle="Parfums en catalogue"
              />
              <StatCard 
                label="Commandes" 
                value={stats.total_commandes} 
                icon={ShoppingCart}
                gradient="from-blue-500 to-cyan-500"
                subtitle="Commandes totales"
              />
              <StatCard 
                label="En attente" 
                value={stats.commandes_en_attente} 
                icon={Clock}
                gradient="from-amber-500 to-orange-500"
                subtitle="À traiter"
                highlight={true}
              />
              <StatCard 
                label="Contacts" 
                value={stats.total_contacts} 
                icon={Mail}
                gradient="from-teal-500 to-emerald-500"
                subtitle="Demandes reçues"
              />
            </div>

            {/* Section Graphique Principal */}
            <div 
              id="analytics-section"
              data-animate
              className="mb-8"
              style={{
                opacity: isVisible['analytics-section'] ? 1 : 0,
                transform: isVisible['analytics-section'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.3s',
              }}
            >
              {/* Graphique des vues des 7 derniers jours - Pleine largeur */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Vues des 7 derniers jours</h3>
                    <p className="text-gray-600">Évolution du trafic quotidien sur votre site</p>
                  </div>
                </div>
                <ViewsBarChart data={viewStats?.daily_views?.slice(-7) || []} loading={statsLoading} />
              </div>
            </div>

            {/* Section Détails des Statistiques */}
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
              {/* Détails des vues par page */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Performance des Pages</h3>
                </div>
                <PageViewsTable data={viewStats?.page_views || []} loading={statsLoading} />
              </div>

              {/* Statistiques récentes */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Vues Récentes</h3>
                </div>
                <RecentViews data={viewStats?.daily_views?.slice(-5) || []} loading={statsLoading} />
              </div>
            </div>

            {/* Quick Actions Section */}
            <div 
              id="quick-actions"
              data-animate
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100 relative overflow-hidden"
              style={{
                opacity: isVisible['quick-actions'] ? 1 : 0,
                transform: isVisible['quick-actions'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.5s',
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Actions rapides</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickActionButton 
                    label="Gérer les produits"
                    href="/admin/produits"
                    icon={Package}
                    gradient="from-purple-600 to-indigo-600"
                  />
                  <QuickActionButton 
                    label="Voir les commandes"
                    href="/admin/commandes"
                    icon={ShoppingCart}
                    gradient="from-pink-600 to-rose-600"
                  />
                  <QuickActionButton 
                    label="Consulter contacts"
                    href="/admin/contacts"
                    icon={Mail}
                    gradient="from-blue-600 to-cyan-600"
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>
    </AdminLayout>
  );
}

// Composant pour le graphique à barres
interface ViewsBarChartProps {
  data: Array<{ date: string; views: number }>;
  loading: boolean;
}

function ViewsBarChart({ data, loading }: ViewsBarChartProps) {
  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl">
        <Loader className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-gray-700 font-semibold">Chargement du graphique...</p>
        <p className="text-gray-500 text-sm mt-2">Analyse des vues quotidiennes</p>
      </div>
    );
  }

  // Si pas de données, affiche un message avec style
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
        <BarChart3 className="w-20 h-20 mb-4 text-gray-400" />
        <p className="text-xl font-bold text-gray-600 mb-2">Aucune donnée disponible</p>
        <p className="text-gray-500 text-center max-w-md">
          Les statistiques de vues des derniers jours apparaîtront ici dès que vos visiteurs navigueront sur votre site.
        </p>
        <div className="mt-6 flex gap-4">
          <div className="text-center">
            <div className="w-4 h-16 bg-indigo-200 rounded-t mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Aucune vue</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-8 bg-indigo-300 rounded-t mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Données à venir</p>
          </div>
          <div className="text-center">
            <div className="w-4 h-12 bg-indigo-400 rounded-t mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Graphique actif</p>
          </div>
        </div>
      </div>
    );
  }

  // Prend les 7 derniers jours
  const last7Days = data.slice(-7);
  const maxViews = Math.max(...last7Days.map(d => d.views), 1);
  const totalViews = last7Days.reduce((sum, day) => sum + day.views, 0);

  console.log('📊 Données pour le graphique barres:', last7Days);

  return (
    <div className="h-96">
      {/* En-tête avec résumé */}
      <div className="flex justify-between items-center mb-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
        <div className="text-center">
          <p className="text-sm text-gray-600">Période analysée</p>
          <p className="font-bold text-indigo-700">7 jours</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total des vues</p>
          <p className="font-bold text-indigo-700">{totalViews} visites</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Moyenne quotidienne</p>
          <p className="font-bold text-indigo-700">{Math.round(totalViews / 7)} vues/jour</p>
        </div>
      </div>

      {/* Graphique */}
      <div className="flex items-end justify-between gap-3 h-48 px-4">
        {last7Days.map((day, index) => {
          const heightPercentage = Math.max((day.views / maxViews) * 80, 8);
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {/* Barre du graphique */}
              <div className="relative w-full flex justify-center">
                <div
                  className="w-10/12 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-xl transition-all duration-500 hover:from-indigo-600 hover:to-blue-500 cursor-pointer shadow-lg hover:shadow-xl"
                  style={{ 
                    height: `${heightPercentage}%`,
                    minHeight: '20px'
                  }}
                >
                  {/* Tooltip au survol */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-2xl">
                    <div className="font-bold">{day.views} vues</div>
                    <div className="text-xs text-gray-300">
                      {new Date(day.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long',
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>
              
              {/* Date en bas */}
              <div className="text-xs text-gray-600 mt-3 text-center font-medium">
                {new Date(day.date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </div>
              
              {/* Valeur au-dessus de la barre */}
              <div className="text-sm font-bold text-indigo-700 mt-1">
                {day.views}
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende et statistiques */}
      <div className="flex justify-between items-center mt-8 px-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Échelle: 0 à {maxViews} vues
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Jour le plus bas: {Math.min(...last7Days.map(d => d.views))}</span>
          <span>Jour le plus haut: {Math.max(...last7Days.map(d => d.views))}</span>
        </div>
      </div>
    </div>
  );
}

// Composant pour le tableau des pages
interface PageViewsTableProps {
  data: Array<{ page_name: string; views: number }>;
  loading: boolean;
}

function PageViewsTable({ data, loading }: PageViewsTableProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <Eye className="w-12 h-12 mb-3 text-gray-400" />
        <p className="font-medium">Aucune page visitée</p>
        <p className="text-sm text-center mt-1">Les statistiques par page apparaîtront ici</p>
      </div>
    );
  }

  // Trie par nombre de vues décroissant
  const sortedData = [...data].sort((a, b) => b.views - a.views);

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {sortedData.map((page, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 group hover:shadow-md"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-gray-800 capitalize block truncate">
                {page.page_name}
              </span>
              <p className="text-sm text-gray-600">Page visitée</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 block">
              {page.views}
            </span>
            <p className="text-sm text-gray-600">vues</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant pour les vues récentes
interface RecentViewsProps {
  data: Array<{ date: string; views: number }>;
  loading: boolean;
}

function RecentViews({ data, loading }: RecentViewsProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-500">
        <Calendar className="w-12 h-12 mb-3 text-gray-400" />
        <p className="font-medium">Aucune donnée récente</p>
        <p className="text-sm text-center mt-1">Les vues quotidiennes apparaîtront ici</p>
      </div>
    );
  }

  // Trie par date décroissante
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {sortedData.map((day, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 group hover:shadow-md"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
              <Calendar className="text-blue-600" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-800 block">
                {new Date(day.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </span>
              <p className="text-sm text-gray-600 truncate">Activité quotidienne</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 block">
              {day.views}
            </span>
            <p className="text-sm text-gray-600">visites</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Composants StatCard et QuickActionButton restent inchangés...
interface StatCardProps {
  label: string;
  value: number;
  icon: any;
  gradient: string;
  subtitle?: string;
  highlight?: boolean;
  loading?: boolean;
}

function StatCard({ label, value, icon: Icon, gradient, subtitle, highlight, loading }: StatCardProps) {
  return (
    <div className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden ${highlight ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <Icon className="text-white" size={28} />
          </div>
          {highlight && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
              <Sparkles className="w-3 h-3" />
              URGENT
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm font-bold mb-2 uppercase tracking-wider">{label}</p>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <p className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient} text-4xl font-bold mb-2`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-gray-500 text-sm">{subtitle}</p>
            )}
          </>
        )}
      </div>

      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
    </div>
  );
}

interface QuickActionButtonProps {
  label: string;
  href: string;
  icon: any;
  gradient: string;
}

function QuickActionButton({ label, href, icon: Icon, gradient }: QuickActionButtonProps) {
  return (
    <a
      href={href}
      className={`group relative flex items-center gap-3 p-5 bg-gradient-to-r ${gradient} text-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 font-semibold overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      <div className="relative z-10 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
        <Icon size={20} />
      </div>
      <span className="relative z-10">{label}</span>
      <ArrowRight className="relative z-10 w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
    </a>
  );
}
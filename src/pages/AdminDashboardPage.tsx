
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { adminApi } from '../../services/api';
import { statisticsService } from '../../services/statisticsService';
import { 
  Loader, AlertCircle, Package, ShoppingCart, Clock, 
  Mail, TrendingUp, Activity, Sparkles, Star, ArrowRight,
  Eye, Calendar, BarChart3
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

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, admin, _hasHydrated } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [viewStats, setViewStats] = useState<ViewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  // ==============================
  // VÉRIFICATION AUTH - ATTENDRE L'HYDRATATION
  // ==============================
  useEffect(() => {
    if (!_hasHydrated) {
      console.log('⏳ En attente de l\'hydratation du store...');
      return;
    }

    console.log('📊 Dashboard - Vérification auth:', { 
      hasToken: !!token, 
      hasAdmin: !!admin,
      hydrated: _hasHydrated 
    });
    
    if (!token || !admin) {
      console.log('⚠️ Non authentifié, redirection vers login...');
      navigate('/admin/login', { replace: true });
      return;
    }
    
    console.log('✅ Authentifié, chargement du dashboard...');
  }, [token, admin, _hasHydrated, navigate]);

  // ==============================
  // CHARGEMENT DES DONNÉES
  // ==============================
  useEffect(() => {
    if (!_hasHydrated || !token || !admin) {
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        console.log('📥 Chargement des stats du dashboard...');
        const response = await adminApi.getDashboard(token);
        setStats(response.data);
        setError(null);
        console.log('✅ Stats chargées:', response.data);
      } catch (err: any) {
        console.error('❌ Erreur chargement dashboard:', err);
        setError(err.message || 'Erreur lors du chargement du dashboard');
      } finally {
        setLoading(false);
      }
    };

    const fetchViewStatistics = async () => {
      try {
        setStatsLoading(true);
        console.log('📥 Chargement des statistiques de vues...');
        const statistics = await statisticsService.getStatistics(token);
        console.log('✅ Statistiques de vues chargées:', statistics);
        setViewStats(statistics);
      } catch (err: any) {
        console.error('❌ Erreur stats vues:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboard();
    fetchViewStatistics();
  }, [token, admin, _hasHydrated]);

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

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-semibold">Initialisation...</p>
          <p className="text-gray-500 text-sm mt-2">Chargement de votre session</p>
        </div>
      </div>
    );
  }

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
                  Bienvenue {admin?.name || 'Admin'} - Vue d'ensemble de votre plateforme
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
            {/* Main Stats Grid */}
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

            {/* Graphique 7 derniers jours */}
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

            {/* Graphique mensuel */}
            <div 
              id="monthly-stats"
              data-animate
              className="mb-8"
              style={{
                opacity: isVisible['monthly-stats'] ? 1 : 0,
                transform: isVisible['monthly-stats'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out 0.35s',
              }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-teal-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Vues par Mois</h3>
                    <p className="text-gray-600">Évolution annuelle (Janvier - Décembre)</p>
                  </div>
                </div>
                <MonthlyViewsChart data={viewStats?.monthly_views || []} loading={statsLoading} />
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Performance des Pages</h3>
                </div>
                <PageViewsChart data={viewStats?.page_views || []} loading={statsLoading} />
              </div>

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

            {/* Actions rapides */}
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </AdminLayout>
  );
}


// Composant pour le graphique mensuel
interface MonthlyViewsChartProps {
  data: Array<{ year: number; month: number; views: number }>;
  loading: boolean;
}

function MonthlyViewsChart({ data, loading }: MonthlyViewsChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl">
        <Loader className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-gray-700 font-semibold">Chargement du graphique...</p>
        <p className="text-gray-500 text-sm mt-2">Analyse des vues mensuelles</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-300">
        <BarChart3 className="w-20 h-20 mb-4 text-gray-400" />
        <p className="text-xl font-bold text-gray-600 mb-2">Aucune donnée mensuelle</p>
      </div>
    );
  }

  // Préparer les données pour Janvier-Décembre
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const found = data.find(d => d.month === monthNum);
    return {
      month: monthNum,
      label: new Date(2024, i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
      views: found ? found.views : 0,
      index: i // Keep track of index
    };
  });

  const maxViews = Math.max(...allMonths.map(m => m.views)) || 1;

  const chartData = {
    series: [{
      data: allMonths.map(m => m.views)
    }]
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="h-64 px-4 mb-4">
          <Chart width={800} height={250} series={chartData.series} minY={0}>
            <Layer width="90%" height="85%" position="middle center">
              <Ticks
                axis="y"
                ticks={{ maxTicks: 6 }}
                lineLength="100%"
                lineStyle={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 2' }}
                labelStyle={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter, sans-serif', textAnchor: 'end' }}
                labelAttributes={{ dx: -10 }}
              />
              <Bars
                innerPadding={15}
                groupPadding={20}
                barStyle={{
                  fill: 'url(#monthlyGradient)',
                  cursor: 'pointer',
                  stroke: 'url(#monthlyBorder)',
                  strokeWidth: 1
                }}
                barAttributes={({ pointIndex }: { pointIndex: number }) => ({
                  onMouseOver: (e: any) => { 
                    if (selectedIndex === null || selectedIndex === pointIndex) {
                      e.target.style.opacity = '0.8'; 
                      e.target.style.transform = 'scaleY(1.05)'; 
                      e.target.style.transformOrigin = 'bottom';
                    }
                  },
                  onMouseOut: (e: any) => { 
                    if (selectedIndex === null || selectedIndex === pointIndex) {
                      e.target.style.opacity = selectedIndex !== null && selectedIndex !== pointIndex ? '0.4' : '1';
                      e.target.style.transform = 'scaleY(1)'; 
                    }
                  },
                  onClick: () => setSelectedIndex(selectedIndex === pointIndex ? null : pointIndex),
                  style: {
                    opacity: selectedIndex !== null && selectedIndex !== pointIndex ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                    transformOrigin: 'bottom'
                  }
                })}
              />
              <defs>
                <linearGradient id="monthlyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#115e59" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="monthlyBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
              <Labels
                label={({ pointIndex }) => {
                  if (selectedIndex !== null && selectedIndex !== pointIndex) return '';
                  const val = allMonths[pointIndex]?.views;
                  return val > 0 || selectedIndex === pointIndex ? val?.toString() || '0' : '';
                }}
                labelAttributes={{ y: -15, fill: '#374151', fontSize: 12, fontWeight: 'bold', textAnchor: 'middle' }}
              />
            </Layer>
          </Chart>
        </div>

        {/* Légende horizontale */}
        <div className="px-4">
          <div className="flex justify-between items-start gap-1">
            {allMonths.map((m, index) => {
              const isPeak = m.views === maxViews && m.views > 0;
              const isSelected = selectedIndex === index;
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center flex-1 cursor-pointer group"
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  <div className={`p-2 rounded-lg text-center w-full transition-all duration-300 ${
                    isSelected 
                      ? 'bg-teal-600 text-white shadow-lg scale-110 -translate-y-1'
                      : isPeak 
                        ? 'bg-teal-50 border border-teal-200' 
                        : 'hover:bg-gray-50'
                  } ${selectedIndex !== null && !isSelected ? 'opacity-40' : 'opacity-100'}`}>
                    <div className={`text-xs font-medium uppercase ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {m.label}
                    </div>
                    {(isPeak || isSelected) && (
                      <div className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-teal-600'}`}>
                        {m.views}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le graphique à barres avec Rumble Charts -
interface ViewsBarChartProps {
  data: Array<{ date: string; views: number }>;
  loading: boolean;
}

function ViewsBarChart({ data, loading }: ViewsBarChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-[#ad5945]/5 to-[#d38074]/5 rounded-2xl">
        <Loader className="animate-spin text-[#ad5945] mb-4" size={40} />
        <p className="text-gray-700 font-semibold">Chargement du graphique...</p>
        <p className="text-gray-500 text-sm mt-2">Analyse des vues quotidiennes</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-dashed border-gray-300">
        <BarChart3 className="w-20 h-20 mb-4 text-gray-400" />
        <p className="text-xl font-bold text-gray-600 mb-2">Aucune donnée disponible</p>
        <p className="text-gray-500 text-center max-w-md">
          Les statistiques de vues des derniers jours apparaîtront ici dès que vos visiteurs navigueront sur votre site.
        </p>
      </div>
    );
  }

  // Préparer les données - trier par date croissante pour que l'ordre soit cohérent
  const last7Days = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);
    
  const totalViews = last7Days.reduce((sum, day) => sum + day.views, 0);
  const maxViews = Math.max(...last7Days.map(day => day.views));

  // Transformer les données pour Rumble Charts
  const chartData = {
    series: [{
      data: last7Days.map(day => day.views)
    }]
  };

  return (
    <div className="w-full">
      {/* En-tête avec résumé amélioré */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-[#ad5945]/5 via-[#d38074]/5 to-[#ca715b]/5 rounded-2xl border border-[#ad5945]/20">
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#ad5945]/10">
          <p className="text-sm text-gray-600 font-medium mb-1 font-inter">Période analysée</p>
          <p className="text-lg font-bold text-[#ad5945] font-playfair">7 jours</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#ad5945]/10">
          <p className="text-sm text-gray-600 font-medium mb-1 font-inter">Total des vues</p>
          <p className="text-lg font-bold text-[#ad5945] font-playfair">{totalViews.toLocaleString()} visites</p>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#ad5945]/10">
          <p className="text-sm text-gray-600 font-medium mb-1 font-inter">Moyenne quotidienne</p>
          <p className="text-lg font-bold text-[#ad5945] font-playfair">{Math.round(totalViews / 7).toLocaleString()} vues/jour</p>
        </div>
      </div>

      {/* Conteneur principal du graphique */}
      <div className="flex flex-col">
        {/* Graphique Rumble Charts */}
        <div className="h-64 px-4 mb-4">
          <Chart 
            width={800} 
            height={250} 
            series={chartData.series}
            minY={0}
          >
            <Layer width="90%" height="85%" position="middle center">
              {/* Grille de fond */}
              <Ticks 
                axis="y"
                ticks={{ maxTicks: 6 }}
                lineLength="100%"
                lineStyle={{ 
                  stroke: '#e2e8f0', 
                  strokeWidth: 1,
                  strokeDasharray: '4 2'
                }}
                labelStyle={{
                  fill: '#64748b',
                  fontSize: 11,
                  fontWeight: '600',
                  textAnchor: 'end',
                  fontFamily: 'Inter, sans-serif'
                }}
                labelAttributes={{ dx: -10 }}
              />
              
              {/* Barres avec effet de brillance */}
              <Bars
                innerPadding={15}
                groupPadding={20}
                barStyle={{
                  fill: 'url(#barGradient)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  stroke: 'url(#barBorder)',
                  strokeWidth: 1
                }}
                barAttributes={({ pointIndex }: { pointIndex: number }) => ({
                  onMouseOver: (e: any) => {
                    if (selectedIndex === null || selectedIndex === pointIndex) {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'scaleY(1.05)';
                      e.target.style.transformOrigin = 'bottom';
                    }
                  },
                  onMouseOut: (e: any) => {
                    if (selectedIndex === null || selectedIndex === pointIndex) {
                      e.target.style.opacity = selectedIndex !== null && selectedIndex !== pointIndex ? '0.4' : '1';
                      e.target.style.transform = 'scaleY(1)';
                    }
                  },
                  onClick: () => setSelectedIndex(selectedIndex === pointIndex ? null : pointIndex),
                  style: {
                    opacity: selectedIndex !== null && selectedIndex !== pointIndex ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                    transformOrigin: 'bottom'
                  }
                })}
              />
              
              {/* Définition des gradients */}
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ad5945" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#d38074" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ca715b" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="barBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d38074" />
                  <stop offset="100%" stopColor="#ad5945" />
                </linearGradient>
              </defs>

              {/* Étiquettes de valeurs au-dessus des barres */}
              <Labels
                label={({ seriesIndex, pointIndex, y }) => {
                  if (selectedIndex !== null && selectedIndex !== pointIndex) return '';
                  const value = last7Days[pointIndex]?.views;
                  return value > 0 || selectedIndex === pointIndex ? value?.toString() || '0' : '';
                }}
                labelAttributes={{
                  y: -15,
                  fill: '#374151',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAnchor: 'middle',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </Layer>
          </Chart>
        </div>

        {/* Légende horizontale PARFAITEMENT alignée */}
        <div className="px-4">
          <div className="flex justify-between items-start" style={{ 
            marginLeft: '5%', 
            marginRight: '5%',
            gap: '2%'
          }}>
            {last7Days.map((day, index) => {
              const isPeak = day.views === maxViews;
              const isSelected = selectedIndex === index;
              const barWidth = 88 / last7Days.length; // Ajusté pour mieux s'aligner
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center transition-all duration-300 cursor-pointer"
                  style={{ width: `${barWidth}%` }}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                >
                  {/* Carte de légende compacte */}
                  <div 
                    className={`p-3 rounded-xl text-center w-full min-w-0 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#ad5945] to-[#d38074] text-white shadow-lg scale-110 -translate-y-2'
                        : isPeak 
                          ? 'bg-gradient-to-br from-[#ad5945]/10 to-[#d38074]/10 border-2 border-[#ad5945]/30 shadow-md' 
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    } ${selectedIndex !== null && !isSelected ? 'opacity-40' : 'opacity-100'}`}
                  >
                    {/* Nom du jour */}
                    <div className={`text-xs font-medium mb-1 font-inter uppercase ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {new Date(day.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short'
                      })}
                    </div>
                    
                    {/* Date complète */}
                    <div className={`text-[10px] mb-1 font-inter ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                      {new Date(day.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </div>
                    
                    {/* Nombre de vues */}
                    <div className={`text-sm font-bold font-playfair ${
                      isSelected ? 'text-white' : isPeak ? 'text-[#ad5945]' : 'text-gray-700'
                    }`}>
                      {day.views.toLocaleString()}
                    </div>
                    
                    {/* Indicateur de pic ou sélection */}
                    {(isPeak || isSelected) && (
                      <div className={`text-[10px] px-1 py-0.5 rounded-full font-bold mt-1 font-inter ${
                        isSelected ? 'bg-white text-[#ad5945]' : 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white'
                      }`}>
                        {isSelected ? 'Vues' : 'PIC'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour le graphique des pages avec Rumble Charts
interface PageViewsChartProps {
  data: Array<{ page_name: string; views: number }>;
  loading: boolean;
}

function PageViewsChart({ data, loading }: PageViewsChartProps) {
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

  const sortedData = [...data].sort((a, b) => b.views - a.views).slice(0, 5);
  const maxViews = Math.max(...sortedData.map(page => page.views));

  const chartData = {
    series: [{
      data: sortedData.map(page => page.views)
    }]
  };

  return (
    <div className="w-full">
      <Chart 
        width={500} 
        height={280} 
        series={chartData.series}
        minY={0}
      >
        <Transform method={['transpose']}>
          <Layer width="85%" height="80%">
            {/* Grille de fond */}
            <Ticks 
              axis="y"
              ticks={{ maxTicks: 5 }}
              lineLength="100%"
              lineStyle={{ 
                stroke: '#f1f5f9', 
                strokeWidth: 1
              }}
            />
            
            {/* Barres horizontales avec gradient */}
            <Bars
              innerPadding={20}
              barStyle={{
                fill: 'url(#pageGradient)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                rx: 8
              }}
              barAttributes={{
                onMouseOver: (e: any) => {
                  e.target.style.opacity = '0.8';
                  e.target.style.transform = 'scale(1.02)';
                },
                onMouseOut: (e: any) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            />
            
            {/* Définition des gradients */}
            <defs>
              <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Étiquettes des valeurs */}
            <Labels
              label={({ seriesIndex, pointIndex, x }) => {
                const value = sortedData[pointIndex]?.views;
                return value > 0 ? value.toString() : '';
              }}
              labelAttributes={{
                x: 10,
                fill: '#ffffff',
                fontSize: 11,
                fontWeight: 'bold',
                textAnchor: 'start'
              }}
            />

            {/* Étiquettes des noms de pages */}
            <Labels
              label={({ seriesIndex, pointIndex }) => {
                return sortedData[pointIndex]?.page_name || '';
              }}
              labelAttributes={{
                x: -10,
                fill: '#374151',
                fontSize: 12,
                fontWeight: '600',
                textAnchor: 'end'
              }}
            />
          </Layer>
        </Transform>
      </Chart>

      {/* Légende détaillée */}
      <div className="mt-6 space-y-3">
        {sortedData.map((page, index) => {
          const percentage = maxViews > 0 ? (page.views / maxViews) * 100 : 0;
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-800 font-semibold block capitalize text-sm">
                    {page.page_name}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 block">
                  {page.views.toLocaleString()}
                </span>
                <p className="text-xs text-gray-600">{Math.round(percentage)}% du max</p>
              </div>
            </div>
          );
        })}
      </div>
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

// Composants StatCard et QuickActionButton
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

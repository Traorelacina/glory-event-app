import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuthStore } from '../../store/AuthStore';
import { Search, Loader, AlertCircle, Eye, Package, X, Check, Clock, Truck, XCircle, Sparkles, Star, ArrowRight, Users, TrendingUp } from 'lucide-react';

interface Produit {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Commande {
  id: number;
  numero?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  total: number;
  status?: string;
  created_at: string;
  produits?: Produit[];
}

// API URLs
const API_URL = 'http://127.0.0.1:8000/api';
const STORAGE_URL = 'http://127.0.0.1:8000/storage';

export default function AdminCommandesPage() {
  const { token } = useAuthStore();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchCommandes();
  }, [token]);

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
  }, [commandes]);

  const fetchCommandes = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/commandes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      console.log('Données commandes:', data);
      setCommandes(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommandeDetails = async (id: number) => {
    if (!token) return;
    try {
      setUpdateError(null);
      const response = await fetch(`${API_URL}/admin/commandes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement des détails');

      const data = await response.json();
      console.log('Détails commande:', data);
      setSelectedCommande(data.data || data);
      setIsModalOpen(true);
    } catch (err: any) {
      setUpdateError(err.message);
    }
  };

  const updateCommandeStatus = async (id: number, newStatus: string) => {
    if (!token) return;
    try {
      setIsUpdating(true);
      setUpdateError(null);

      const response = await fetch(`${API_URL}/admin/commandes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      const data = await response.json();
      
      setCommandes(prev => 
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );

      if (selectedCommande) {
        setSelectedCommande({ ...selectedCommande, status: newStatus });
      }

      setUpdateError(null);
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${STORAGE_URL}/${imagePath}`;
  };

  const getFallbackImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'livree':
      case 'livré':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-400';
      case 'en_cours':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-400';
      case 'en_attente':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-2 border-yellow-400';
      case 'annulee':
      case 'annulée':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-400';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-2 border-gray-400';
    }
  };

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      livree: 'Livrée',
      en_cours: 'En cours',
      en_attente: 'En attente',
      annulee: 'Annulée',
    };
    return labels[statut] || statut || 'N/A';
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'livree':
      case 'livré':
        return <Check size={20} />;
      case 'en_cours':
        return <Truck size={20} />;
      case 'en_attente':
        return <Clock size={20} />;
      case 'annulee':
      case 'annulée':
        return <XCircle size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const filteredCommandes = commandes.filter((c) => {
    const numero = c.numero || c.id?.toString() || '';
    const client = c.client_name || '';
    const email = c.client_email || '';
    const statut = c.status || 'en_attente';

    const matchesSearch = 
      numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut = !filterStatut || statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

  const statuts = Array.from(
    new Set(commandes.map((c) => c.status || 'en_attente'))
  );

  // Statistiques pour le header
  const stats = {
    total: commandes.length,
    enAttente: commandes.filter(c => (c.status || 'en_attente') === 'en_attente').length,
    enCours: commandes.filter(c => c.status === 'en_cours').length,
    livree: commandes.filter(c => c.status === 'livree' || c.status === 'livré').length,
    totalCA: commandes.reduce((sum, c) => sum + (Number(c.total) || 0), 0)
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-900 overflow-x-hidden">
        <div className="space-y-6 p-6">
          {/* Hero Header Section */}
          <section className="relative mb-8 overflow-hidden rounded-3xl">
            {/* Background animé avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700">
              <div className="absolute inset-0 opacity-30">
                <div 
                  className="absolute top-10 left-10 w-72 h-72 bg-pink-500/50 rounded-full blur-3xl"
                  style={{ animation: 'float 8s ease-in-out infinite' }}
                ></div>
                <div 
                  className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/50 rounded-full blur-3xl"
                  style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }}
                ></div>
              </div>
            </div>

            {/* Contenu du header */}
            <div className="relative z-10 p-8 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div 
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4"
                    style={{ animation: 'slideDown 0.8s ease-out' }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Gestion Commandes</span>
                  </div>
                  
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3"
                    style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
                  >
                    <Package size={40} />
                    Commandes Clients
                  </h1>
                  <p 
                    className="text-purple-100 text-lg md:text-xl"
                    style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
                  >
                    {stats.total} commande{stats.total > 1 ? 's' : ''} au total
                  </p>
                </div>
                
                <div className="mt-6 lg:mt-0 grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <p className="text-purple-100 text-sm mb-1">En attente</p>
                    <p className="text-2xl font-bold text-white">{stats.enAttente}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                    <p className="text-purple-100 text-sm mb-1">Total CA</p>
                    <p className="text-xl font-bold text-white">
                      {Number(stats.totalCA).toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div 
              className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl shadow-xl flex gap-4"
              style={{ animation: 'slideInLeft 0.6s ease-out' }}
            >
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <p className="text-red-900 font-bold text-lg mb-1">Erreur</p>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Filtres */}
          <div 
            id="filters-section"
            data-animate
            className="bg-white rounded-3xl shadow-xl p-6 border-2 border-purple-200"
            style={{
              opacity: isVisible['filters-section'] ? 1 : 0,
              transform: isVisible['filters-section'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, client ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-lg"
                />
              </div>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-4 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-medium shadow-lg"
              >
                <option value="">Tous les statuts</option>
                {statuts.map((statut) => (
                  <option key={statut} value={statut}>
                    {getStatutLabel(statut)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div 
              id="loading-section"
              data-animate
              className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border-2 border-purple-100"
              style={{
                opacity: isVisible['loading-section'] ? 1 : 0,
                transform: isVisible['loading-section'] ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.6s ease-out',
              }}
            >
              <Loader className="animate-spin text-purple-600 mb-6" size={60} />
              <p className="text-gray-700 font-medium text-lg">Chargement des commandes...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
            </div>
          ) : filteredCommandes.length > 0 ? (
            <div 
              id="commandes-table"
              data-animate
              className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden"
              style={{
                opacity: isVisible['commandes-table'] ? 1 : 0,
                transform: isVisible['commandes-table'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">N° Commande</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Client</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCommandes.map((commande, index) => (
                      <tr 
                        key={commande.id} 
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                        style={{
                          animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <td className="px-6 py-4 font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                          #{commande.numero || commande.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-800 font-semibold group-hover:text-purple-700 transition-colors">
                              {commande.client_name || 'N/A'}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {commande.client_email || 'N/A'}
                            </p>
                            {commande.client_phone && (
                              <p className="text-gray-500 text-xs mt-1">
                                📞 {commande.client_phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">
                            {Number(commande.total || 0).toLocaleString('fr-FR')} FCFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatutColor(commande.status || 'en_attente')}`}>
                            {getStatutIcon(commande.status || 'en_attente')}
                            {getStatutLabel(commande.status || 'en_attente')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                          {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => fetchCommandeDetails(commande.id)}
                            className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                            <Eye className="relative z-10" size={18} />
                            <span className="relative z-10">Voir</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border-2 border-purple-100">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Package className="text-purple-400" size={48} />
              </div>
              <p className="text-gray-700 font-bold text-xl mb-2">Aucune commande trouvée</p>
              <p className="text-gray-500">
                {searchTerm || filterStatut 
                  ? 'Essayez de modifier vos filtres de recherche' 
                  : 'Les commandes apparaîtront ici'}
              </p>
            </div>
          )}
        </div>
{isModalOpen && selectedCommande && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto pt-20">
    <div 
      className="bg-white rounded-3xl w-full max-w-2xl mx-auto overflow-hidden shadow-2xl my-4 relative border-2 border-purple-200 max-h-[85vh] overflow-y-auto"
      style={{ animation: 'scaleIn 0.3s ease-out' }}
    >
      {/* Bouton fermeture */}
      <button
        onClick={() => {
          setIsModalOpen(false);
          setSelectedCommande(null);
          setUpdateError(null);
        }}
        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-gray-700 hover:text-black transition z-10 shadow-lg hover:scale-110"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sm:p-8 sticky top-0 z-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Commande #{selectedCommande.numero || selectedCommande.id}
            </h2>
            <p className="text-purple-100 text-sm">
              {new Date(selectedCommande.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {updateError && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-800 text-sm flex-1">{updateError}</p>
            <button 
              onClick={() => setUpdateError(null)}
              className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Informations client */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="text-purple-600" size={20} />
            Informations client
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Nom</p>
              <p className="text-gray-900 font-bold text-sm">{selectedCommande.client_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Email</p>
              <p className="text-gray-900 font-bold text-sm break-all">{selectedCommande.client_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Téléphone</p>
              <p className="text-gray-900 font-bold text-sm">{selectedCommande.client_phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Statut actuel</p>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatutColor(selectedCommande.status || 'en_attente')}`}>
                {getStatutIcon(selectedCommande.status || 'en_attente')}
                {getStatutLabel(selectedCommande.status || 'en_attente')}
              </span>
            </div>
          </div>
        </div>

        {/* Produits commandés */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={20} />
            Produits commandés
          </h3>
          <div className="space-y-3">
            {selectedCommande.produits && selectedCommande.produits.length > 0 ? (
              selectedCommande.produits.map((produit) => (
                <div key={produit.id} className="flex items-start gap-4 bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-all duration-300">
                  <img
                    src={getImageUrl(produit.image)}
                    alt={produit.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = getFallbackImage();
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-base truncate">{produit.name}</h4>
                    <p className="text-gray-600 text-sm">Quantité: {produit.quantity}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-xs text-gray-600">Prix unitaire</p>
                        <p className="font-bold text-purple-600 text-sm">
                          {Number(produit.price).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Sous-total</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {Number(produit.price * produit.quantity).toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 text-sm bg-gray-50 rounded-2xl">Aucun produit disponible</p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total de la commande</span>
            <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {Number(selectedCommande.total || 0).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>

        {/* Actions de changement de statut */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            Changer le statut
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { status: 'en_attente', icon: Clock, label: 'En attente', color: 'yellow' },
              { status: 'en_cours', icon: Truck, label: 'En cours', color: 'blue' },
              { status: 'livree', icon: Check, label: 'Livrée', color: 'green' },
              { status: 'annulee', icon: XCircle, label: 'Annulée', color: 'red' }
            ].map(({ status, icon: Icon, label, color }) => (
              <button
                key={status}
                onClick={() => updateCommandeStatus(selectedCommande.id, status)}
                disabled={isUpdating || selectedCommande.status === status}
                className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl font-medium text-xs transition-all duration-300 overflow-hidden ${
                  selectedCommande.status === status
                    ? `bg-${color}-100 text-${color}-700 border-2 border-${color}-400 cursor-not-allowed`
                    : `bg-white border-2 border-${color}-400 text-${color}-700 hover:bg-${color}-50 hover:scale-105`
                } disabled:opacity-50`}
              >
                <span className={`absolute inset-0 bg-${color}-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10`}></span>
                <Icon className="relative z-10" size={20} />
                <span className="relative z-10 font-semibold">{label}</span>
              </button>
            ))}
          </div>
          {isUpdating && (
            <div className="flex items-center justify-center gap-3 mt-4 text-purple-600 text-sm font-semibold">
              <Loader className="animate-spin" size={18} />
              <span>Mise à jour du statut...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
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
      `}</style>
    </AdminLayout>
  );
}

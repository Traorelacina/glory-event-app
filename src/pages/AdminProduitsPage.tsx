import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuthStore } from '../../store/AuthStore';
import { Plus, Search, Trash2, Edit, Loader, AlertCircle, Package, Upload, X, Sparkles, Star, Save } from 'lucide-react';

interface Produit {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

// API URL - URL DE PRODUCTION FIXE
const API_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';
const STORAGE_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/storage';

export default function AdminProduitsPage() {
  const { token } = useAuthStore();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    in_stock: true,
    featured: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchProduits();
  }, [token]);

  // Configuration de l'Intersection Observer
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

    // Observer les éléments existants
    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Observer les nouveaux éléments quand showForm change
  useEffect(() => {
    if (showForm && observerRef.current) {
      // Réobserver tous les éléments après un court délai pour que le DOM soit mis à jour
      setTimeout(() => {
        document.querySelectorAll('[data-animate]').forEach((el) => {
          if (observerRef.current) {
            observerRef.current.observe(el);
          }
        });
      }, 100);
    }
  }, [showForm, produits]);

  const fetchProduits = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/produits`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProduits(data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 2MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Format d\'image non supporté. Utilisez JPEG, PNG, GIF ou WebP.');
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (produit: Produit) => {
    setEditingProduct(produit);
    setFormData({
      name: produit.name,
      description: produit.description,
      price: produit.price.toString(),
      category: produit.category,
      in_stock: produit.in_stock,
      featured: produit.featured,
    });
    setImagePreview(`${STORAGE_URL}/${produit.image}`);
    setSelectedImage(null);
    setShowForm(true);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
    resetForm();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token d\'authentification manquant');
      return;
    }

    if (!selectedImage && !editingProduct) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('in_stock', formData.in_stock ? '1' : '0');
      formDataToSend.append('featured', formData.featured ? '1' : '0');
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const url = editingProduct 
        ? `${API_URL}/admin/produits/${editingProduct.id}`
        : `${API_URL}/admin/produits`;

      // Toujours utiliser POST
      const method = 'POST';

      // Pour la mise à jour, ajouter _method
      if (editingProduct) {
        formDataToSend.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 300));
        throw new Error('Le serveur a retourné une réponse invalide. Vérifiez que la route API est correcte.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      console.log('Product saved:', data);

      if (editingProduct) {
        setProduits(prev => prev.map(p => p.id === editingProduct.id ? data.data : p));
      } else {
        setProduits(prev => [data.data, ...prev]);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      setError(null);
      
    } catch (err: any) {
      console.error('Save product error:', err);
      setError(err.message || `Erreur lors de ${editingProduct ? 'la modification' : 'la création'} du produit`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      in_stock: true,
      featured: false,
    });
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression?')) return;
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/produits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      setProduits(produits.filter((p) => p.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredProduits = produits.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-900 overflow-x-hidden">
        <div className="space-y-6 p-6">
          {/* Hero Header Section */}
          <section className="relative mb-8 overflow-hidden rounded-3xl">
            {/* Background animé avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700">
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
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div 
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4"
                    style={{ animation: 'slideDown 0.8s ease-out' }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Gestion Boutique</span>
                  </div>
                  
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3"
                    style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
                  >
                    <Package size={40} />
                    Gestion Produits
                  </h1>
                  <p 
                    className="text-purple-100 text-lg md:text-xl"
                    style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
                  >
                    {produits.length} produit{produits.length > 1 ? 's' : ''} dans votre catalogue
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingProduct(null);
                    if (showForm) resetForm();
                  }}
                  className="group relative bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center gap-3 overflow-hidden font-semibold hover:scale-105"
                  style={{ animation: 'fadeInUp 1s ease-out 0.6s both' }}
                >
                  <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <Plus className="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" size={20} />
                  <span className="relative z-10">{showForm ? 'Annuler' : 'Ajouter produit'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Error Message */}
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

          {/* Formulaire d'ajout/modification */}
          {showForm && (
            <div 
              className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200 relative overflow-hidden animate-in fade-in duration-500"
            >
              {/* Background décoratif subtil */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl opacity-60 -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                    </h2>
                    {editingProduct && (
                      <p className="text-gray-600 mt-1">Modification de "{editingProduct.name}"</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  {/* Upload d'image */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Image du produit {!editingProduct && <span className="text-red-500">*</span>}
                    </label>
                    <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 bg-white">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="max-h-64 rounded-2xl shadow-2xl"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-2 hover:scale-110 transition-transform shadow-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="text-purple-600" size={40} />
                          </div>
                          <p className="text-gray-700 font-semibold mb-2">Cliquez pour sélectionner une image</p>
                          <p className="text-sm text-gray-500">JPEG, PNG, GIF, WebP - Max 2MB</p>
                          {editingProduct && (
                            <p className="text-sm text-purple-600 mt-2">
                              Laissez vide pour conserver l'image actuelle
                            </p>
                          )}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        {imagePreview ? 'Changer l\'image' : 'Sélectionner une image'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom du produit <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Nom du produit"
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" 
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Prix (FCFA) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        placeholder="Prix"
                        value={formData.price} 
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" 
                        min="0"
                        step="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Catégorie"
                        value={formData.category} 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" 
                        required
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-8">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={formData.in_stock}
                          onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">En stock</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">En vedette</span>
                      </label>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        placeholder="Description du produit"
                        value={formData.description} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none" 
                        rows={4} 
                        required
                      />
                    </div>

                    <div className="col-span-2 flex gap-4">
                      <button
                        type="submit"
                        disabled={(!selectedImage && !editingProduct) || submitting}
                        className="group relative flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden hover:-translate-y-0.5"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                        {submitting ? (
                          <>
                            <Loader className="relative z-10 animate-spin" size={20} />
                            <span className="relative z-10">
                              {editingProduct ? 'Modification...' : 'Création...'}
                            </span>
                          </>
                        ) : (
                          <>
                            {editingProduct ? (
                              <>
                                <Save className="relative z-10" size={20} />
                                <span className="relative z-10">Modifier le produit</span>
                              </>
                            ) : (
                              <>
                                <Plus className="relative z-10" size={20} />
                                <span className="relative z-10">Créer le produit</span>
                              </>
                            )}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Recherche */}
          <div 
            id="search-section"
            data-animate
            className="relative"
          >
            <Search className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-lg"
            />
          </div>

          {/* Liste des produits */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-2xl border-2 border-purple-100">
              <Loader className="animate-spin text-purple-600 mb-4" size={60} />
              <p className="text-gray-700 font-semibold text-lg">Chargement des produits...</p>
              <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
            </div>
          ) : filteredProduits.length > 0 ? (
            <div 
              id="products-table"
              data-animate
              className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Prix</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Créé</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProduits.map((produit, index) => (
                      <tr 
                        key={produit.id} 
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4">
                          <div className="relative group">
                            <img 
                              src={`${STORAGE_URL}/${produit.image}`} 
                              alt={produit.name}
                              className="w-20 h-20 object-cover rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            {produit.featured && (
                              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1.5 shadow-lg">
                                <Star className="w-3 h-3 text-white fill-white" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-bold">{produit.name}</p>
                          <p className="text-gray-500 text-sm line-clamp-1">{produit.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold">
                            {Number(produit.price).toFixed(0)} FCFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold">
                            {produit.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            produit.in_stock 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                          }`}>
                            {produit.in_stock ? 'En stock' : 'Rupture'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                          {new Date(produit.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit(produit)}
                              className="group p-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-300 text-blue-600 hover:scale-110 hover:shadow-md"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(produit.id)}
                              className="group p-2.5 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 text-red-600 hover:scale-110 hover:shadow-md"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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
              <p className="text-gray-700 font-bold text-xl mb-2">Aucun produit trouvé</p>
              {searchTerm ? (
                <p className="text-gray-500">Essayez avec un autre terme de recherche</p>
              ) : (
                <p className="text-gray-500">Commencez par ajouter votre premier produit</p>
              )}
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
        `}</style>
      </div>
    </AdminLayout>
  );
}

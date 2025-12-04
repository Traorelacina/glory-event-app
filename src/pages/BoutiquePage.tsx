import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Loader, AlertCircle, Eye } from "lucide-react";
import { useCartStore, Product } from "../store/cartStore";
import ProductDetailModal from "../components/ProductDetailModal";
import Footer from "../components/Footer";

interface BoutiquePageProps {
  onNavigate: (page: string) => void;
}

// API URL - URL DE PRODUCTION FIXE
const API_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';
const STORAGE_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/storage';

export default function BoutiquePage({ onNavigate }: BoutiquePageProps) {
  const { addItem, getTotalItems } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching products from:', `${API_URL}/produits`);
      
      const response = await fetch(`${API_URL}/produits`);
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Received data:', data);
      
      // Deux formats possibles de réponse :
      // 1. Laravel API Resource: { data: [...] }
      // 2. Simple array: [...]
      if (data.data) {
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur de connexion au serveur';
      setError(errorMessage);
      console.error('❌ Erreur:', err);
      
      // Fallback: Données fictives en cas d'échec
      if (products.length === 0) {
        console.log('Using fallback data');
        setProducts(getFallbackProducts());
      }
    } finally {
      setLoading(false);
    }
  };

  // Données de fallback si l'API échoue
  const getFallbackProducts = (): Product[] => {
    return [
      {
        id: 1,
        name: "Parfum d'Exception",
        description: "Une fragrance unique et envoûtante",
        price: 29900,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
        category: "Signature",
        in_stock: true,
        featured: true,
        slug: "parfum-exception"
      },
      {
        id: 2,
        name: "Élixir de Nuit",
        description: "Pour les soirées mémorables",
        price: 34900,
        image: "https://images.unsplash.com/photo-1590736969954-61b6b9706f99?w-400&h=400&fit=crop",
        category: "Nocturne",
        in_stock: true,
        featured: false,
        slug: "elixir-nuit"
      },
      {
        id: 3,
        name: "Essence du Matin",
        description: "Fraîcheur et vitalité au quotidien",
        price: 24900,
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop",
        category: "Jour",
        in_stock: true,
        featured: true,
        slug: "essence-matin"
      },
      {
        id: 4,
        name: "Mystère Oriental",
        description: "Notes épicées et boisées",
        price: 39900,
        image: "https://images.unsplash.com/photo-1590736969954-61b6b9706f99?w=400&h=400&fit=crop",
        category: "Oriental",
        in_stock: true,
        featured: false,
        slug: "mystere-oriental"
      }
    ];
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Nettoyer le chemin si nécessaire
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${STORAGE_URL}/${cleanPath}`;
  };

  const getFallbackImage = () => {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Non Disponible%3C/text%3E%3C/svg%3E';
  };

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(
    (p) => selectedCategory === "Tous" || p.category === selectedCategory
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="min-h-screen pt-32 pb-12 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] mb-6">
              Boutique Parfums
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre collection exclusive de fragrances d'exception
            </p>

            {/* Points décoratifs */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }}></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }}></div>
            </div>

            {/* CATEGORIES */}
            <div className="mt-12 flex justify-center gap-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full font-medium transition-all transform hover:-translate-y-1 ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white shadow-lg shadow-[#ad5945]/30"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ERREUR */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-4 shadow-sm">
              <AlertCircle className="text-red-600 flex-shrink-0" size={28} />
              <div className="flex-1">
                <p className="text-red-800 font-semibold text-lg">{error}</p>
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                  <button 
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Masquer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Loader className="animate-spin text-white" size={32} />
              </div>
              <p className="text-gray-600 font-medium text-xl">Chargement des produits...</p>
              <p className="text-gray-400 text-sm mt-2">API: {API_URL}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingCart className="text-white" size={40} />
              </div>
              <p className="text-gray-700 font-semibold text-2xl mb-3">Aucun produit disponible</p>
              <p className="text-gray-500 text-lg mb-6">
                {selectedCategory !== "Tous" 
                  ? `Aucun produit dans la catégorie "${selectedCategory}"`
                  : "Vérifiez votre connexion ou contactez l'administrateur"
                }
              </p>
              <button
                onClick={() => setSelectedCategory("Tous")}
                className="px-6 py-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <>
              

              {/* GRID PRODUITS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group border border-slate-100"
                  >
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = getFallbackImage();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          ⭐ Vedette
                        </div>
                      )}

                      {!product.in_stock && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Rupture
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block bg-gradient-to-r from-[#ad5945]/10 to-[#d38074]/10 text-[#ad5945] px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border border-[#ad5945]/20">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#ad5945] to-[#d38074] bg-clip-text text-transparent">
                          {Number(product.price).toLocaleString('fr-FR')} FCFA
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.in_stock}
                          className={`p-3 rounded-full transform transition-all shadow-lg ${
                            product.in_stock
                              ? 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white hover:shadow-xl hover:scale-110 active:scale-95 hover:shadow-[#ad5945]/30'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* BOUTON DÉTAIL */}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-md border border-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* SECTION APPEL À L'ACTION */}
              <div className="bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-3xl p-12 text-white text-center relative overflow-hidden mb-16">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                    Des questions sur nos parfums ?
                  </h3>
                  <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                    Notre équipe d'experts est là pour vous conseiller et vous aider à trouver la fragrance parfaite
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => onNavigate('contact')}
                      className="bg-white text-[#ad5945] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Nous contacter
                    </button>
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      Voir le haut
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* MODAL PRODUIT */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          getImageUrl={getImageUrl}
          getFallbackImage={getFallbackImage}
        />
      </div>

      {/* FOOTER */}
      <Footer onNavigate={onNavigate} />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

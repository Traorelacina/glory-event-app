// components/ProductDetailModal.tsx
import { X, ShoppingCart } from "lucide-react";
import { Product } from "../store/cartStore";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  getImageUrl: (imagePath: string) => string;
  getFallbackImage: () => string;
}

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  getImageUrl, 
  getFallbackImage 
}: ProductDetailModalProps) {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl mx-auto overflow-hidden shadow-2xl my-8 relative border border-slate-100">
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full text-gray-600 hover:text-[#ad5945] hover:bg-white transition-all z-20 shadow-xl hover:scale-110 transform border border-slate-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section - TAILLE OPTIMISÉE */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-10 flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain rounded-2xl shadow-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getFallbackImage();
                }}
              />
              {product.featured && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg rotate-12 transform">
                  ⭐ Vedette
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex-1">
              <div className="mb-3">
                <span className="inline-block bg-gradient-to-r from-[#ad5945]/10 to-[#d38074]/10 text-[#ad5945] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#ad5945]/20">
                  {product.category}
                </span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                {product.name}
              </h2>
              
              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#ad5945] to-[#d38074] bg-clip-text text-transparent">
                  {Number(product.price).toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-medium w-28">Disponibilité:</span>
                  <span className={`font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? '✅ En stock' : '❌ Rupture de stock'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-medium w-28">Référence:</span>
                  <span className="text-gray-700 font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">{product.slug}</span>
                </div>
                {product.in_stock && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium w-28">Livraison:</span>
                    <span className="text-green-600 font-semibold">🕐 Livraison rapide disponible</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transform transition-all duration-300 ${
                product.in_stock
                  ? 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white hover:shadow-2xl hover:scale-105 active:scale-95 hover:shadow-[#ad5945]/30'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
              }`}
            >
              {product.in_stock ? (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </span>
              ) : (
                'Produit indisponible'
              )}
            </button>

            {/* Informations supplémentaires */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                💎 Produit de haute qualité • 🚚 Livraison gratuite • 🔄 Retour facile
              </p>
            </div>
          </div>
        </div>

        {/* Points décoratifs */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
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
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto overflow-hidden shadow-2xl my-4 relative border border-slate-100">
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-[#ad5945] hover:bg-white transition-all z-20 shadow-lg hover:scale-110 transform border border-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section - OPTIMISÉE */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
            <div className="relative w-full max-w-xs">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-auto max-h-64 object-contain rounded-xl shadow-md"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = getFallbackImage();
                }}
              />
              {product.featured && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md rotate-12 transform">
                  ⭐ Vedette
                </div>
              )}
            </div>
          </div>

          {/* Content Section - OPTIMISÉE */}
          <div className="p-6 flex flex-col">
            <div className="flex-1">
              <div className="mb-2">
                <span className="inline-block bg-gradient-to-r from-[#ad5945]/10 to-[#d38074]/10 text-[#ad5945] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-[#ad5945]/20">
                  {product.category}
                </span>
              </div>
              
              <h2 className="font-serif text-xl font-bold mb-3 text-gray-900 leading-tight">
                {product.name}
              </h2>
              
              <div className="mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#ad5945] to-[#d38074] bg-clip-text text-transparent">
                  {Number(product.price).toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                  {product.description}
                </p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-20">Stock:</span>
                  <span className={`text-sm font-semibold ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.in_stock ? '✅ En stock' : '❌ Rupture'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-20">Réf:</span>
                  <span className="text-gray-700 font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 truncate">
                    {product.slug}
                  </span>
                </div>
                {product.in_stock && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-20">Livraison:</span>
                    <span className="text-green-600 text-sm font-semibold">🕐 Rapide</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`w-full py-3 rounded-xl font-semibold text-base shadow-lg transform transition-all duration-300 ${
                product.in_stock
                  ? 'bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white hover:shadow-xl hover:scale-105 active:scale-95 hover:shadow-[#ad5945]/30'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
              }`}
            >
              {product.in_stock ? (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au panier
                </span>
              ) : (
                'Produit indisponible'
              )}
            </button>

            {/* Informations supplémentaires */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                💎 Qualité premium • 🚚 Livraison offerte
              </p>
            </div>
          </div>
        </div>

        {/* Points décoratifs réduits */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
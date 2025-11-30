import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import logo from '../images/logo_event.jpg';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Accueil', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Galerie', page: 'gallery' },
    { label: 'Boutique', page: 'boutique' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <>
      {/* Header toujours visible et fixe */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' 
            : 'bg-white/90 backdrop-blur-sm py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 group"
            >
              <div className="relative w-12 h-12 transform transition-transform group-hover:scale-110">
                <img
                  src={logo}
                  alt="Events Prestige Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-12 h-12 bg-gradient-to-br from-[#ad5945] to-[#d38074] rounded-lg flex items-center justify-center shadow-lg';
                    fallback.innerHTML = '<span class="text-white font-bold text-lg">EP</span>';
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
              </div>
              <span className="font-serif text-xl font-bold text-[#111827]">
               Glory Events 
              </span>
            </button>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`transition-all duration-300 font-medium relative group ${
                    currentPage === item.page
                      ? 'text-[#ad5945] font-semibold'
                      : 'text-[#111827] hover:text-[#ad5945]'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ad5945] to-[#d38074] transform transition-all duration-300"></span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#ad5945] to-[#d38074] transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              
              {/* Bouton panier */}
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 rounded-lg transition-all duration-300 text-[#111827] hover:bg-gray-100 hover:scale-110 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:text-[#ad5945] transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {/* Bouton devis */}
              <button
                onClick={() => onNavigate('contact')}
                className="bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-6 py-2 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#ad5945]/30"
              >
                Demander un devis
              </button>
            </nav>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#111827] p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Menu mobile */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4">
              <nav className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200 py-2">
                {navItems.map((item) => (
                  <button
                    key={item.page} 
                    onClick={() => {
                      onNavigate(item.page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 transition-all duration-200 group ${
                      currentPage === item.page
                        ? 'text-[#ad5945] bg-gradient-to-r from-[#ad5945]/10 to-[#d38074]/10 font-semibold border-r-2 border-[#ad5945]'
                        : 'text-[#111827] hover:bg-gray-50 hover:pl-6 hover:text-[#ad5945]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] opacity-0 group-hover:opacity-100 transition-opacity ${
                        currentPage === item.page ? 'opacity-100' : ''
                      }`}></span>
                      {item.label}
                    </span>
                  </button>
                ))}
                
                {/* Panier mobile */}
                <button
                  onClick={() => {
                    onNavigate('cart');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-[#111827] hover:bg-gray-50 transition-all duration-200 hover:pl-6 hover:text-[#ad5945] group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Panier
                  </span>
                  {totalItems > 0 && (
                    <span className="bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-md">
                      {totalItems}
                    </span>
                  )}
                </button>
                
                {/* Devis mobile */}
                <div className="px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onNavigate('contact');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white px-6 py-3 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-center shadow-lg"
                  >
                    Demander un devis
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Espace réservé avec hauteur dynamique selon le scroll */}
      <div 
        className={`transition-all duration-300 ${
          isScrolled ? 'h-20' : 'h-24'
        }`}
      ></div>
    </>
  );
}
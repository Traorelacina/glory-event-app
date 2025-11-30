import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import { LogOut, Home, Box, ShoppingCart, Mail, Image, Briefcase, Menu, X, Sparkles, User, Crown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/produits', label: 'Produits', icon: Box },
    { path: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
    { path: '/admin/contacts', label: 'Contacts', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-purple-200/30' 
          : 'bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-purple-900/95 backdrop-blur-xl'
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Titre */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="text-white" size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-purple-200 text-xs font-medium">Premium Edition</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`group relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all duration-300 overflow-hidden ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
                <Icon className="relative z-10 group-hover:scale-110 transition-transform" size={18} />
                <span className="relative z-10">{label}</span>
                
                {isActive(path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                )}
              </Link>
            ))}
          </div>

          {/* User Info et Déconnexion */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <User className="text-white" size={16} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{admin?.name}</p>
                  <p className="text-purple-200 text-xs">{admin?.role_label}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 border border-white/30 backdrop-blur-sm group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <LogOut className="relative z-10 group-hover:rotate-180 transition-transform" size={18} />
              <span className="relative z-10">Déconnexion</span>
            </button>

            {/* Menu Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-300 group"
            >
              {isOpen ? (
                <X className="text-white group-hover:scale-110 transition-transform" size={24} />
              ) : (
                <Menu className="text-white group-hover:scale-110 transition-transform" size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div 
            className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300"
            style={{ animation: 'slideDown 0.3s ease-out' }}
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`group relative block px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all duration-300 overflow-hidden ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-0 group-hover:opacity-100"></span>
                <Icon className="relative z-10" size={20} />
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg border border-white/30 backdrop-blur-sm group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <LogOut className="relative z-10" size={20} />
              <span className="relative z-10">Déconnexion</span>
            </button>
          </div>
        )}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
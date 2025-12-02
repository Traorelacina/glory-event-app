import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BoutiquePage from './pages/BoutiquePage';
import CartPage from './pages/CartPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProduitsPage from './pages/AdminProduitsPage';
import AdminCommandesPage from './pages/AdminCommandesPage';
import AdminContactsPage from './pages/AdminContactsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { statisticsService } from '../services/statisticsService';

// Composant pour le tracking des pages
function PageTracker() {
  const location = useLocation();
  
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    if (pageName) {
      statisticsService.trackView(pageName);
    }
  }, [location.pathname]);

  const getPageNameFromPath = (path: string) => {
    const routes: { [key: string]: string } = {
      '/': 'home',
      '/services': 'services',
      '/boutique': 'boutique',
      '/cart': 'cart',
      '/gallery': 'gallery',
      '/contact': 'contact',
      '/admin/login': 'admin_login',
      '/admin/dashboard': 'admin_dashboard',
      '/admin/produits': 'admin_produits',
      '/admin/commandes': 'admin_commandes',
      '/admin/contacts': 'admin_contacts',
    };
    
    return routes[path] || null;
  };

  return null;
}

// Layout pour les pages publiques (avec Header)
function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const handleNavigate = (page: string, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setSelectedService(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mettre à jour currentPage basé sur l'URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/services') setCurrentPage('services');
    else if (path === '/boutique') setCurrentPage('boutique');
    else if (path === '/cart') setCurrentPage('cart');
    else if (path === '/gallery') setCurrentPage('gallery');
    else if (path === '/contact') setCurrentPage('contact');
  }, [location.pathname]);

  return (
    <>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {children}
    </>
  );
}

// Layout pour les pages admin (sans Header)
function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

function App() {
  return (
    <Router>
      <PageTracker />
      
      <Routes>
        {/* Pages publiques avec Header */}
        <Route 
          path="/" 
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/services" 
          element={
            <PublicLayout>
              <ServicesPage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/boutique" 
          element={
            <PublicLayout>
              <BoutiquePage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/cart" 
          element={
            <PublicLayout>
              <CartPage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/gallery" 
          element={
            <PublicLayout>
              <GalleryPage />
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/contact" 
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          } 
        />

        {/* Pages admin sans Header */}
        <Route 
          path="/admin/login" 
          element={
            <AdminLayout>
              <AdminLoginPage />
            </AdminLayout>
          } 
        />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/produits" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProduitsPage />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/commandes" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCommandesPage />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/contacts" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminContactsPage />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

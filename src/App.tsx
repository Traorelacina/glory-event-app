import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { statisticsService } from '../services/statisticsService'; // Chemin corrigé

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
    };
    
    return routes[path] || null;
  };

  return null;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState<string | undefined>();

  const handleNavigate = (page: string, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setSelectedService(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
      {/* AJOUTEZ CETTE LIGNE : PageTracker doit être utilisé */}
      <PageTracker />
      
      <Routes>
        {/* Pages publiques */}
        <Route
          path="/"
          element={
            <>
              <Header currentPage={currentPage} onNavigate={handleNavigate} />
              {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
              {currentPage === 'services' && <ServicesPage onNavigate={handleNavigate} />}
              {currentPage === 'boutique' && <BoutiquePage onNavigate={handleNavigate} />}
              {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
              {currentPage === 'gallery' && <GalleryPage />}
              {currentPage === 'contact' && <ContactPage selectedService={selectedService} />}
            </>
          }
        />

        {/* Pages admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/produits"
          element={
            <ProtectedRoute>
              <AdminProduitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/commandes"
          element={
            <ProtectedRoute>
              <AdminCommandesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <AdminContactsPage />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

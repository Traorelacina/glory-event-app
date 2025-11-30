import { ReactNode, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 200);

    // Intersection Observer pour les animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  if (!token) {
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 font-sans text-gray-900 overflow-x-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease-out',
      }}
    >
      <AdminNavbar />
      
      {/* Background décoratif */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
          style={{ animation: 'float 15s ease-in-out infinite' }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl"
          style={{ animation: 'float 12s ease-in-out infinite', animationDelay: '3s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"
          style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '6s' }}
        ></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
        {children}
      </main>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
          }
          25% { 
            transform: translateY(-40px) translateX(20px) rotate(5deg); 
          }
          50% { 
            transform: translateY(-20px) translateX(-20px) rotate(-5deg); 
          }
          75% { 
            transform: translateY(-30px) translateX(10px) rotate(3deg); 
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.8s ease-out forwards;
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
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
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
    </div>
  );
}
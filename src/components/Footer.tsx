'use client';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Accueil', path: 'home' },
    { name: 'Nos Services', path: 'services' },
    { name: 'Boutique', path: 'boutique' },
    { name: 'Portfolio', path: 'portfolio' },
    { name: 'Contact', path: 'contact' },
  ];

  const services = [
    'Mariages de Luxe',
    'Événements Corporate',
    'Réceptions Privées',
    'Service de Restauration',
    'Décoration sur Mesure',
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', name: 'Facebook' },
    { icon: Instagram, url: '#', name: 'Instagram' },
    { icon: Twitter, url: '#', name: 'Twitter' },
  ];

  return (
    <footer className="bg-[#111827] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4 bg-gradient-to-r from-[#ad5945] to-[#d38074] bg-clip-text text-transparent">
              Événements Prestige
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Créateurs d&apos;expériences uniques et mémorables. Nous transformons vos rêves en réalité avec passion et excellence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-[#ad5945] hover:to-[#d38074] p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => onNavigate?.(link.path)}
                    className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-2 transform flex items-center group w-full text-left"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Nos Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="group">
                  <span className="text-gray-300 hover:text-white transition-all duration-200 cursor-default flex items-center">
                    <span className="w-1 h-1 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                  123 Avenue Prestige<br />
                  75008 Paris, France
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">contact@evenements-prestige.fr</span>
              </div>
            </div>

            {/* Call to Action */}
            <button
              onClick={() => onNavigate?.('contact')}
              className="mt-6 w-full bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white py-3 rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[#ad5945]/30"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Événements Prestige. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Mentions légales
              </button>
              <button className="hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Politique de confidentialité
              </button>
              <button className="hover:text-white transition-colors duration-200 hover:scale-105 transform">
                Conditions générales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Points décoratifs */}
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-1 h-1 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </footer>
  );
}
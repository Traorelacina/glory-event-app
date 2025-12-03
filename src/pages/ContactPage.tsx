import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Loader, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

interface ContactPageProps {
  selectedService?: string;
  onNavigate: (page: string) => void;
}

// API URL
const API_URL = 'https://detailed-odette-freelence-76d5d470.koyeb.app/api';

export default function ContactPage({ selectedService, onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: selectedService || '',
    message: '',
    service: selectedService || '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Effet pour gérer le selectedService initial
  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        subject: selectedService,
        service: selectedService
      }));
    }
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          service: formData.service,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi du message');
      }

      setIsSubmitted(true);
      
      // Réinitialisation après succès
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          service: '',
        });
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const services = [
    'Mariages de Luxe',
    'Événements Corporate',
    'Réceptions Privées',
    'Service de Restauration',
    'Décoration sur Mesure',
    'Demande de Renseignement',
    'Commande de Parfum',
    'Service Après-Vente',
    'Partenariat',
    'Autre',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#111827] mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partagez-nous votre projet et donnons vie ensemble à vos rêves
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.3s infinite' }}></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074]" style={{ animation: 'pulse 1.5s ease-in-out 0.6s infinite' }}></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informations de Contact */}
            <div>
              <div className="bg-gradient-to-br from-[#ad5945] to-[#d38074] rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl relative overflow-hidden">
                <h2 className="font-serif text-3xl font-bold mb-8 relative z-10">
                  Informations de Contact
                </h2>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Téléphone</h3>
                      <p className="text-white/90">+33 1 23 45 67 89</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-white/90">contact@eventsprestige.fr</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Adresse</h3>
                      <p className="text-white/90">
                        123 Avenue des Champs-Élysées<br />
                        75008 Paris, France
                      </p>
                    </div>
                  </div>
                </div>

                {/* Points décoratifs */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                  Horaires d'ouverture
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium text-[#ad5945]">9h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Samedi</span>
                    <span className="font-medium text-[#ad5945]">10h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Dimanche</span>
                    <span className="font-medium text-[#ad5945]">Sur rendez-vous</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de Contact */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ad5945] to-[#d38074] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">
                    Demander un devis
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
                      <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ad5945] focus:border-transparent outline-none transition-all hover:border-gray-400"
                        placeholder="Jean Dupont"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ad5945] focus:border-transparent outline-none transition-all hover:border-gray-400"
                        placeholder="jean.dupont@example.com"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ad5945] focus:border-transparent outline-none transition-all hover:border-gray-400"
                        placeholder="+33 1 23 45 67 89"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service souhaité *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            subject: value,
                            service: value
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ad5945] focus:border-transparent outline-none transition-all hover:border-gray-400 appearance-none bg-white"
                        disabled={isSubmitting}
                      >
                        <option value="">Sélectionnez un service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre message *
                      </label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ad5945] focus:border-transparent outline-none transition-all resize-none hover:border-gray-400"
                        placeholder="Décrivez votre projet..."
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ad5945] to-[#d38074] text-white py-4 rounded-full font-medium text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#ad5945]/30 disabled:hover:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Section d'informations supplémentaires */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Réponse Rapide</h3>
              <p className="text-gray-600">Nous vous répondons sous 24 heures</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Expertise Garantie</h3>
              <p className="text-gray-600">Des professionnels à votre écoute</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ad5945] to-[#d38074] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Accompagnement</h3>
              <p className="text-gray-600">Suivi personnalisé de votre projet</p>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuthStore } from '../../store/AuthStore';
import { Search, Loader, AlertCircle, Trash2, Mail, Phone, MessageSquare, Calendar, User, Eye, EyeOff, Sparkles, Star, X, ArrowRight } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  service?: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContactsPage() {
  const { token } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
  }, [token]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [contacts]);

  const fetchContacts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('https://detailed-odette-freelence-76d5d470.koyeb.app/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');

      const data = await response.json();
      setContacts(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression?')) return;
    if (!token) return;

    try {
      const response = await fetch(`https://detailed-odette-freelence-76d5d470.koyeb.app/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`https://detailed-odette-freelence-76d5d470.koyeb.app/api/admin/contacts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) throw new Error('Erreur lors du marquage comme lu');

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, is_read: true } : contact
      ));
      
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, is_read: true });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAsUnread = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`https://detailed-odette-freelence-76d5d470.koyeb.app/api/admin/contacts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: false }),
      });

      if (!response.ok) throw new Error('Erreur lors du marquage comme non lu');

      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, is_read: false } : contact
      ));
      
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, is_read: false });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    if (!contact.is_read) {
      handleMarkAsRead(contact.id);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!contact) return false;
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      (contact.name?.toLowerCase() || '').includes(searchLower) ||
      (contact.email?.toLowerCase() || '').includes(searchLower) ||
      (contact.subject?.toLowerCase() || '').includes(searchLower) ||
      (contact.message?.toLowerCase() || '').includes(searchLower)
    );
  });

  const unreadCount = contacts.filter(contact => !contact.is_read).length;
  const readCount = contacts.filter(contact => contact.is_read).length;

  const formatContactData = (contact: Contact) => {
    return {
      id: contact.id || 0,
      name: contact.name || 'Non spécifié',
      email: contact.email || 'Non spécifié',
      phone: contact.phone || '',
      subject: contact.subject || 'Sans sujet',
      message: contact.message || 'Aucun message',
      service: contact.service || '',
      is_read: contact.is_read || false,
      created_at: contact.created_at || new Date().toISOString()
    };
  };

  return (
    <AdminLayout>
      <div 
        ref={mainContainerRef}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-900 overflow-x-hidden"
      >
        <div className="space-y-6 p-6">
          {/* Hero Header Section */}
          <section className="relative mb-8 overflow-hidden rounded-3xl">
            {/* Background animé avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700">
              <div className="absolute inset-0 opacity-30">
                <div 
                  className="absolute top-10 left-10 w-72 h-72 bg-pink-500/50 rounded-full blur-3xl"
                  style={{ animation: 'float 8s ease-in-out infinite' }}
                ></div>
                <div 
                  className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/50 rounded-full blur-3xl"
                  style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }}
                ></div>
              </div>
            </div>

            {/* Contenu du header */}
            <div className="relative z-10 p-8 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div 
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4"
                    style={{ animation: 'slideDown 0.8s ease-out' }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Gestion Contacts</span>
                  </div>
                  
                  <h1 
                    className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3"
                    style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
                  >
                    <MessageSquare size={40} />
                    Messages Clients
                  </h1>
                  <p 
                    className="text-purple-100 text-lg md:text-xl"
                    style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
                  >
                    {contacts.length} message{contacts.length > 1 ? 's' : ''} reçu{contacts.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="mt-6 lg:mt-0 grid grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 text-center">
                    <p className="text-purple-100 text-sm mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">{contacts.length}</p>
                  </div>
                  <div className="bg-red-500/30 backdrop-blur-sm rounded-2xl p-4 border border-red-300/30 text-center">
                    <p className="text-red-100 text-sm mb-1">Non lus</p>
                    <p className="text-2xl font-bold text-white">{unreadCount}</p>
                  </div>
                  <div className="bg-green-500/30 backdrop-blur-sm rounded-2xl p-4 border border-green-300/30 text-center">
                    <p className="text-green-100 text-sm mb-1">Lus</p>
                    <p className="text-2xl font-bold text-white">{readCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div 
              className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-2xl shadow-xl flex gap-4"
              style={{ animation: 'slideInLeft 0.6s ease-out' }}
            >
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <p className="text-red-900 font-bold text-lg mb-1">Erreur</p>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recherche */}
              <div 
                id="search-section"
                data-animate
                className="relative"
                style={{
                  opacity: isVisible['search-section'] ? 1 : 0,
                  transform: isVisible['search-section'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out',
                }}
              >
                <Search className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-lg"
                />
              </div>

              {loading ? (
                <div 
                  id="loading-section"
                  data-animate
                  className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border-2 border-purple-100"
                  style={{
                    opacity: isVisible['loading-section'] ? 1 : 0,
                    transform: isVisible['loading-section'] ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.6s ease-out',
                  }}
                >
                  <Loader className="animate-spin text-purple-600 mb-6" size={60} />
                  <p className="text-gray-700 font-medium text-lg">Chargement des contacts...</p>
                  <p className="text-gray-500 text-sm mt-2">Veuillez patienter</p>
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="space-y-4">
                  {filteredContacts.map((contact, index) => {
                    const formattedContact = formatContactData(contact);
                    const isUnread = !formattedContact.is_read;
                    
                    return (
                      <div
                        key={formattedContact.id}
                        id={`contact-${index}`}
                        data-animate
                        onClick={() => handleContactSelect(formattedContact)}
                        className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] overflow-hidden ${
                          selectedContact?.id === formattedContact.id
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-2xl'
                            : isUnread
                            ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-xl'
                            : 'bg-white border-purple-200 hover:border-purple-300 hover:shadow-xl'
                        }`}
                        style={{
                          opacity: isVisible[`contact-${index}`] ? 1 : 0,
                          transform: isVisible[`contact-${index}`] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                          transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
                        }}
                      >
                        {/* Effet de brillance */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                        <div className="relative z-10 flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                isUnread 
                                  ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
                              }`}>
                                <User className="text-white" size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-700 transition-colors">
                                    {formattedContact.name}
                                  </h3>
                                  {isUnread && (
                                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                                      NOUVEAU
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 font-semibold text-sm">{formattedContact.subject}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-purple-600 font-medium">
                                <Mail size={16} />
                                {formattedContact.email}
                              </div>
                              {formattedContact.service && (
                                <div className="flex items-center gap-2 text-blue-600 font-medium">
                                  <MessageSquare size={16} />
                                  {formattedContact.service}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right space-y-3">
                            <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                              {new Date(formattedContact.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            <div className="flex gap-2 justify-end">
                              {isUnread ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(formattedContact.id);
                                  }}
                                  className="group relative p-2 hover:bg-green-100 rounded-xl text-green-600 transition-all duration-300 hover:scale-110 border-2 border-green-300"
                                  title="Marquer comme lu"
                                >
                                  <Eye className="group-hover:scale-110 transition-transform" size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsUnread(formattedContact.id);
                                  }}
                                  className="group relative p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-300 hover:scale-110 border-2 border-gray-300"
                                  title="Marquer comme non lu"
                                >
                                  <EyeOff className="group-hover:scale-110 transition-transform" size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl shadow-2xl border-2 border-purple-100">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="text-purple-400" size={48} />
                  </div>
                  <p className="text-gray-700 font-bold text-xl mb-2">
                    {searchTerm ? 'Aucun contact trouvé' : 'Aucun message reçu'}
                  </p>
                  <p className="text-gray-500">
                    {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Les messages apparaîtront ici'}
                  </p>
                </div>
              )}
            </div>

            {/* Détails du contact */}
            {selectedContact ? (
              <div 
                id="contact-details"
                data-animate
                className="bg-white rounded-3xl shadow-2xl p-6 border-2 border-purple-200 h-fit lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-8rem)]"
                style={{
                  opacity: isVisible['contact-details'] ? 1 : 0,
                  transform: isVisible['contact-details'] ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'all 0.8s ease-out',
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Détails</h2>
                      {!selectedContact.is_read && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold mt-1 inline-block">
                          NON LU
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedContact.is_read ? (
                      <button
                        onClick={() => handleMarkAsUnread(selectedContact.id)}
                        className="group p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600 border-2 border-gray-300 hover:scale-110"
                        title="Marquer comme non lu"
                      >
                        <EyeOff className="group-hover:scale-110 transition-transform" size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsRead(selectedContact.id)}
                        className="group p-3 hover:bg-green-100 rounded-xl transition-all duration-300 text-green-600 border-2 border-green-300 hover:scale-110"
                        title="Marquer comme lu"
                      >
                        <Eye className="group-hover:scale-110 transition-transform" size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      className="group p-3 hover:bg-red-100 rounded-xl transition-all duration-300 text-red-600 border-2 border-red-300 hover:scale-110"
                    >
                      <Trash2 className="group-hover:scale-110 transition-transform" size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Informations client */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="text-purple-600" size={20} />
                      Informations client
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Nom complet</p>
                        <p className="text-gray-800 font-bold text-lg">{selectedContact.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Email</p>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-colors"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.phone && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Téléphone</p>
                          <a 
                            href={`tel:${selectedContact.phone}`} 
                            className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline transition-colors"
                          >
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sujet et service */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="text-purple-600" size={20} />
                      Demande
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Sujet</p>
                        <p className="text-gray-800 font-semibold text-base">{selectedContact.subject}</p>
                      </div>
                      {selectedContact.service && selectedContact.service !== selectedContact.subject && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Service concerné</p>
                        <p className="text-gray-800 font-semibold text-base">{selectedContact.service}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="text-purple-600" size={20} />
                      Message
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="text-purple-600" size={20} />
                      Date de réception
                    </h3>
                    <p className="text-gray-800 font-semibold text-base">
                      {new Date(selectedContact.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-100 h-fit text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-purple-300" size={40} />
                </div>
                <p className="text-gray-700 font-bold text-lg mb-2">Aucun contact sélectionné</p>
                <p className="text-gray-500 text-sm">Sélectionnez un message pour voir les détails</p>
              </div>
            )}
          </div>
        </div>

        {/* Animations CSS */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0) translateX(0); 
            }
            25% { 
              transform: translateY(-20px) translateX(10px); 
            }
            50% { 
              transform: translateY(-10px) translateX(-10px); 
            }
            75% { 
              transform: translateY(-15px) translateX(5px); 
            }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
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
        `}</style>
      </div>
    </AdminLayout>
  );
}

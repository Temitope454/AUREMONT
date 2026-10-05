import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  // Navigation
  nav: {
    buy: string;
    rent: string;
    lease: string;
    cars: string;
    explore: string;
    listProperty: string;
    signIn: string;
    signOut: string;
    consumerDashboard: string;
    providerWorkspace: string;
    operationsConsole: string;
    favorites: string;
    messages: string;
    transactions: string;
    settings: string;
    concierge: string;
  };
  // Footer
  footer: {
    tagline: string;
    marketplace: string;
    company: string;
    support: string;
    about: string;
    trust: string;
    contact: string;
    help: string;
    terms: string;
    privacy: string;
    rightsReserved: string;
  };
  // Concierge
  concierge: {
    title: string;
    subtitle: string;
    status: string;
    placeholder: string;
    send: string;
    suggestedTitle: string;
    clearChat: string;
    disclaimer: string;
    scheduleViewing: string;
    bookVehicle: string;
    viewDossier: string;
    speakAdvisor: string;
    listening: string;
    welcomeMsg: string;
  };
  // Account
  account: {
    overview: string;
    favorites: string;
    savedSearches: string;
    recentlyViewed: string;
    messages: string;
    bookings: string;
    transactions: string;
    notifications: string;
    profile: string;
    settings: string;
    signOut: string;
  };
  // Common
  common: {
    search: string;
    filter: string;
    viewAll: string;
    beds: string;
    baths: string;
    price: string;
    save: string;
    cancel: string;
    confirm: string;
    details: string;
    status: string;
    action: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      buy: 'Buy',
      rent: 'Rent',
      lease: 'Lease',
      cars: 'Cars',
      explore: 'Explore',
      listProperty: 'List Property',
      signIn: 'Sign in',
      signOut: 'Sign out',
      consumerDashboard: 'Account',
      providerWorkspace: 'Provider Workspace',
      operationsConsole: 'Operations Console',
      favorites: 'Favorites',
      messages: 'Messages',
      transactions: 'Transactions',
      settings: 'Settings',
      concierge: 'Ask Auremont',
    },
    footer: {
      tagline: 'Exceptional places, clearly discovered.',
      marketplace: 'Marketplace',
      company: 'Company',
      support: 'Support',
      about: 'About Auremont',
      trust: 'Trust & Safety',
      contact: 'Contact',
      help: 'Help Center',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      rightsReserved: 'All rights reserved.',
    },
    concierge: {
      title: 'Auremont Concierge',
      subtitle: 'Marketplace Inquiries & Exploration',
      status: 'Assistant Ready',
      placeholder: 'Search residences, explore vehicles, or ask about destinations...',
      send: 'Send',
      suggestedTitle: 'Suggested Searches',
      clearChat: 'Clear Conversation',
      disclaimer: 'Prototype assistant for discovering marketplace listings and initiating inquiries.',
      scheduleViewing: 'Request Viewing',
      bookVehicle: 'Request Reservation',
      viewDossier: 'View Listing',
      speakAdvisor: 'Contact Listing Agent',
      listening: 'Listening...',
      welcomeMsg: 'Welcome to Auremont Concierge. You can ask about available residences in Paris, London, Madrid, Lisbon, Milan, Dubai, New York, or Singapore, or explore our curated mobility fleet.',
    },
    account: {
      overview: 'Overview',
      favorites: 'Favorites',
      savedSearches: 'Saved Searches',
      recentlyViewed: 'Recently Viewed',
      messages: 'Messages & Inquiries',
      bookings: 'Bookings & Viewings',
      transactions: 'Financial Ledger',
      notifications: 'Notifications',
      profile: 'Client Profile',
      settings: 'Security & Preferences',
      signOut: 'Sign out',
    },
    common: {
      search: 'Search',
      filter: 'Filter',
      viewAll: 'View All',
      beds: 'Beds',
      baths: 'Baths',
      price: 'Price',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      details: 'Details',
      status: 'Status',
      action: 'Action',
    },
  },
  fr: {
    nav: {
      buy: 'Acheter',
      rent: 'Louer',
      lease: 'Bail Commercial',
      cars: 'Mobilité Privée',
      explore: 'Explorer',
      listProperty: 'Confier un Bien',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
      consumerDashboard: 'Compte',
      providerWorkspace: 'Espace Partenaire',
      operationsConsole: 'Console de Contrôle',
      favorites: 'Favoris',
      messages: 'Messagerie',
      transactions: 'Transactions',
      settings: 'Paramètres',
      concierge: 'Demander à Auremont',
    },
    footer: {
      tagline: 'L’immobilier d’exception, en toute clarté.',
      marketplace: 'Marché',
      company: 'Maison Auremont',
      support: 'Assistance',
      about: 'À propos d’Auremont',
      trust: 'Confiance & Vérification',
      contact: 'Contact',
      help: 'Centre d’Aide',
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      rightsReserved: 'Tous droits réservés.',
    },
    concierge: {
      title: 'Auremont Concierge',
      subtitle: 'Assistance & Recherche de Biens',
      status: 'Assistant Prêt',
      placeholder: 'Recherchez un appartement, une villa, un véhicule ou une destination...',
      send: 'Envoyer',
      suggestedTitle: 'Recherches Suggérées',
      clearChat: 'Réinitialiser',
      disclaimer: 'Prototype d’assistance pour explorer les biens, les véhicules et transmettre vos demandes.',
      scheduleViewing: 'Demander une Visite',
      bookVehicle: 'Demander une Réservation',
      viewDossier: 'Consulter l’Annonce',
      speakAdvisor: 'Contacter l’Agent',
      listening: 'Écoute en cours...',
      welcomeMsg: 'Bienvenue sur Auremont Concierge. Vous pouvez explorer les biens disponibles à Paris, Londres, Madrid, Lisbonne, Milan, Dubaï, New York ou Singapour, ainsi que notre sélection automobile.',
    },
    account: {
      overview: 'Vue d’ensemble',
      favorites: 'Biens Favoris',
      savedSearches: 'Recherches Enregistrées',
      recentlyViewed: 'Consultés Récemment',
      messages: 'Échanges & Demandes',
      bookings: 'Visites & Réservations',
      transactions: 'Relevé Financier',
      notifications: 'Notifications',
      profile: 'Profil Privé',
      settings: 'Sécurité & Préférences',
      signOut: 'Déconnexion',
    },
    common: {
      search: 'Rechercher',
      filter: 'Filtrer',
      viewAll: 'Tout afficher',
      beds: 'Chambres',
      baths: 'Salles de bain',
      price: 'Prix',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      details: 'Détails',
      status: 'Statut',
      action: 'Action',
    },
  },
  es: {
    nav: {
      buy: 'Comprar',
      rent: 'Alquilar',
      lease: 'Arrendamiento',
      cars: 'Flota Exclusiva',
      explore: 'Explorar',
      listProperty: 'Publicar Inmueble',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      consumerDashboard: 'Mi Cuenta',
      providerWorkspace: 'Portal de Proveedores',
      operationsConsole: 'Consola de Supervisión',
      favorites: 'Favoritos',
      messages: 'Mensajes',
      transactions: 'Transacciones',
      settings: 'Ajustes',
      concierge: 'Preguntar a Auremont',
    },
    footer: {
      tagline: 'Propiedades excepcionales, descubiertas con claridad.',
      marketplace: 'Mercado',
      company: 'Compañía',
      support: 'Soporte',
      about: 'Sobre Auremont',
      trust: 'Confianza y Verificación',
      contact: 'Contacto',
      help: 'Centro de Asistencia',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      rightsReserved: 'Todos los derechos reservados.',
    },
    concierge: {
      title: 'Auremont Concierge',
      subtitle: 'Asistencia y Búsqueda',
      status: 'Asistente Listo',
      placeholder: 'Busque residencias, vehículos o consulte sobre destinos...',
      send: 'Enviar',
      suggestedTitle: 'Consultas Sugeridas',
      clearChat: 'Reiniciar Conversación',
      disclaimer: 'Prototipo de asistencia para explorar inmuebles, vehículos y enviar consultas directas.',
      scheduleViewing: 'Solicitar Visita',
      bookVehicle: 'Solicitar Reserva',
      viewDossier: 'Ver Inmueble',
      speakAdvisor: 'Contactar con el Agente',
      listening: 'Escuchando consulta...',
      welcomeMsg: 'Bienvenido a Auremont Concierge. Puede buscar residencias en París, Londres, Madrid, Lisboa, Milán, Dubái, Nueva York o Singapur, así como nuestra flota de vehículos.',
    },
    account: {
      overview: 'Resumen',
      favorites: 'Favoritos Guardados',
      savedSearches: 'Búsquedas Guardadas',
      recentlyViewed: 'Vistos Recientemente',
      messages: 'Mensajes y Consultas',
      bookings: 'Visitas y Reservas',
      transactions: 'Historial Financiero',
      notifications: 'Notificaciones',
      profile: 'Perfil de Cliente',
      settings: 'Seguridad y Ajustes',
      signOut: 'Cerrar Sesión',
    },
    common: {
      search: 'Buscar',
      filter: 'Filtrar',
      viewAll: 'Ver Todo',
      beds: 'Dormitorios',
      baths: 'Baños',
      price: 'Precio',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      details: 'Detalles',
      status: 'Estado',
      action: 'Acción',
    },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('auremont_language');
    if (saved === 'en' || saved === 'fr' || saved === 'es') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('auremont_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

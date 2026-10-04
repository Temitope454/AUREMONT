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
      consumerDashboard: 'Consumer Dashboard',
      providerWorkspace: 'Provider Workspace',
      operationsConsole: 'Operations Console',
      favorites: 'Favorites',
      messages: 'Messages',
      transactions: 'Transactions',
      settings: 'Settings',
      concierge: 'AI Concierge',
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
      title: 'Auremont Private Concierge',
      subtitle: 'Geneva HQ · Prime Central Directorate',
      status: 'Advisory Active',
      placeholder: 'Ask about prime penthouses, luxury fleet pairings, or viewing arrangements...',
      send: 'Transmit',
      suggestedTitle: 'Curated Inquiries',
      clearChat: 'Reset Session',
      disclaimer: 'Institutional advisory powered by Auremont Intelligence. Confidential client privileged.',
      scheduleViewing: 'Schedule Private Viewing',
      bookVehicle: 'Reserve Vehicle',
      viewDossier: 'Inspect Dossier',
      speakAdvisor: 'Connect with Senior Broker',
      listening: 'Listening to vocal inquiry...',
      welcomeMsg: 'Good day. I am your Auremont Private Concierge. Whether you require a Haussmannian residence in Paris, a Mayfair pied-à-terre, or seamless mobility across the Côte d’Azur, allow me to orchestrate your requirements.',
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
      consumerDashboard: 'Espace Client',
      providerWorkspace: 'Espace Partenaire',
      operationsConsole: 'Console de Contrôle',
      favorites: 'Favoris',
      messages: 'Messagerie',
      transactions: 'Transactions',
      settings: 'Paramètres',
      concierge: 'Concierge IA',
    },
    footer: {
      tagline: 'L’immobilier d’exception, en toute clarté.',
      marketplace: 'Marché',
      company: 'Maison Auremont',
      support: 'Assistance',
      about: 'À propos d’Auremont',
      trust: 'Confiance & Conformité',
      contact: 'Relations Privées',
      help: 'Centre d’Aide',
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      rightsReserved: 'Tous droits réservés.',
    },
    concierge: {
      title: 'Conciergerie Privée Auremont',
      subtitle: 'Siège Genève · Direction des Acquisitions',
      status: 'Conseil Privé Actif',
      placeholder: 'Interrogez sur un hôtel particulier, un penthouse ou une flotte d’exception...',
      send: 'Transmettre',
      suggestedTitle: 'Recherches Suggérées',
      clearChat: 'Réinitialiser',
      disclaimer: 'Conseil confidentiel propulsé par l’Intelligence Auremont.',
      scheduleViewing: 'Organiser une Visite Privée',
      bookVehicle: 'Réserver le Véhicule',
      viewDossier: 'Consulter le Dossier',
      speakAdvisor: 'Contacter un Associé Senior',
      listening: 'Écoute de votre demande...',
      welcomeMsg: 'Bienvenue. Je suis votre Concierge Privé Auremont. Qu’il s’agisse d’un appartement haussmannien à Paris, d’une villa à Dubaï ou d’un véhicule d’exception, confiez-moi vos exigences les plus précises.',
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
      consumerDashboard: 'Panel de Cliente',
      providerWorkspace: 'Portal de Proveedores',
      operationsConsole: 'Consola de Supervisión',
      favorites: 'Favoritos',
      messages: 'Mensajes',
      transactions: 'Transacciones',
      settings: 'Ajustes',
      concierge: 'Conserje IA',
    },
    footer: {
      tagline: 'Propiedades excepcionales, descubiertas con claridad.',
      marketplace: 'Mercado',
      company: 'Compañía',
      support: 'Soporte',
      about: 'Sobre Auremont',
      trust: 'Confianza y Seguridad',
      contact: 'Contacto Privado',
      help: 'Centro de Asistencia',
      terms: 'Términos de Servicio',
      privacy: 'Política de Privacidad',
      rightsReserved: 'Todos los derechos reservados.',
    },
    concierge: {
      title: 'Conserjería Privada Auremont',
      subtitle: 'Sede Ginebra · Dirección de Clientes VIP',
      status: 'Asesoría en Línea',
      placeholder: 'Consulte sobre áticos exclusivos, fincas o vehículos de lujo...',
      send: 'Transmitir',
      suggestedTitle: 'Consultas Sugeridas',
      clearChat: 'Reiniciar Sesión',
      disclaimer: 'Asesoramiento institucional impulsado por Inteligencia Auremont. Privilegio confidencial.',
      scheduleViewing: 'Agendar Visita Privada',
      bookVehicle: 'Reservar Vehículo',
      viewDossier: 'Ver Expediente',
      speakAdvisor: 'Contactar con Asesor Senior',
      listening: 'Escuchando consulta de voz...',
      welcomeMsg: 'Saludos cordiales. Soy su Conserje Privado Auremont. Ya sea que busque un ático en París, una villa en Dubai o una berlina de lujo para sus desplazamientos, estoy a su completa disposición.',
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

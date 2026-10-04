import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { mockProperties, type Property } from '../data/mockProperties';

export type ListingModerationStatus = 'published' | 'under_review' | 'changes_requested' | 'rejected' | 'paused';
export type ProviderKYCStatus = 'under_review' | 'verified' | 'needs_attention' | 'rejected';
export type UserStatus = 'active' | 'suspended' | 'flagged';
export type UserRole = 'consumer' | 'agent' | 'landlord' | 'admin';

export interface AdminListing {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  transactionType: 'Buy' | 'Rent' | 'Lease';
  price: number;
  currency: string;
  city: string;
  country: string;
  neighborhood: string;
  providerName: string;
  providerRole: 'Agent' | 'Landlord';
  providerAgency?: string;
  providerEmail: string;
  status: ListingModerationStatus;
  isFeatured: boolean;
  submittedDate: string;
  lastReviewedDate?: string;
  reviewedBy?: string;
  editorialNotes?: string;
  complianceChecks: {
    deedVerification: boolean;
    highResPhotography: boolean;
    energyPerformanceCert: boolean;
    floorPlanSupplied: boolean;
    identityVerified: boolean;
  };
  mainImage: string;
  gallery: string[];
  beds: number;
  baths: number;
  size: number;
  sizeUnit: string;
  description: string;
}

export interface ProviderKYCDossier {
  id: string;
  providerId: string;
  providerName: string;
  email: string;
  phone: string;
  role: 'agent' | 'landlord';
  agency?: string;
  jurisdiction: string;
  licenseNumber: string;
  documentType: 'Passport' | 'National ID' | 'Real Estate Broker License' | 'Title Deed';
  documentNumber: string;
  documentExpiry: string;
  submittedDate: string;
  status: ProviderKYCStatus;
  riskRating: 'Low' | 'Medium' | 'High';
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  activeListingsCount: number;
  totalTransactedValue: number;
}

export interface RegionalOverride {
  id: string;
  region: string;
  country: string;
  saleCommissionRate: number; // e.g., 0.08 for 8%
  rentCommissionRate: number; // e.g., 0.04 for 4%
  notes: string;
  isActive: boolean;
}

export interface CommissionPolicyConfig {
  defaultSaleRate: number; // e.g., 0.10 (10%)
  defaultRentRate: number; // e.g., 0.05 (5%)
  leaseConfigured: boolean;
  defaultLeaseRate: number; // e.g., 0.075 (7.5%)
  carsConfigured: boolean;
  defaultCarsRate: number; // e.g., 0.12 (12%)
  regionalOverrides: RegionalOverride[];
  minSaleCommissionCap?: number;
  notes: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive: string;
  location: string;
  listingsCount?: number;
  transactionsCount: number;
  totalVolume: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  action: 
    | 'LISTING_APPROVED'
    | 'LISTING_CHANGES_REQUESTED'
    | 'LISTING_REJECTED'
    | 'LISTING_FEATURED_TOGGLED'
    | 'KYC_APPROVED'
    | 'KYC_CHANGES_REQUESTED'
    | 'KYC_REJECTED'
    | 'COMMISSION_POLICY_UPDATED'
    | 'REGIONAL_OVERRIDE_ADDED'
    | 'REGIONAL_OVERRIDE_DELETED'
    | 'USER_STATUS_UPDATED'
    | 'MANUAL_PAYOUT_CLEARED';
  targetType: 'listing' | 'provider_kyc' | 'commission_policy' | 'user' | 'transaction';
  targetId: string;
  targetSummary: string;
  details: string;
}

export interface PlatformMetrics {
  totalListingsCount: number;
  pendingListingsCount: number;
  publishedListingsCount: number;
  pendingKYCCount: number;
  verifiedProvidersCount: number;
  totalPlatformGMV: number;
  totalAccruedCommission: number;
  totalActiveUsers: number;
}

interface AdminContextState {
  listings: AdminListing[];
  kycDossiers: ProviderKYCDossier[];
  commissionPolicy: CommissionPolicyConfig;
  users: AdminUser[];
  auditLogs: AuditLogEntry[];
  metrics: PlatformMetrics;
  
  // Listing Actions
  approveListing: (id: string, notes?: string) => void;
  requestListingChanges: (id: string, notes: string) => void;
  rejectListing: (id: string, reason: string) => void;
  toggleFeaturedListing: (id: string) => void;
  
  // KYC Actions
  approveKYC: (id: string, notes?: string) => void;
  requestKYCInformation: (id: string, notes: string) => void;
  rejectKYC: (id: string, reason: string) => void;
  
  // Commission Policy Actions
  updateCommissionPolicy: (updates: Partial<CommissionPolicyConfig>) => void;
  addRegionalOverride: (override: Omit<RegionalOverride, 'id'>) => void;
  removeRegionalOverride: (id: string) => void;
  toggleRegionalOverride: (id: string) => void;
  
  // User Governance Actions
  updateUserStatus: (id: string, status: UserStatus, reason?: string) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  
  // Audit Helpers
  exportAuditLogCsv: () => string;
}

const AdminContext = createContext<AdminContextState | undefined>(undefined);

// Initial Seed Listings
const INITIAL_ADMIN_LISTINGS: AdminListing[] = [
  ...mockProperties.map((p: Property, idx: number) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    propertyType: p.propertyType,
    transactionType: p.transactionType,
    price: p.price,
    currency: p.currency,
    city: p.city,
    country: p.country,
    neighborhood: p.neighborhood,
    providerName: p.provider.name,
    providerRole: p.provider.role,
    providerAgency: p.provider.agency,
    providerEmail: `${p.provider.name.toLowerCase().replace(/\s+/g, '.')}@auremont-partner.com`,
    status: (idx === 0 ? 'published' : idx === 1 ? 'published' : 'published') as ListingModerationStatus,
    isFeatured: idx === 0,
    submittedDate: p.creationDate || '2026-09-15T10:00:00Z',
    complianceChecks: {
      deedVerification: true,
      highResPhotography: true,
      energyPerformanceCert: true,
      floorPlanSupplied: true,
      identityVerified: p.provider.verifiedIdentity
    },
    mainImage: p.mainImage,
    gallery: p.gallery,
    beds: p.beds,
    baths: p.baths,
    size: p.size,
    sizeUnit: p.sizeUnit,
    description: p.description
  })),
  {
    id: 'prop_paris_101',
    title: 'Haussmannian Boulevard Residence',
    slug: 'haussmannian-boulevard-residence-paris',
    propertyType: 'Apartment',
    transactionType: 'Buy',
    price: 3450000,
    currency: '€',
    city: 'Paris',
    country: 'France',
    neighborhood: '8th Arrondissement',
    providerName: 'Claire Moreau',
    providerRole: 'Agent',
    providerAgency: 'Moreau & Associés Prestige',
    providerEmail: 'claire.moreau@auremont-partner.com',
    status: 'under_review',
    isFeatured: false,
    submittedDate: '2026-10-02T14:32:00Z',
    complianceChecks: {
      deedVerification: true,
      highResPhotography: true,
      energyPerformanceCert: false, // Flagged for review
      floorPlanSupplied: true,
      identityVerified: true
    },
    mainImage: '/images/paris_apartment.jpg',
    gallery: ['/images/paris_apartment.jpg', '/images/madrid_apartment.jpg'],
    beds: 3,
    baths: 2,
    size: 210,
    sizeUnit: 'm²',
    description: 'Palatial second-floor residence facing wide tree-lined boulevards with parquet de Versailles, authentic marble fireplaces, and high-security concierge entrance.'
  },
  {
    id: 'prop_tokyo_404',
    title: 'Roppongi Hills Skyline Penthouse',
    slug: 'roppongi-hills-skyline-penthouse-tokyo',
    propertyType: 'Penthouse',
    transactionType: 'Rent',
    price: 18500,
    currency: '€',
    city: 'Tokyo',
    country: 'Japan',
    neighborhood: 'Minato City',
    providerName: 'Kenzo Tanaka',
    providerRole: 'Agent',
    providerAgency: 'Tokyo Prime Estates',
    providerEmail: 'k.tanaka@tokyoprime.jp',
    status: 'under_review',
    isFeatured: false,
    submittedDate: '2026-10-03T09:15:00Z',
    complianceChecks: {
      deedVerification: true,
      highResPhotography: true,
      energyPerformanceCert: true,
      floorPlanSupplied: true,
      identityVerified: true
    },
    mainImage: '/images/dubai_residence.jpg',
    gallery: ['/images/dubai_residence.jpg', '/images/london_apartment.jpg'],
    beds: 2,
    baths: 2,
    size: 165,
    sizeUnit: 'm²',
    description: 'Panoramic glass curtains framing Mount Fuji and Tokyo Tower. Triple-glazed acoustic isolation, automated wine cellar, and 24h bilingual concierge.'
  },
  {
    id: 'prop_dubai_505',
    title: 'Emirates Hills Lakeside Palace',
    slug: 'emirates-hills-lakeside-palace-dubai',
    propertyType: 'Villa',
    transactionType: 'Buy',
    price: 12800000,
    currency: '€',
    city: 'Dubai',
    country: 'UAE',
    neighborhood: 'Emirates Hills',
    providerName: 'Tariq Al-Fassi',
    providerRole: 'Landlord',
    providerEmail: 'tariq.alfassi@private-capital.ae',
    status: 'changes_requested',
    isFeatured: false,
    submittedDate: '2026-10-01T11:20:00Z',
    editorialNotes: 'High-res photography provided exceeds maximum compression guidelines; please submit unwatermarked architectural photography.',
    complianceChecks: {
      deedVerification: true,
      highResPhotography: false,
      energyPerformanceCert: true,
      floorPlanSupplied: false,
      identityVerified: true
    },
    mainImage: '/images/dubai_residence.jpg',
    gallery: ['/images/dubai_residence.jpg'],
    beds: 6,
    baths: 8,
    size: 1100,
    sizeUnit: 'm²',
    description: 'Private gated family compound overlooking the Montgomerie golf greens. Infinity pool, submerged cinema room, and private subterranean car gallery.'
  }
];

// Initial Seed Provider KYC Applications
const INITIAL_KYC_DOSSIERS: ProviderKYCDossier[] = [
  {
    id: 'kyc_prov_001',
    providerId: 'prov_sarah_jenkins',
    providerName: 'Sarah Jenkins',
    email: 'sarah.jenkins@mayfair-estates.co.uk',
    phone: '+44 20 7946 0912',
    role: 'agent',
    agency: 'Mayfair & Kensington Private Brokerage',
    jurisdiction: 'United Kingdom (London, Westminster, Kensington)',
    licenseNumber: 'RICS-UK-849201',
    documentType: 'Real Estate Broker License',
    documentNumber: 'RICS-849201-A',
    documentExpiry: '2027-12-31',
    submittedDate: '2026-10-02T11:45:00Z',
    status: 'under_review',
    riskRating: 'Low',
    activeListingsCount: 3,
    totalTransactedValue: 14500000
  },
  {
    id: 'kyc_prov_002',
    providerId: 'prov_marcus_alvarez',
    providerName: 'Marcus Alvarez',
    email: 'marcus.alvarez@alvarez-propiedades.es',
    phone: '+34 91 555 4321',
    role: 'landlord',
    jurisdiction: 'Spain (Madrid, Salamanca, Chamberí)',
    licenseNumber: 'NOTARIAL-ES-2024-998',
    documentType: 'Passport',
    documentNumber: 'ESP-9844210B',
    documentExpiry: '2030-05-14',
    submittedDate: '2026-10-03T16:20:00Z',
    status: 'under_review',
    riskRating: 'Low',
    activeListingsCount: 2,
    totalTransactedValue: 4200000
  },
  {
    id: 'kyc_prov_003',
    providerId: 'prov_claire_moreau',
    providerName: 'Claire Moreau',
    email: 'claire.moreau@auremont-partner.com',
    phone: '+33 1 42 68 55 00',
    role: 'agent',
    agency: 'Auremont Paris Premier',
    jurisdiction: 'France (Paris, Île-de-France)',
    licenseNumber: 'CARTE-T-7501-2023-41',
    documentType: 'Real Estate Broker License',
    documentNumber: 'FR-7501-CPI',
    documentExpiry: '2028-04-30',
    submittedDate: '2026-09-10T08:00:00Z',
    status: 'verified',
    riskRating: 'Low',
    reviewedAt: '2026-09-11T10:00:00Z',
    reviewedBy: 'Elena Rostova (Compliance Director)',
    activeListingsCount: 4,
    totalTransactedValue: 22000000
  },
  {
    id: 'kyc_prov_004',
    providerId: 'prov_alessandro_rossi',
    providerName: 'Alessandro Rossi',
    email: 'a.rossi@milano-immobili.it',
    phone: '+39 02 8901 2345',
    role: 'agent',
    agency: 'Rossi Luxury Living Milano',
    jurisdiction: 'Italy (Milan, Brera, Quadrilatero)',
    licenseNumber: 'CCIAA-MI-88129',
    documentType: 'National ID',
    documentNumber: 'IT-CA-99210-X',
    documentExpiry: '2029-08-19',
    submittedDate: '2026-10-01T09:30:00Z',
    status: 'needs_attention',
    riskRating: 'Medium',
    reviewNotes: 'Chamber of Commerce broker certificate copy is obscured by watermark. Please resubmit clear color scan of CCIAA registration.',
    activeListingsCount: 1,
    totalTransactedValue: 3100000
  }
];

// Initial Commission Policy
const INITIAL_COMMISSION_POLICY: CommissionPolicyConfig = {
  defaultSaleRate: 0.10, // 10%
  defaultRentRate: 0.05, // 5%
  leaseConfigured: false,
  defaultLeaseRate: 0.075, // 7.5% when enabled
  carsConfigured: false,
  defaultCarsRate: 0.12, // 12% when enabled
  regionalOverrides: [
    {
      id: 'reg_dubai_01',
      region: 'Dubai DIFC & Palm Jumeirah',
      country: 'UAE',
      saleCommissionRate: 0.08,
      rentCommissionRate: 0.04,
      notes: 'Competitive alignment with UAE broker market caps (8% sale, 4% lease)',
      isActive: true
    },
    {
      id: 'reg_monaco_02',
      region: 'Principality of Monaco',
      country: 'Monaco',
      saleCommissionRate: 0.12,
      rentCommissionRate: 0.06,
      notes: 'Ultra-prime off-market syndication premium',
      isActive: true
    }
  ],
  notes: 'Platform baseline: 10% sale, 5% rent across international EU and UK corridors.',
  lastUpdated: '2026-10-01T08:00:00Z',
  updatedBy: 'Elena Rostova (Compliance Director)'
};

// Initial Seed Users Directory
const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_admin_001',
    name: 'Elena Rostova',
    email: 'admin@auremont.com',
    role: 'admin',
    status: 'active',
    joinedDate: '2026-01-10T00:00:00Z',
    lastActive: 'Just now',
    location: 'Geneva, Switzerland',
    transactionsCount: 0,
    totalVolume: 0
  },
  {
    id: 'usr_prov_001',
    name: 'Claire Moreau',
    email: 'claire.moreau@auremont-partner.com',
    role: 'agent',
    status: 'active',
    joinedDate: '2026-02-15T00:00:00Z',
    lastActive: '12 mins ago',
    location: 'Paris, France',
    listingsCount: 4,
    transactionsCount: 5,
    totalVolume: 18450000
  },
  {
    id: 'usr_prov_002',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@mayfair-estates.co.uk',
    role: 'agent',
    status: 'active',
    joinedDate: '2026-03-20T00:00:00Z',
    lastActive: '45 mins ago',
    location: 'London, UK',
    listingsCount: 3,
    transactionsCount: 2,
    totalVolume: 8900000
  },
  {
    id: 'usr_prov_003',
    name: 'Marcus Alvarez',
    email: 'marcus.alvarez@alvarez-propiedades.es',
    role: 'landlord',
    status: 'active',
    joinedDate: '2026-05-12T00:00:00Z',
    lastActive: '2 hours ago',
    location: 'Madrid, Spain',
    listingsCount: 2,
    transactionsCount: 3,
    totalVolume: 3200000
  },
  {
    id: 'usr_cons_001',
    name: 'Lord Arthur Sterling',
    email: 'arthur.sterling@sterling-holdings.co.uk',
    role: 'consumer',
    status: 'active',
    joinedDate: '2026-06-01T00:00:00Z',
    lastActive: 'Yesterday',
    location: 'London / Dubai',
    transactionsCount: 2,
    totalVolume: 12500000
  }
];

// Initial Audit Trail
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_001',
    timestamp: '2026-10-02T15:00:00Z',
    operator: 'Elena Rostova',
    action: 'COMMISSION_POLICY_UPDATED',
    targetType: 'commission_policy',
    targetId: 'policy_global',
    targetSummary: 'Global Policy Rules',
    details: 'Verified baseline 10% sale and 5% rent rules. Added UAE regional override (8% sale, 4% rent).'
  },
  {
    id: 'aud_002',
    timestamp: '2026-10-02T15:45:00Z',
    operator: 'Elena Rostova',
    action: 'KYC_APPROVED',
    targetType: 'provider_kyc',
    targetId: 'kyc_prov_003',
    targetSummary: 'Claire Moreau (Paris Agent)',
    details: 'Verified French Carte Professionnelle CPI 7501 2023. Authenticated notarial registry.'
  },
  {
    id: 'aud_003',
    timestamp: '2026-10-03T10:12:00Z',
    operator: 'Elena Rostova',
    action: 'LISTING_CHANGES_REQUESTED',
    targetType: 'listing',
    targetId: 'prop_dubai_505',
    targetSummary: 'Emirates Hills Lakeside Palace',
    details: 'Requested unwatermarked architectural photography and floorplan engineering sheet.'
  },
  {
    id: 'aud_004',
    timestamp: '2026-10-03T11:00:00Z',
    operator: 'Elena Rostova',
    action: 'LISTING_FEATURED_TOGGLED',
    targetType: 'listing',
    targetId: 'p-1001',
    targetSummary: 'Rue de Varenne Residence',
    details: 'Designated as primary curated hero highlight for Autumn 2026 collection.'
  }
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<AdminListing[]>(() => {
    const saved = localStorage.getItem('auremont_admin_listings');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LISTINGS;
  });

  const [kycDossiers, setKycDossiers] = useState<ProviderKYCDossier[]>(() => {
    const saved = localStorage.getItem('auremont_admin_kyc');
    return saved ? JSON.parse(saved) : INITIAL_KYC_DOSSIERS;
  });

  const [commissionPolicy, setCommissionPolicy] = useState<CommissionPolicyConfig>(() => {
    const saved = localStorage.getItem('auremont_admin_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSION_POLICY;
  });

  const [users, setUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('auremont_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('auremont_admin_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('auremont_admin_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('auremont_admin_kyc', JSON.stringify(kycDossiers));
  }, [kycDossiers]);

  useEffect(() => {
    localStorage.setItem('auremont_admin_commissions', JSON.stringify(commissionPolicy));
  }, [commissionPolicy]);

  useEffect(() => {
    localStorage.setItem('auremont_admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('auremont_admin_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Derived Metrics
  const metrics: PlatformMetrics = {
    totalListingsCount: listings.length,
    pendingListingsCount: listings.filter(l => l.status === 'under_review').length,
    publishedListingsCount: listings.filter(l => l.status === 'published').length,
    pendingKYCCount: kycDossiers.filter(k => k.status === 'under_review').length,
    verifiedProvidersCount: kycDossiers.filter(k => k.status === 'verified').length,
    totalPlatformGMV: listings.reduce((acc, l) => acc + l.price, 0),
    totalAccruedCommission: Math.round(
      listings.reduce((acc, l) => {
        const rate = l.transactionType === 'Buy' ? commissionPolicy.defaultSaleRate : commissionPolicy.defaultRentRate;
        return acc + (l.price * rate);
      }, 0)
    ),
    totalActiveUsers: users.filter(u => u.status === 'active').length
  };

  // Helper to record audit events
  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'operator'>) => {
    const newEntry: AuditLogEntry = {
      id: 'aud_' + Date.now(),
      timestamp: new Date().toISOString(),
      operator: 'Elena Rostova (Compliance Director)',
      ...entry
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Listing Handlers
  const approveListing = (id: string, notes?: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'published',
          lastReviewedDate: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          editorialNotes: notes || l.editorialNotes
        };
      }
      return l;
    }));

    const listing = listings.find(l => l.id === id);
    addAuditEntry({
      action: 'LISTING_APPROVED',
      targetType: 'listing',
      targetId: id,
      targetSummary: listing?.title || id,
      details: `Listing approved for public publication. Notes: ${notes || 'Complies with Auremont editorial standard.'}`
    });
  };

  const requestListingChanges = (id: string, notes: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'changes_requested',
          lastReviewedDate: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          editorialNotes: notes
        };
      }
      return l;
    }));

    const listing = listings.find(l => l.id === id);
    addAuditEntry({
      action: 'LISTING_CHANGES_REQUESTED',
      targetType: 'listing',
      targetId: id,
      targetSummary: listing?.title || id,
      details: `Editorial changes requested from provider: "${notes}"`
    });
  };

  const rejectListing = (id: string, reason: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status: 'rejected',
          lastReviewedDate: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          editorialNotes: reason
        };
      }
      return l;
    }));

    const listing = listings.find(l => l.id === id);
    addAuditEntry({
      action: 'LISTING_REJECTED',
      targetType: 'listing',
      targetId: id,
      targetSummary: listing?.title || id,
      details: `Listing rejected for publishing: "${reason}"`
    });
  };

  const toggleFeaturedListing = (id: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        const nextState = !l.isFeatured;
        addAuditEntry({
          action: 'LISTING_FEATURED_TOGGLED',
          targetType: 'listing',
          targetId: id,
          targetSummary: l.title,
          details: nextState ? 'Designated as Curated Hero Feature.' : 'Removed from Hero Feature queue.'
        });
        return { ...l, isFeatured: nextState };
      }
      return l;
    }));
  };

  // KYC Handlers
  const approveKYC = (id: string, notes?: string) => {
    setKycDossiers(prev => prev.map(k => {
      if (k.id === id) {
        return {
          ...k,
          status: 'verified',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          reviewNotes: notes || k.reviewNotes
        };
      }
      return k;
    }));

    const dossier = kycDossiers.find(k => k.id === id);
    addAuditEntry({
      action: 'KYC_APPROVED',
      targetType: 'provider_kyc',
      targetId: id,
      targetSummary: dossier?.providerName || id,
      details: `Identity and jurisdiction credentials verified. Provider approved to publish listings.`
    });
  };

  const requestKYCInformation = (id: string, notes: string) => {
    setKycDossiers(prev => prev.map(k => {
      if (k.id === id) {
        return {
          ...k,
          status: 'needs_attention',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          reviewNotes: notes
        };
      }
      return k;
    }));

    const dossier = kycDossiers.find(k => k.id === id);
    addAuditEntry({
      action: 'KYC_CHANGES_REQUESTED',
      targetType: 'provider_kyc',
      targetId: id,
      targetSummary: dossier?.providerName || id,
      details: `Additional compliance documentation requested: "${notes}"`
    });
  };

  const rejectKYC = (id: string, reason: string) => {
    setKycDossiers(prev => prev.map(k => {
      if (k.id === id) {
        return {
          ...k,
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Elena Rostova',
          reviewNotes: reason
        };
      }
      return k;
    }));

    const dossier = kycDossiers.find(k => k.id === id);
    addAuditEntry({
      action: 'KYC_REJECTED',
      targetType: 'provider_kyc',
      targetId: id,
      targetSummary: dossier?.providerName || id,
      details: `Provider KYC credentials rejected: "${reason}"`
    });
  };

  // Commission Policy Handlers
  const updateCommissionPolicy = (updates: Partial<CommissionPolicyConfig>) => {
    setCommissionPolicy(prev => {
      const updated = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Elena Rostova (Compliance Director)'
      };
      addAuditEntry({
        action: 'COMMISSION_POLICY_UPDATED',
        targetType: 'commission_policy',
        targetId: 'policy_global',
        targetSummary: 'Platform Commission Structure',
        details: `Updated parameters: ${Object.keys(updates).join(', ')}`
      });
      return updated;
    });
  };

  const addRegionalOverride = (override: Omit<RegionalOverride, 'id'>) => {
    const newOverride: RegionalOverride = {
      id: 'reg_' + Date.now(),
      ...override
    };
    setCommissionPolicy(prev => ({
      ...prev,
      regionalOverrides: [...prev.regionalOverrides, newOverride],
      lastUpdated: new Date().toISOString()
    }));
    addAuditEntry({
      action: 'REGIONAL_OVERRIDE_ADDED',
      targetType: 'commission_policy',
      targetId: newOverride.id,
      targetSummary: `${newOverride.region} (${newOverride.country})`,
      details: `Configured regional rates: Sale ${(newOverride.saleCommissionRate * 100).toFixed(1)}%, Rent ${(newOverride.rentCommissionRate * 100).toFixed(1)}%`
    });
  };

  const removeRegionalOverride = (id: string) => {
    const item = commissionPolicy.regionalOverrides.find(o => o.id === id);
    setCommissionPolicy(prev => ({
      ...prev,
      regionalOverrides: prev.regionalOverrides.filter(o => o.id !== id),
      lastUpdated: new Date().toISOString()
    }));
    if (item) {
      addAuditEntry({
        action: 'REGIONAL_OVERRIDE_DELETED',
        targetType: 'commission_policy',
        targetId: id,
        targetSummary: item.region,
        details: `Removed regional commission override.`
      });
    }
  };

  const toggleRegionalOverride = (id: string) => {
    setCommissionPolicy(prev => ({
      ...prev,
      regionalOverrides: prev.regionalOverrides.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o),
      lastUpdated: new Date().toISOString()
    }));
  };

  // User Governance Handlers
  const updateUserStatus = (id: string, status: UserStatus, reason?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status };
      }
      return u;
    }));
    const user = users.find(u => u.id === id);
    addAuditEntry({
      action: 'USER_STATUS_UPDATED',
      targetType: 'user',
      targetId: id,
      targetSummary: user?.name || id,
      details: `User status shifted to ${status.toUpperCase()}.${reason ? ` Reason: ${reason}` : ''}`
    });
  };

  const updateUserRole = (id: string, role: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role };
      }
      return u;
    }));
    const user = users.find(u => u.id === id);
    addAuditEntry({
      action: 'USER_STATUS_UPDATED',
      targetType: 'user',
      targetId: id,
      targetSummary: user?.name || id,
      details: `Assigned platform role: ${role.toUpperCase()}`
    });
  };

  // CSV Export for Compliance
  const exportAuditLogCsv = (): string => {
    const headers = ['Timestamp', 'Operator', 'Action', 'Target Type', 'Target', 'Details'];
    const rows = auditLogs.map(l => [
      l.timestamp,
      `"${l.operator}"`,
      l.action,
      l.targetType,
      `"${l.targetSummary.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  return (
    <AdminContext.Provider value={{
      listings,
      kycDossiers,
      commissionPolicy,
      users,
      auditLogs,
      metrics,
      approveListing,
      requestListingChanges,
      rejectListing,
      toggleFeaturedListing,
      approveKYC,
      requestKYCInformation,
      rejectKYC,
      updateCommissionPolicy,
      addRegionalOverride,
      removeRegionalOverride,
      toggleRegionalOverride,
      updateUserStatus,
      updateUserRole,
      exportAuditLogCsv
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Lead {
  id: string;
  customerName: string;
  propertyTitle: string;
  date: string;
  status: 'new' | 'contacted' | 'viewing_requested' | 'closed';
  message: string;
}

interface Request {
  id: string;
  customerName: string;
  propertyTitle: string;
  dates: string;
  status: 'pending' | 'approved' | 'declined';
  message: string;
}

interface ProviderTransaction {
  id: string;
  reference: string;
  propertyTitle: string;
  customerName: string;
  type: TransactionType;
  grossAmount: number;
  currency: string;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: 'pending' | 'completed';
  date: string;
}

interface ProviderProperty {
  id: string;
  title: string;
  location: string;
  type: 'sale' | 'rent' | 'lease';
  price: number;
  currency: string;
  status: 'draft' | 'under_review' | 'published' | 'paused' | 'archived';
  availability: 'available' | 'unavailable';
  mainImage: string;
  lastUpdated: string;
}

import { calculateCommission as calcCommission } from '../utils/commission';
import type { TransactionType } from '../utils/commission';

interface ProviderState {
  properties: ProviderProperty[];
  leads: Lead[];
  requests: Request[];
  transactions: ProviderTransaction[];
  calculateCommission: (gross: number, type: TransactionType) => { rate: number, commission: number, net: number };
}

const ProviderContext = createContext<ProviderState | undefined>(undefined);

export function ProviderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAgent = user?.providerRole === 'agent';

  // Commission Business Rules centralized
  const calculateCommission = (gross: number, type: TransactionType) => {
    return calcCommission(gross, type);
  };

  // Mock data based on role
  const mockLeads: Lead[] = isAgent ? [
    { id: 'ld_1', customerName: 'Eleanor Vance', propertyTitle: 'Paris Apartment', date: 'Oct 12, 2023', status: 'new', message: 'I am interested in arranging a viewing for this weekend.' },
    { id: 'ld_2', customerName: 'David Chen', propertyTitle: 'Lisbon House', date: 'Oct 10, 2023', status: 'contacted', message: 'Could you send me the floor plans?' }
  ] : [];

  const mockRequests: Request[] = !isAgent ? [
    { id: 'rq_1', customerName: 'Sophie Laurent', propertyTitle: 'Milan Apartment', dates: 'Nov 1 - Nov 30', status: 'pending', message: 'Looking for a one-month stay while my home is renovated.' }
  ] : [];

  const rawMockTransactions = [
    {
      id: 'tx_prov_1',
      reference: 'TX-89A4B2',
      propertyTitle: 'Alfama Courtyard House',
      customerName: 'James Wilson',
      type: 'rent' as TransactionType,
      grossAmount: 4800,
      currency: '€',
      status: 'completed' as const,
      date: 'Oct 10, 2023'
    },
    ...(isAgent ? [{
      id: 'tx_prov_2',
      reference: 'TX-11B3C9',
      propertyTitle: 'Madrid Apartment',
      customerName: 'Elena Rostova',
      type: 'sale' as TransactionType,
      grossAmount: 1250000,
      currency: '€',
      status: 'pending' as const,
      date: 'Oct 15, 2023'
    }] : [])
  ];

  const mockTransactions: ProviderTransaction[] = rawMockTransactions.map(tx => {
    const { rate, commission, net } = calcCommission(tx.grossAmount, tx.type);
    return {
      ...tx,
      commissionRate: rate,
      commissionAmount: commission,
      netAmount: net,
    };
  });

  const mockProviderProperties: ProviderProperty[] = [
    {
      id: 'prop_p1',
      title: 'Modern Minimalist Apartment',
      location: 'Barcelona, Spain',
      type: 'rent',
      price: 2500,
      currency: '€',
      status: 'published',
      availability: 'available',
      mainImage: '/images/madrid_apartment.jpg',
      lastUpdated: 'Oct 15, 2023'
    },
    {
      id: 'prop_p2',
      title: 'Restored Heritage Villa',
      location: 'Lake Como, Italy',
      type: 'sale',
      price: 3400000,
      currency: '€',
      status: 'under_review',
      availability: 'available',
      mainImage: '/images/milan_apartment.jpg',
      lastUpdated: 'Oct 14, 2023'
    }
  ];

  const [properties] = useState<ProviderProperty[]>(mockProviderProperties);
  const [leads] = useState<Lead[]>(mockLeads);
  const [requests] = useState<Request[]>(mockRequests);
  const [transactions] = useState<ProviderTransaction[]>(mockTransactions);

  return (
    <ProviderContext.Provider value={{ properties, leads, requests, transactions, calculateCommission }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviderState() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProviderState must be used within a ProviderProvider');
  }
  return context;
}

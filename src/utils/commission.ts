export type TransactionType = 'sale' | 'rent' | 'lease' | 'cars' | string;

export interface CommissionResult {
  isConfigured: boolean;
  rate?: number;
  commission?: number;
  net?: number;
  message?: string;
}

/**
 * Calculates Auremont platform commission using centralized business rules.
 * - Property Sale: 10% commission rate
 * - Rental Transaction: 5% commission rate
 * - Lease / Cars / Other: Not yet configured (returns structured unconfigured result)
 * 
 * Uses standard 2-decimal financial rounding. Currencies are preserved and never mixed.
 */
export function calculateCommission(grossAmount: number, type: TransactionType): CommissionResult {
  if (typeof grossAmount !== 'number' || isNaN(grossAmount) || grossAmount < 0) {
    return {
      isConfigured: false,
      message: 'Invalid transaction amount'
    };
  }

  const normalizedType = type ? type.toLowerCase() : '';

  if (normalizedType === 'sale') {
    const rate = 0.10;
    const commission = Math.round(grossAmount * rate * 100) / 100;
    const net = Math.round((grossAmount - commission) * 100) / 100;
    return { isConfigured: true, rate, commission, net };
  }
  
  if (normalizedType === 'rent') {
    const rate = 0.05;
    const commission = Math.round(grossAmount * rate * 100) / 100;
    const net = Math.round((grossAmount - commission) * 100) / 100;
    return { isConfigured: true, rate, commission, net };
  }
  
  // Unconfigured transaction types (Lease, Cars, etc.)
  return { 
    isConfigured: false, 
    message: 'Commission requires configuration' 
  };
}


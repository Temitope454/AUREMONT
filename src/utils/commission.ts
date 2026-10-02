export type TransactionType = 'sale' | 'rent' | 'lease' | 'cars' | string;

export interface CommissionResult {
  rate: number;
  commission: number;
  net: number;
}

export function calculateCommission(grossAmount: number, type: TransactionType): CommissionResult {
  if (type === 'sale') {
    const rate = 0.10;
    const commission = grossAmount * rate;
    const net = grossAmount - commission;
    return { rate, commission, net };
  }
  
  if (type === 'rent') {
    const rate = 0.05;
    const commission = grossAmount * rate;
    const net = grossAmount - commission;
    return { rate, commission, net };
  }
  
  // Lease and Cars, or any other undefined types
  throw new Error('Commission requires configuration.');
}

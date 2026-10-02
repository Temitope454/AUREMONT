import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ConsumerState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  // This is a minimal mock context just to show architecture.
  // In a real app, this would be highly split or managed by a state library / backend queries.
}

const ConsumerContext = createContext<ConsumerState | undefined>(undefined);

export function ConsumerProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(['p-1002', 'p-1008', 'v-2002']);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <ConsumerContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </ConsumerContext.Provider>
  );
}

export function useConsumerState() {
  const context = useContext(ConsumerContext);
  if (context === undefined) {
    throw new Error('useConsumerState must be used within a ConsumerProvider');
  }
  return context;
}

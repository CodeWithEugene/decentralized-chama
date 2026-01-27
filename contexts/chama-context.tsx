'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { useChamaGroup } from '@/hooks/use-chama-group';
import { type ChamaGroup, type Member, type Contribution, type Payout } from '@/lib/contract';

interface ChamaContextType {
  // Wallet state
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletBalance: string;
  connectWallet: () => Promise<string>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  walletError: string | null;

  // Group state
  group: ChamaGroup | null;
  members: Member[];
  contributions: Contribution[];
  payouts: Payout[];
  isLoading: boolean;
  groupError: string | null;

  // Group operations
  addMember: (memberAddress: string, memberName: string) => Promise<string>;
  contribute: (amount: string) => Promise<string>;
  processPayout: (recipientAddress: string, amount: string) => Promise<string>;
  refreshGroupData: () => Promise<void>;
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

interface ChamaProviderProps {
  children: ReactNode;
  groupId?: string;
}

export function ChamaProvider({ children, groupId = 'default' }: ChamaProviderProps) {
  const wallet = useWallet();
  const group = useChamaGroup(groupId);

  const contextValue: ChamaContextType = {
    // Wallet state
    walletAddress: wallet.address,
    isConnected: wallet.isConnected,
    isConnecting: wallet.isConnecting,
    walletBalance: wallet.balance,
    connectWallet: wallet.connect,
    disconnectWallet: wallet.disconnect,
    switchNetwork: wallet.switchNetwork,
    walletError: wallet.error,

    // Group state
    group: group.group,
    members: group.members,
    contributions: group.contributions,
    payouts: group.payouts,
    isLoading: group.isLoading,
    groupError: group.error,

    // Group operations
    addMember: group.addMember,
    contribute: group.contribute,
    processPayout: group.processPayout,
    refreshGroupData: group.refresh,
  };

  return <ChamaContext.Provider value={contextValue}>{children}</ChamaContext.Provider>;
}

export function useChama() {
  const context = useContext(ChamaContext);
  if (!context) {
    throw new Error('useChama must be used within a ChamaProvider');
  }
  return context;
}

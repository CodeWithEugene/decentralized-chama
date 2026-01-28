'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletService } from '@/lib/contract';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: '0',
    error: null,
  });

  // Initialize wallet connection on mount
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const address = await walletService.getConnectedAddress();
        if (address) {
          const balance = await walletService.getBalance(address);
          setState({
            address,
            isConnected: true,
            isConnecting: false,
            balance,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      }
    };

    initializeWallet();

    // specific listener to handle account changes directly from Metamask
    if(typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
               // Re-init or just update address
               initializeWallet();
            } else {
               // Disconnected
               setState(prev => ({ ...prev, address: null, isConnected: false, balance: '0' }));
            }
        });
        window.ethereum.on('chainChanged', () => {
             window.location.reload();
        });
    }

    return () => {
        if(typeof window !== 'undefined' && window.ethereum) {
             window.ethereum.removeListener('accountsChanged', () => {});
             window.ethereum.removeListener('chainChanged', () => {});
        }
    }
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const address = await walletService.connectWallet();
      const balance = await walletService.getBalance(address);
      setState({
        address,
        isConnected: true,
        isConnecting: false,
        balance,
        error: null,
      });
      return address;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await walletService.disconnectWallet();
      setState({
        address: null,
        isConnected: false,
        isConnecting: false,
        balance: '0',
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect wallet';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      await walletService.switchNetwork(chainId);
      setState((prev) => ({ ...prev, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch network';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

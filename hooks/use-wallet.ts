'use client';

import { useState, useCallback, useEffect } from 'react';
import { walletService } from '@/lib/contract';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  error: string | null;
}

export function useWallet() {
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

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
}

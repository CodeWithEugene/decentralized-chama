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

import { useWalletContext } from '@/contexts/wallet-context';

export function useWallet() {
  return useWalletContext();
}

'use client';

import { useState, useCallback } from 'react';
import { contractService } from '@/lib/contract';
import { useWallet } from '@/hooks/use-wallet';
import { createClient } from '@/lib/supabase/client';

interface ChamaFactoryState {
  isCreating: boolean;
  isJoining: boolean;
  error: string | null;
  lastCreatedGroupId: string | null;
}

export function useChamaFactory() {
  const { address } = useWallet();
  const [state, setState] = useState<ChamaFactoryState>({
    isCreating: false,
    isJoining: false,
    error: null,
    lastCreatedGroupId: null,
  });

  const createGroup = useCallback(
    async (name: string, description: string, contributionAmount: string, payoutCycle: number) => {
      setState((prev) => ({ ...prev, isCreating: true, error: null }));
      try {
        const { NETWORKS } = await import('@/lib/contract');
        const targetNetwork = process.env.NEXT_PUBLIC_NETWORK || 'OASIS_SAPPHIRE';
        // @ts-ignore
        const targetChainId = NETWORKS[targetNetwork]?.chainId;

        if (targetChainId) {
             const { walletService } = await import('@/lib/contract');
             await walletService.switchNetwork(targetChainId);
        }

        const cycleInSeconds = payoutCycle * 86400;
        const { txHash, groupId: newGroupId } = await contractService.createGroup(name, description, contributionAmount, cycleInSeconds);
        
        console.log('[v0] Real Group ID from contract:', newGroupId);

        // Dual-write to Supabase
        const supabase = createClient();
        const { error: dbError } = await supabase.from('groups').insert({
            id: newGroupId,
            name,
            description,
            contribution_amount: contributionAmount,
            payout_cycle: payoutCycle,
            treasury_balance: '0'
        });

        if (dbError) console.error('Supabase write failed:', dbError);

        // Add creator as member
        if (address) {
             const { error: memberError } = await supabase.from('members').insert({
                 group_id: newGroupId,
                 address: address.toLowerCase(),
                 name: 'Admin', // Default name, or prompt user?
                 status: 'active',
                 joined_at: new Date().toISOString(),
                 last_contribution: null
             });
             if (memberError) console.error('Supabase member write failed:', memberError);
        }

        if (dbError) console.error('Supabase write failed:', dbError);

        setState((prev) => ({
            ...prev,
            isCreating: false,
            lastCreatedGroupId: newGroupId, 
        }));
        return txHash;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create group';
        setState((prev) => ({
          ...prev,
          isCreating: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  const joinGroup = useCallback(
    async (groupId: string, memberName: string) => {
        if (!address) {
            setState(prev => ({ ...prev, error: 'Wallet not connected' }));
            throw new Error('Wallet not connected');
        }
      setState((prev) => ({ ...prev, isJoining: true, error: null }));
      try {
        const txHash = await contractService.addMember(groupId, address, memberName);
        
        // Dual-write to Supabase
        const supabase = createClient();
        const { error: dbError } = await supabase.from('members').insert({
            group_id: groupId,
            address: address.toLowerCase(),
            name: memberName,
            status: 'active',
            joined_at: new Date().toISOString()
        });

        if (dbError) console.error('Supabase member write failed:', dbError);

        setState((prev) => ({
          ...prev,
          isJoining: false,
        }));
        return txHash;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to join group';
        setState((prev) => ({
          ...prev,
          isJoining: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [address]
  );

  return {
    ...state,
    createGroup,
    joinGroup,
  };
}

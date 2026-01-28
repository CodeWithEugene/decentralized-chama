'use client';

import { useState, useCallback, useEffect } from 'react';
import { contractService, type ChamaGroup, type Member, type Contribution, type Payout } from '@/lib/contract';
import { createClient } from '@/lib/supabase/client';

interface GroupState {
  group: ChamaGroup | null;
  members: Member[];
  contributions: Contribution[];
  payouts: Payout[];
  isLoading: boolean;
  error: string | null;
}

export function useChamaGroup(groupId: string) {
  const [state, setState] = useState<GroupState>({
    group: null,
    members: [],
    contributions: [],
    payouts: [],
    isLoading: false,
    error: null,
  });

  // Load group data
  const loadGroup = useCallback(async () => {
    if (!groupId) {
        setState(prev => ({ ...prev, isLoading: false, group: null }));
        return;
    }
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Fetch from Supabase for faster load, fallback to contract or sync
      const supabase = createClient();
      
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupId);

      if (groupData) {
        // Map Supabase data to ChamaGroup interface
        const group: ChamaGroup = {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description || '',
          totalMembers: membersData?.length || 0,
          treasuryBalance: groupData.treasury_balance ?? '0',
          contributionAmount: groupData.contribution_amount,
          payoutCycle: groupData.payout_cycle,
          createdAt: new Date(groupData.created_at).getTime() / 1000,
          contractAddress: groupData.id, // Assuming ID is address
        };

        // Map members
        // @ts-ignore
        const members: Member[] = membersData?.map(m => ({
          address: m.address,
          name: m.name || '',
          totalContributions: '0', // TODO: Calculate from contributions table
          status: m.status as any,
          joinDate: new Date(m.joined_at).getTime() / 1000,
          lastContribution: m.last_contribution ? new Date(m.last_contribution).getTime() / 1000 : 0,
        })) || [];

        setState({
          group,
          members,
          contributions: [], // Fetch later
          payouts: [], // Fetch later
          isLoading: false,
          error: null,
        });
      } else {
          // Fallback to contract if not in DB 
          // Only attempt if provider is initialized to avoid errors
          const { isProviderInitialized } = await import('@/lib/contract');
          
          if (!isProviderInitialized()) {
             setState((prev) => ({ ...prev, isLoading: false }));
             return;
          }

          const [group, members, contributions, payouts] = await Promise.all([
            contractService.getGroup(groupId),
            contractService.getMembers(groupId),
            contractService.getContributions(groupId),
            contractService.getPayouts(groupId),
          ]);
    
          setState({
            group,
            members,
            contributions,
            payouts,
            isLoading: false,
            error: null,
          });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load group data';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [groupId]);

  // Load data on mount and when groupId changes
  useEffect(() => {
    loadGroup();
  }, [groupId, loadGroup]);

  // Add member
  const addMember = useCallback(
    async (memberAddress: string, memberName: string) => {
      try {
        const txHash = await contractService.addMember(groupId, memberAddress, memberName);
        // Reload members after successful transaction
        const members = await contractService.getMembers(groupId);
        setState((prev) => ({
          ...prev,
          members,
        }));
        return txHash;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [groupId]
  );

  // Contribute
  const contribute = useCallback(
    async (amount: string) => {
      try {
        const txHash = await contractService.contribute(groupId, amount);
        // Reload group and contributions after successful transaction
        const [group, contributions] = await Promise.all([
          contractService.getGroup(groupId),
          contractService.getContributions(groupId),
        ]);
        setState((prev) => ({
          ...prev,
          group,
          contributions,
        }));
        return txHash;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to contribute';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [groupId]
  );

  // Process payout
  const processPayout = useCallback(
    async (recipientAddress: string, amount: string) => {
      try {
        const txHash = await contractService.processPayout(groupId, recipientAddress, amount);
        // Reload payouts and group after successful transaction
        const [payouts, group] = await Promise.all([
          contractService.getPayouts(groupId),
          contractService.getGroup(groupId),
        ]);
        setState((prev) => ({
          ...prev,
          payouts,
          group,
        }));
        return txHash;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process payout';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [groupId]
  );

  // Refresh data
  const refresh = useCallback(async () => {
    await loadGroup();
  }, [loadGroup]);

  return {
    ...state,
    addMember,
    contribute,
    processPayout,
    refresh,
    loadGroup,
  };
}

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useChamaGroup } from '@/hooks/use-chama-group';
import { ContributeDialog } from '@/components/chama-actions';
import { ethers } from 'ethers';

export function ContributionsPage() {
  const { address, isConnected } = useWallet();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch logic reuse
  useEffect(() => {
    const fetchUserGroups = async () => {
        if (!address) return;
        setLoadingGroups(true);
        const supabase = createClient();
        
        const { data: memberRecords } = await supabase
            .from('members')
            .select('group_id')
            .eq('address', address.toLowerCase())
            .eq('status', 'active');
        
        if (memberRecords && memberRecords.length > 0) {
            setActiveGroupId(memberRecords[0].group_id);
        }
        setLoadingGroups(false);
    };

    if (isConnected && address) {
        fetchUserGroups();
    }
  }, [address, isConnected]);

  const { group, contributions, isLoading } = useChamaGroup(activeGroupId || '');

  const tokenSymbol = process.env.NEXT_PUBLIC_NETWORK === 'HEDERA_TESTNET' ? 'HBAR' : (process.env.NEXT_PUBLIC_NETWORK === 'SEPOLIA' ? 'ETH' : 'ROSE');

  const totalContributions = contributions.length;
  // TODO: Add 'status' to contribution interface or assume all are confirmed if on-chain
  const confirmedCount = contributions.length;
  const totalAmount = contributions.reduce((sum, c) => sum + (Number(c.amount)/1e18), 0);

  if (loadingGroups || (activeGroupId && isLoading)) {
     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!activeGroupId && !loadingGroups && isConnected) {
      return <div className="p-8 text-center text-muted-foreground">No active group found. Join a group to see contributions.</div>;
  }

  return (
    <div className="flex-1">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Contributions</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track all member contributions to the group.</p>
          </div>
          {activeGroupId && group && (
            <ContributeDialog 
                groupId={activeGroupId} 
                contributionAmount={group.contributionAmount} 
            />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total Contributions</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{totalAmount.toFixed(2)} {tokenSymbol}</h3>
            <p className="text-xs text-muted-foreground mt-2">{totalContributions} transactions</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Confirmed</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400">{confirmedCount}</h3>
            <p className="text-xs text-muted-foreground mt-2">Successfully processed</p>
          </Card>
           {/* Additional stats if needed */}
        </div>

        {/* Contributions Table - Desktop */}
        <div className="hidden sm:block">
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Member</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Date</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Status</th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contrib, idx) => (
                    <tr
                      key={contrib.timestamp + idx}
                      className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-medium text-foreground text-sm">{contrib.member}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-semibold text-primary text-sm">{Number(contrib.amount)/1e18} {tokenSymbol}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                          {new Date(contrib.timestamp * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                            <CheckCircle size={14} />
                            Confirmed
                          </Badge>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4">
                        <span className="text-xs sm:text-sm text-primary hover:underline font-mono">
                          -
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {contributions.map((contrib, idx) => (
            <Card key={contrib.timestamp + idx} className="p-4 bg-card border-border">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-foreground text-sm">{contrib.member}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                      <CheckCircle size={12} />
                      Confirmed
                    </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary">{Number(contrib.amount)/1e18} {tokenSymbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-xs text-foreground">{new Date(contrib.timestamp * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

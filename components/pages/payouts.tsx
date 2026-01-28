'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, TrendingDown, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useChamaGroup } from '@/hooks/use-chama-group';

export function PayoutsPage() {
  const { address, isConnected } = useWallet();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    const fetchUserGroups = async () => {
        if (!address) return;
        setLoadingGroups(true);
        const supabase = createClient();
        
        const { data: memberRecords } = await supabase
            .from('members')
            .select('group_id')
            .eq('address', address.toLowerCase()) // Ensure address case matches DB
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

  const { payouts, group, isLoading } = useChamaGroup(activeGroupId || '');

  const tokenSymbol = process.env.NEXT_PUBLIC_NETWORK === 'HEDERA_TESTNET' ? 'HBAR' : (process.env.NEXT_PUBLIC_NETWORK === 'SEPOLIA' ? 'ETH' : 'ROSE');

  // Since we only have 'amount', 'recipient', 'timestamp' from hook/contract currently
  const completedPayouts = payouts.length; 
  const totalPayouts = payouts.reduce((sum, p) => sum + (Number(p.amount)/1e18), 0);
  // Next payout logic would require group cycle info
  const nextPayoutDate = group ? new Date(Date.now() + (group.payoutCycle * 1000)).toLocaleDateString() : '---';

  if (loadingGroups || (activeGroupId && isLoading)) {
     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!activeGroupId && !loadingGroups && isConnected) {
      return <div className="p-8 text-center text-muted-foreground">No active group found. Join a group to see payouts.</div>;
  }

  return (
    <div className="flex-1">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Payouts</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage and track payout rounds for group members.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total Paid Out</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{totalPayouts.toFixed(2)} {tokenSymbol}</h3>
            <p className="text-xs text-muted-foreground mt-2">{completedPayouts} completed payouts</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Next Payout</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400">---</h3>
            <p className="text-xs text-muted-foreground mt-2">Due: {nextPayoutDate}</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Payout Amount</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-400">
                {group ? (Number(group.contributionAmount) * Number(group.totalMembers) / 1e18).toFixed(0) : '---'} {tokenSymbol}
            </h3>
            <p className="text-xs text-muted-foreground mt-2">Estimated per round</p>
          </Card>
           {/* Removed Pending Payouts card as we don't calculate them yet */}
        </div>

        {/* Removed 'Upcoming Payout Alert' as it was hardcoded */}

        {/* Payouts Table - Desktop */}
        <div className="hidden sm:block">
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Recipient</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Date</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout, idx) => (
                    <tr
                      key={payout.timestamp + idx}
                      className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-medium text-foreground text-sm">{payout.recipient}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-semibold text-primary flex items-center gap-2 text-sm">
                          <TrendingDown size={16} />
                          {Number(payout.amount)/1e18} {tokenSymbol}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                          {new Date(payout.timestamp * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                            <Check size={14} />
                            Completed
                          </Badge>
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                      <tr>
                          <td colSpan={4} className="p-8 text-center text-muted-foreground">No payouts yet.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {payouts.map((payout, idx) => (
            <Card key={payout.timestamp + idx} className="p-4 bg-card border-border">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-foreground text-sm">{payout.recipient}</p>
                    <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                      <Check size={12} />
                      Completed
                    </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary flex items-center gap-1 text-sm">
                      <TrendingDown size={14} />
                      {Number(payout.amount)/1e18} {tokenSymbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-xs text-foreground">{new Date(payout.timestamp * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {payouts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No payouts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

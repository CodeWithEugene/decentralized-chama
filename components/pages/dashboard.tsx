'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Zap, Wallet, Loader2 } from 'lucide-react';
import { SimpleLineChart } from '@/components/charts/line-chart';
import { CreateChamaDialog, JoinChamaDialog } from '@/components/chama-actions';
import { useWallet } from '@/hooks/use-wallet';
import { useChamaGroup } from '@/hooks/use-chama-group';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export function DashboardPage() {
  const { address, isConnected, connect } = useWallet();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  
  // Fetch user's groups
  useEffect(() => {
    const fetchUserGroups = async () => {
        if (!address) return;
        setLoadingGroups(true);
        const supabase = createClient();
        
        // Find groups where member address matches
        const { data: memberRecords } = await supabase
            .from('members')
            .select('group_id')
            .eq('address', address) // Ensure address case matches DB
            .eq('status', 'active');
        
        if (memberRecords && memberRecords.length > 0) {
            // Pick first group for now
            setActiveGroupId(memberRecords[0].group_id);
        }
        setLoadingGroups(false);
    };

    if (isConnected && address) {
        fetchUserGroups();
    }
  }, [address, isConnected]);

  const { group, members, contributions, payouts, isLoading: isGroupLoading } = useChamaGroup(activeGroupId || '');

  const stats = [
    {
      label: 'Total Balance',
      value: group ? `${Number(group.treasuryBalance) / 1e18} HBAR` : '---', // Assuming 18 decimals
      subtext: 'Group Treasury',
      icon: Wallet,
      color: 'text-purple-400',
    },
    {
      label: 'Contribution Amount',
      value: group ? `${Number(group.contributionAmount) / 1e18} HBAR` : '---',
      subtext: 'Per member/cycle',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      label: 'Members',
      value: group ? group.totalMembers.toString() : '---',
      subtext: 'Active participants',
      icon: Users,
      color: 'text-green-400',
    },
    {
      label: 'Next Payout',
      value: group ? `${group.payoutCycle / 86400} days` : '---',
      subtext: 'Cycle duration',
      icon: Zap,
      color: 'text-yellow-400',
    },
  ];

  if (loadingGroups || (activeGroupId && isGroupLoading)) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
      );
  }

  if (!activeGroupId && !loadingGroups && isConnected) {
       return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Active Group Found</h2>
            <p className="text-muted-foreground mb-8">You haven't joined any Chama groups yet.</p>
            <div className="flex gap-4 justify-center">
                <CreateChamaDialog />
                <JoinChamaDialog />
            </div>
        </div>
       )
  }

  if (!isConnected) {
    return (
     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
         <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
         <p className="text-muted-foreground mb-8">Please connect your wallet to view your dashboard.</p>
         <Button onClick={() => connect()} className="gap-2">
            <Wallet size={16} />
            Connect Wallet
         </Button>
     </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 max-w-7xl mx-auto w-full flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
              {group ? `Overview for ${group.name}` : "Welcome back! Here's your savings group overview."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 sm:p-6 bg-card border-border">
                <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{stat.label}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{stat.subtext}</p>
                  </div>
                  <Icon className={`${stat.color} w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ml-2`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 flex-grow">
          {/* Contribution Chart */}
          <Card className="lg:col-span-2 p-4 sm:p-6 bg-card border-border flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">Contribution History</h2>
            <div className="w-full flex-grow">
              <SimpleLineChart /> 
              {/* NOTE: Chart still uses internal dummy data, needs refactor but out of scope for strict 'remove dummy text' unless requested */}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {/* Combine contributions and payouts for activity feed */}
               {contributions.length === 0 && payouts.length === 0 ? (
                   <p className="text-sm text-muted-foreground">No recent activity.</p>
               ) : (
                   [...contributions, ...payouts]
                   .sort((a,b) => b.timestamp - a.timestamp)
                   .slice(0, 5)
                   .map((item, idx) => {
                       const isPayout = 'recipient' in item;
                       const amountLabel = `${Number(item.amount)/1e18} HBAR`;
                       return (
                        <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0 gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-foreground truncate">
                                    {isPayout ? `Payout to ${(item as any).recipient.slice(0,6)}...` : `Contribution from ${(item as any).member.slice(0,6)}...`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(item.timestamp * 1000).toLocaleDateString()}
                                </p>
                            </div>
                            <p className={`text-xs sm:text-sm font-semibold flex-shrink-0 ${isPayout ? 'text-red-400' : 'text-green-400'}`}>
                                {isPayout ? `-${amountLabel}` : `+${amountLabel}`}
                            </p>
                        </div>
                       );
                   })
               )}
            </div>
          </Card>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            Make Contribution
          </Button>
          <CreateChamaDialog />
          <JoinChamaDialog />
        </div>
      </div>
    </div>
  );
}

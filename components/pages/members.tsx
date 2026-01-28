'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Plus, Loader2 } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useChamaGroup } from '@/hooks/use-chama-group';

export function MembersPage() {
  const { address, isConnected } = useWallet();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch user's active group (reused logic)
  useEffect(() => {
    const fetchUserGroups = async () => {
        if (!address) return;
        setLoadingGroups(true);
        const supabase = createClient();
        
        const { data: memberRecords } = await supabase
            .from('members')
            .select('group_id')
            .eq('address', address)
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

  const { members, isLoading } = useChamaGroup(activeGroupId || '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loadingGroups || (activeGroupId && isLoading)) {
     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!activeGroupId && !loadingGroups && isConnected) {
      return <div className="p-8 text-center text-muted-foreground">No active group found. Join a group to see members.</div>;
  }

  return (
    <div className="flex-1">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Members</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage group members and their contributions.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
            <Plus size={18} />
            Add Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total Members</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{members.length}</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Active Members</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{members.filter(m => m.status === 'active').length}</p>
          </Card>
           {/* Add logic for pending/inactive if available in contract/DB */}
        </div>

        {/* Members Table - Desktop */}
        <div className="hidden sm:block">
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Name</th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Address</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Status</th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Joined</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, idx) => (
                    <tr key={member.address} className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-medium text-foreground text-sm">{member.name || 'Unknown'}</p>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground font-mono">{member.address}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <Badge className={`${getStatusColor(member.status)} border-0 capitalize text-xs`}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">
                          {new Date(member.joinDate * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        <button className="p-2 hover:bg-card rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-muted-foreground" />
                        </button>
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
          {members.map((member) => (
            <Card key={member.address} className="p-4 bg-card border-border">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-foreground">{member.name || 'Unknown'}</p>
                  <Badge className={`${getStatusColor(member.status)} border-0 capitalize text-xs`}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{member.address}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

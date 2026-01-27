'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Plus } from 'lucide-react';

const members = [
  {
    id: 1,
    name: 'John Smith',
    address: '0x742d...9f2c',
    contributions: '$2,500',
    status: 'active',
    joinDate: 'Jan 2024',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    address: '0x8a2f...3e1b',
    contributions: '$2,100',
    status: 'active',
    joinDate: 'Jan 2024',
  },
  {
    id: 3,
    name: 'Michael Chen',
    address: '0x5c4e...7d92',
    contributions: '$1,800',
    status: 'active',
    joinDate: 'Feb 2024',
  },
  {
    id: 4,
    name: 'Emily Davis',
    address: '0x9b3a...4f8c',
    contributions: '$2,200',
    status: 'pending',
    joinDate: 'Mar 2024',
  },
  {
    id: 5,
    name: 'James Wilson',
    address: '0x2e6d...1a9f',
    contributions: '$0',
    status: 'inactive',
    joinDate: 'Jan 2024',
  },
  {
    id: 6,
    name: 'Lisa Martinez',
    address: '0x7f5b...8e3c',
    contributions: '$2,350',
    status: 'active',
    joinDate: 'Mar 2024',
  },
];

export function MembersPage() {
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Members</h1>
            <p className="text-muted-foreground">Manage group members and their contributions.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus size={18} />
            Add Member
          </Button>
        </div>

        {/* Members Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Contributions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, idx) => (
                  <tr key={member.id} className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{member.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{member.address}</td>
                    <td className="px-6 py-4 font-semibold text-primary">{member.contributions}</td>
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(member.status)} border-0 capitalize`}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{member.joinDate}</td>
                    <td className="px-6 py-4 text-center">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Members</p>
            <p className="text-3xl font-bold text-foreground">12</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Active Members</p>
            <p className="text-3xl font-bold text-green-400">10</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-400">2</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

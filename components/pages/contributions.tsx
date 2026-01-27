'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, CheckCircle, Clock } from 'lucide-react';

const contributions = [
  {
    id: 1,
    member: 'John Smith',
    amount: '$500',
    date: '2024-03-15',
    status: 'confirmed',
    txHash: '0x1234...5678',
  },
  {
    id: 2,
    member: 'Sarah Johnson',
    amount: '$500',
    date: '2024-03-14',
    status: 'confirmed',
    txHash: '0x2345...6789',
  },
  {
    id: 3,
    member: 'Michael Chen',
    amount: '$500',
    date: '2024-03-13',
    status: 'confirmed',
    txHash: '0x3456...7890',
  },
  {
    id: 4,
    member: 'Emily Davis',
    amount: '$500',
    date: '2024-03-12',
    status: 'pending',
    txHash: '0x4567...8901',
  },
  {
    id: 5,
    member: 'You (John Smith)',
    amount: '$500',
    date: '2024-03-11',
    status: 'confirmed',
    txHash: '0x5678...9012',
  },
  {
    id: 6,
    member: 'Lisa Martinez',
    amount: '$400',
    date: '2024-03-10',
    status: 'confirmed',
    txHash: '0x6789...0123',
  },
];

export function ContributionsPage() {
  const totalContributions = contributions.length;
  const confirmedCount = contributions.filter((c) => c.status === 'confirmed').length;
  const totalAmount = contributions.reduce((sum, c) => sum + parseInt(c.amount.replace('$', '')), 0);

  return (
    <div className="flex-1">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Contributions</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track all member contributions to the group.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
            <ArrowUp size={18} />
            Make Contribution
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total Contributions</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">${totalAmount}</h3>
            <p className="text-xs text-muted-foreground mt-2">{totalContributions} transactions</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Confirmed</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400">{confirmedCount}</h3>
            <p className="text-xs text-muted-foreground mt-2">Successfully processed</p>
          </Card>
          <Card className="p-4 sm:p-6 bg-card border-border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">Average per Member</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-400">${Math.round(totalAmount / totalContributions)}</h3>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </Card>
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
                      key={contrib.id}
                      className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-medium text-foreground text-sm">{contrib.member}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="font-semibold text-primary text-sm">{contrib.amount}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground">{contrib.date}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        {contrib.status === 'confirmed' ? (
                          <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                            <CheckCircle size={14} />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-0 gap-1 flex w-fit text-xs">
                            <Clock size={14} />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4">
                        <a
                          href="#"
                          className="text-xs sm:text-sm text-primary hover:underline font-mono"
                        >
                          {contrib.txHash}
                        </a>
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
          {contributions.map((contrib) => (
            <Card key={contrib.id} className="p-4 bg-card border-border">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-foreground text-sm">{contrib.member}</p>
                  {contrib.status === 'confirmed' ? (
                    <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit text-xs">
                      <CheckCircle size={12} />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-0 gap-1 flex w-fit text-xs">
                      <Clock size={12} />
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary">{contrib.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-xs text-foreground">{contrib.date}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline font-mono block pt-2 border-t border-border"
                >
                  {contrib.txHash}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

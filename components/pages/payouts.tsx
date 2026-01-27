'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, TrendingDown } from 'lucide-react';

const payouts = [
  {
    id: 1,
    recipient: 'John Smith',
    amount: '$1,200',
    date: '2024-02-20',
    status: 'completed',
    round: 1,
  },
  {
    id: 2,
    recipient: 'Sarah Johnson',
    amount: '$1,200',
    date: '2024-02-20',
    status: 'completed',
    round: 1,
  },
  {
    id: 3,
    recipient: 'Michael Chen',
    amount: '$1,200',
    date: '2024-02-20',
    status: 'completed',
    round: 1,
  },
  {
    id: 4,
    recipient: 'Emily Davis',
    amount: '$1,200',
    date: '2024-03-20',
    status: 'pending',
    round: 2,
  },
  {
    id: 5,
    recipient: 'James Wilson',
    amount: '$1,200',
    date: '2024-03-20',
    status: 'pending',
    round: 2,
  },
  {
    id: 6,
    recipient: 'Lisa Martinez',
    amount: '$1,200',
    date: '2024-03-20',
    status: 'pending',
    round: 2,
  },
];

export function PayoutsPage() {
  const completedPayouts = payouts.filter((p) => p.status === 'completed').length;
  const totalPayouts = payouts.reduce((sum, p) => sum + parseInt(p.amount.replace('$', '')), 0);
  const nextPayoutDate = payouts.find((p) => p.status === 'pending')?.date || 'N/A';

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Payouts</h1>
          <p className="text-muted-foreground">Manage and track payout rounds for group members.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Total Paid Out</p>
            <h3 className="text-3xl font-bold text-foreground">${totalPayouts}</h3>
            <p className="text-xs text-muted-foreground mt-2">{completedPayouts} completed payouts</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Next Payout Round</p>
            <h3 className="text-3xl font-bold text-yellow-400">2</h3>
            <p className="text-xs text-muted-foreground mt-2">Due: {nextPayoutDate}</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Payout Amount</p>
            <h3 className="text-3xl font-bold text-blue-400">$1,200</h3>
            <p className="text-xs text-muted-foreground mt-2">Per member per round</p>
          </Card>
        </div>

        {/* Upcoming Payout Alert */}
        <Card className="p-6 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Round 2 Payout In Progress</h3>
              <p className="text-sm text-muted-foreground">
                6 members awaiting payout. Estimated completion: March 20, 2024
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View Details
            </Button>
          </div>
        </Card>

        {/* Payouts Table */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Recipient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Round</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, idx) => (
                  <tr
                    key={payout.id}
                    className={`border-b border-border last:border-b-0 hover:bg-card/50 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-card/30'}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{payout.recipient}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary flex items-center gap-2">
                        <TrendingDown size={16} />
                        {payout.amount}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payout.date}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-muted text-foreground border-0">Round {payout.round}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {payout.status === 'completed' ? (
                        <Badge className="bg-green-500/20 text-green-400 border-0 gap-1 flex w-fit">
                          <Check size={14} />
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-0 gap-1 flex w-fit">
                          <Clock size={14} />
                          Pending
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payout History Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Completed Rounds</h3>
            <div className="space-y-3">
              {[
                { round: 1, date: 'Feb 2024', total: '$7,200' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
                  <div>
                    <p className="font-medium text-foreground">Round {item.round}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <p className="text-lg font-bold text-green-400">{item.total}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payout Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Every 30 days</p>
                  <p className="text-xs text-muted-foreground">Standard rotation period</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">One member per cycle</p>
                  <p className="text-xs text-muted-foreground">Based on group size (12 members)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Treasury funds</p>
                  <p className="text-xs text-muted-foreground">From collective contributions</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

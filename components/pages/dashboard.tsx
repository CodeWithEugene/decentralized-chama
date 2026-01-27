'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Zap, Wallet } from 'lucide-react';
import { SimpleLineChart } from '@/components/charts/line-chart';

export function DashboardPage() {
  const stats = [
    {
      label: 'Total Balance',
      value: '$12,450',
      subtext: 'Group Treasury',
      icon: Wallet,
      color: 'text-purple-400',
    },
    {
      label: 'Your Contribution',
      value: '$2,500',
      subtext: 'of next payout cycle',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      label: 'Members',
      value: '12',
      subtext: 'Active participants',
      icon: Users,
      color: 'text-green-400',
    },
    {
      label: 'Next Payout',
      value: '18 days',
      subtext: 'Estimated duration',
      icon: Zap,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your savings group overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 bg-card border-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                  </div>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contribution Chart */}
          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Contribution History</h2>
            <SimpleLineChart />
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { action: 'John contributed', amount: '+$500' },
                { action: 'Payout processed', amount: '-$1200' },
                { action: 'Sarah contributed', amount: '+$300' },
                { action: 'Member joined', amount: '+1' },
                { action: 'You contributed', amount: '+$500' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-sm font-semibold text-primary">{item.amount}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Make Contribution
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-card bg-transparent">
            View Group Details
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Zap, Wallet } from 'lucide-react';
import { SimpleLineChart } from '@/components/charts/line-chart';
import { CreateChamaDialog, JoinChamaDialog } from '@/components/chama-actions';

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
    <div className="flex-1 flex flex-col">
      <div className="p-4 max-w-7xl mx-auto w-full flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your savings group overview.</p>
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
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{stat.value}</h3>
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
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { action: 'John contributed', amount: '+$500' },
                { action: 'Payout processed', amount: '-$1200' },
                { action: 'Sarah contributed', amount: '+$300' },
                { action: 'Member joined', amount: '+1' },
                { action: 'You contributed', amount: '+$500' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-b-0 gap-2">
                  <p className="text-xs sm:text-sm text-foreground truncate flex-1">{item.action}</p>
                  <p className="text-xs sm:text-sm font-semibold text-primary flex-shrink-0">{item.amount}</p>
                </div>
              ))}
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

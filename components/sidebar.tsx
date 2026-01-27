'use client';

import { Home, Users, TrendingUp, Send, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'contributions', label: 'Contributions', icon: TrendingUp },
    { id: 'payouts', label: 'Payouts', icon: Send },
  ];

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-sidebar border-sidebar-border"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col p-6 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">CHAMA</h1>
          <p className="text-xs text-muted-foreground mt-1">Savings Group dApp</p>
        </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium hidden sm:inline">{item.label}</span>
              <span className="font-medium sm:hidden">{item.label}</span>
            </button>
          );
        })}
      </nav>

        {/* User Section */}
        <div className="pt-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary/30 flex items-center justify-center">
              <span className="text-sm font-bold text-sidebar-primary-foreground">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">John Smith</p>
              <p className="text-xs text-muted-foreground truncate">0x742d...9f2c</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => console.log('Disconnect wallet')}
          >
            <LogOut size={18} />
            Disconnect
          </Button>
        </div>
      </aside>
    </>
  );
}

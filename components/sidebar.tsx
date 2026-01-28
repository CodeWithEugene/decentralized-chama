'use client';

import { ThemeToggle } from './theme-toggle';
import { Home, Users, TrendingUp, Send, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed, onCollapse }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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

      <aside
        className={`fixed lg:relative h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20 p-4' : 'w-64 p-6'} z-40`}
      >
        <div className="flex items-center justify-center">
          {!isCollapsed && <img src="/logo.png" alt="Chama Logo" className="h-8 w-auto" />}
          {isCollapsed && <img src="/icon.png" alt="Chama Icon" className="h-8 w-8" />}
        </div>
        
        <nav className="flex-1 space-y-2 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-sidebar-border mt-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10 ${isCollapsed ? 'justify-center' : ''}`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!isCollapsed && 'Logout'}
          </Button>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

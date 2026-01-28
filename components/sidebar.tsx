'use client';

// Imports updated to remove ThemeToggle
import { Home, Users, TrendingUp, Send, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
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
        className={`fixed lg:relative h-[100svh] bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20 p-4' : 'w-64 p-4 sm:p-6'} z-40 overflow-y-auto lg:overflow-visible`}
      >
        <div className="relative flex items-center justify-center h-12 sm:h-16 my-2 sm:my-4 flex-shrink-0">
          {!isCollapsed ? (
            <div className="relative h-10 w-32 sm:h-12 sm:w-40">
                <Image src="/logo.png" alt="Chama Logo" fill className="object-contain" priority />
            </div>
          ) : (
            <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                 <Image src="/icon.png" alt="Chama Icon" fill className="object-contain" priority />
            </div>
          )}
        </div>
        
        <nav className="flex-1 space-y-1 sm:space-y-2 mt-4 sm:mt-8 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                } ${isCollapsed ? 'justify-center px-2' : 'px-3 sm:px-4'}`}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 sm:pt-6 border-t border-sidebar-border mt-auto flex items-center justify-between flex-shrink-0">
          <Button
            className={`w-full justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {!isCollapsed && 'Logout'}
          </Button>
          {/* ThemeToggle removed as requested */}
        </div>
      </aside>
    </>
  );
}

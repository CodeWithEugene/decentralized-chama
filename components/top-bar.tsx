'use client';

import { Menu, Settings, Wallet, Sun, Moon, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/use-wallet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export function TopBar({ onToggleSidebar, isSidebarCollapsed }: TopBarProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { address, connect, isConnected, disconnect } = useWallet();
  const [userProfile, setUserProfile] = useState<{ email: string | null }>({ email: null });

  useEffect(() => {
    setMounted(true);
    // Fetch Supabase user
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserProfile({ email: user.email || null });
        }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (isConnected) await disconnect();
    router.push('/');
  };

  const truncateAddress = (addr: string) => {
      if (!addr) return '';
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="w-full h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <div className="hidden md:flex items-center gap-2">
            {/* Breadcrumbs or Page Title could go here */}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        )}

        {/* Settings Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Manage your account settings and preferences.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input id="address" value={address || 'Not connected'} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userProfile.email || ''} disabled />
                </div>
              </TabsContent>
              <TabsContent value="preferences" className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <Switch id="marketing" />
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Wallet / User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          {isConnected ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex gap-2 mr-2"
              >
                <Wallet size={16} />
                <span>{truncateAddress(address!)}</span>
              </Button>
          ) : (
             <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex gap-2 mr-2"
                onClick={() => connect()}
              >
                <Wallet size={16} />
                <span>Connect Wallet</span>
              </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                   {userProfile.email ? userProfile.email[0].toUpperCase() : <User size={16} />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userProfile.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-500/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

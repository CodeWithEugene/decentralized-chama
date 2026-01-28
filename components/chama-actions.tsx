'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Users, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChamaGroup } from '@/hooks/use-chama-group';
import { useChamaFactory } from '@/hooks/use-chama-factory';

export function CreateChamaDialog() {
  const [open, setOpen] = useState(false);
  const { createGroup, isCreating, error } = useChamaFactory();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    payoutCycle: '30', // days
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup(
        formData.name,
        formData.description,
        formData.contributionAmount,
        parseInt(formData.payoutCycle)
      );
      setOpen(false);
      window.location.reload();
    } catch (err) {
      // Error handled in hook (state.error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" /> Create Chama
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chama</DialogTitle>
          <DialogDescription>
            Set up your decentralized savings group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount ({process.env.NEXT_PUBLIC_NETWORK === 'HEDERA_TESTNET' ? 'HBAR' : (process.env.NEXT_PUBLIC_NETWORK === 'SEPOLIA' ? 'ETH' : 'ROSE')})
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
              className="col-span-3"
              required
              placeholder="100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cycle" className="text-right">
              Cycle (Days)
            </Label>
            <Input
              id="cycle"
              type="number"
              value={formData.payoutCycle}
              onChange={(e) => setFormData({ ...formData, payoutCycle: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JoinChamaDialog() {
  const [open, setOpen] = useState(false);
  const { joinGroup, isJoining, error } = useChamaFactory();
  const [formData, setFormData] = useState({
    groupId: '',
    memberName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinGroup(formData.groupId, formData.memberName);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border text-foreground hover:bg-card bg-transparent w-full sm:w-auto gap-2">
            <Users className="w-4 h-4" /> Join Chama
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join an Existing Chama</DialogTitle>
          <DialogDescription>
            Enter the Group ID to join a savings group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="groupId" className="text-right">
              Group ID
            </Label>
              <Input
                id="groupId"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="col-span-3"
                placeholder="1"
                required
              />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memberName" className="text-right">
              Your Name
            </Label>
            <Input
              id="memberName"
              value={formData.memberName}
              onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
              className="col-span-3"
              placeholder="John Doe"
              required
            />
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isJoining}>
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function ContributeDialog({ groupId, contributionAmount }: { groupId: string, contributionAmount: string }) {
  const [open, setOpen] = useState(false);
  const { contribute, isLoading } = useChamaGroup(groupId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await contribute(contributionAmount);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Contribution failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const tokenSymbol = process.env.NEXT_PUBLIC_NETWORK === 'HEDERA_TESTNET' ? 'HBAR' : (process.env.NEXT_PUBLIC_NETWORK === 'SEPOLIA' ? 'ETH' : 'ROSE');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto gap-2">
            <Wallet className="w-4 h-4" /> Make Contribution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Contribution</DialogTitle>
          <DialogDescription>
            Contribute to your Chama savings pool.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Standard Contribution</p>
            <p className="text-3xl font-bold text-foreground">
                {contributionAmount} {tokenSymbol}
            </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={isProcessing || isLoading}>
            {isProcessing ? 'Processing...' : 'Confirm Contribution'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddMemberDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const { addMember, isLoading } = useChamaGroup(groupId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await addMember(formData.address, formData.name);
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to add member:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your Chama.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memAddress" className="text-right">
              Address
            </Label>
            <Input
              id="memAddress"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="col-span-3"
              placeholder="0x..."
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memName" className="text-right">
              Name
            </Label>
            <Input
              id="memName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3"
              placeholder="Member Name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isProcessing || isLoading}>
              {isProcessing ? 'Processing...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

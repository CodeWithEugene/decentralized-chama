'use client';

import { ethers } from 'ethers';
import './web3-types';
import { contractAbi, contractAddress } from './contract-config';
import { sapphireTestnet } from 'viem/chains';
import { createClient } from './supabase/client';

// ============================================================================
// CONFIGURATION - Update these with your contract details
// ============================================================================

// Network Configuration
// Network Configuration
export const NETWORKS = {
  HEDERA_TESTNET: {
    chainId: 296,
    name: 'Hedera Testnet',
    rpcUrl: 'https://testnet.hashio.io/api',
  },
  OASIS_SAPPHIRE: {
    chainId: 23295,
    name: 'Oasis Sapphire Testnet',
    rpcUrl: 'https://testnet.sapphire.oasis.io',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://ethereum-sepolia.publicnode.com',
  },
};

// Contract Configuration - UPDATE THESE with your deployed contract details
export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  network: process.env.NEXT_PUBLIC_NETWORK || 'OASIS_SAPPHIRE',
};

// Minimal ABI for Chama contract - UPDATE THIS with your actual contract ABI
const CHAMA_CONTRACT_ABI = [
  // Group functions
  'function getGroup(string groupId) view returns (tuple(string id, string name, string description, uint256 totalMembers, uint256 treasuryBalance, uint256 contributionAmount, uint256 payoutCycle, uint256 createdAt, address contractAddress))',
  'function getMembers(string groupId) view returns (tuple(address addr, string name, uint256 totalContributions, uint8 status, uint256 joinDate, uint256 lastContribution)[])',
  'function createGroup(string name, string description, uint256 contributionAmount, uint256 payoutCycle) external returns (string)',
  'function addMember(string groupId, address memberAddress, string memberName) external',
  'function removeMember(string groupId, address memberAddress) external',
  
  // Contribution functions
  'function contribute(string groupId, uint256 amount) external',
  'function getContributions(string groupId, uint256 limit) view returns (tuple(string id, address member, uint256 amount, uint256 timestamp, string transactionHash, uint8 status)[])',
  
  // Payout functions
  'function processPayout(string groupId, address recipient, uint256 amount) external',
  'function getPayouts(string groupId, uint256 round) view returns (tuple(string id, address recipient, uint256 amount, uint256 round, uint8 status, string transactionHash, uint256 timestamp)[])',
  'function getCurrentRound(string groupId) view returns (uint256)',
  'function getNextPayoutRecipient(string groupId) view returns (address)',
  'event GroupCreated(string groupId, address indexed groupAddress, string name)',
];

// ============================================================================
// TYPES
// ============================================================================

export interface ChamaGroup {
  id: string;
  name: string;
  description: string;
  totalMembers: number;
  treasuryBalance: string;
  contributionAmount: string;
  payoutCycle: number;
  createdAt: number;
  contractAddress: string;
}

export interface Member {
  address: string;
  name: string;
  totalContributions: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: number;
  lastContribution: number;
}

export interface Contribution {
  id: string;
  member: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface Payout {
  id: string;
  recipient: string;
  amount: string;
  round: number;
  status: 'pending' | 'completed' | 'failed';
  transactionHash: string;
  timestamp: number;
}

// ============================================================================
// PROVIDER & SIGNER MANAGEMENT
// ============================================================================

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;

export function isProviderInitialized(): boolean {
  return !!provider;
}

/**
 * Initialize ethers.js provider and signer with MetaMask
 */
export async function initializeProvider(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (!window.ethereum) {
    throw new ContractError(
      'MetaMask is not installed. Please install MetaMask to use this dApp.',
      'NO_WALLET'
    );
  }

  // Create provider from MetaMask
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  
  console.log('[v0] Provider initialized with address:', await signer.getAddress());
}

/**
 * Get the current provider instance
 */
export function getProvider(): ethers.BrowserProvider {
  if (!provider) {
    throw new ContractError(
      'Provider not initialized. Call initializeProvider first.',
      'PROVIDER_NOT_INITIALIZED'
    );
  }
  return provider;
}

/**
 * Get the current signer instance
 */
export async function getSigner(): Promise<ethers.Signer> {
    const currentProvider = getProvider();
    const currentSigner = await currentProvider.getSigner();
    if (!currentSigner) {
        throw new ContractError(
        'Signer not initialized. Call initializeProvider first.',
        'SIGNER_NOT_INITIALIZED'
        );
    }
    return currentSigner;
}

/**
 * Get contract instance with signer (for write operations)
 */
async function getChamaContract() {
  const contractSigner = await getSigner();
  return new ethers.Contract(
    CONTRACT_CONFIG.address,
    CHAMA_CONTRACT_ABI,
    contractSigner
  );
}

/**
 * Get contract instance with provider (for read-only operations)
 */
function getChamaContractReadOnly() {
  const contractProvider = getProvider();
  return new ethers.Contract(
    CONTRACT_CONFIG.address,
    CHAMA_CONTRACT_ABI,
    contractProvider
  );
}

// ============================================================================
// CONTRACT SERVICE - Real blockchain interactions
// ============================================================================

export const contractService = {
  /**
   * Get group details from blockchain
   */
  async getGroup(groupId: string): Promise<ChamaGroup> {
    try {
      const contract = getChamaContractReadOnly();
      const groupData = await contract.getGroup(groupId);
      
      return {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        totalMembers: Number(groupData.totalMembers),
        treasuryBalance: ethers.formatEther(groupData.treasuryBalance),
        contributionAmount: ethers.formatEther(groupData.contributionAmount),
        payoutCycle: Number(groupData.payoutCycle),
        createdAt: Number(groupData.createdAt),
        contractAddress: groupData.contractAddress,
      };
    } catch (error) {
      console.error('[v0] Error fetching group:', error);
      throw new ContractError(
        `Failed to fetch group ${groupId}`,
        'GET_GROUP_FAILED'
      );
    }
  },

  /**
   * Get all members of a group
   */
  async getMembers(groupId: string): Promise<Member[]> {
    try {
      const contract = getChamaContractReadOnly();
      const membersData = await contract.getMembers(groupId);
      
      return membersData.map((m: any) => ({
        address: m.addr,
        name: m.name,
        totalContributions: ethers.formatEther(m.totalContributions),
        status: ['active', 'pending', 'inactive'][m.status] || 'inactive',
        joinDate: Number(m.joinDate),
        lastContribution: Number(m.lastContribution),
      }));
    } catch (error) {
      console.error('[v0] Error fetching members:', error);
      throw new ContractError(
        `Failed to fetch members for group ${groupId}`,
        'GET_MEMBERS_FAILED'
      );
    }
  },

  /**
   * Create a new group
   */
  async createGroup(name: string, description: string, contributionAmount: string, payoutCycle: number): Promise<{ txHash: string, groupId: string }> {
    try {
      const contract = await getChamaContract();
      const weiAmount = ethers.parseEther(contributionAmount);
      
      const tx = await contract.createGroup(name, description, weiAmount, payoutCycle);
      console.log('[v0] Create group transaction:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('[v0] Create group confirmed:', receipt?.hash);

      // Parse GroupCreated event
      const event = receipt?.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        })
        .find((log: any) => log?.name === 'GroupCreated');

      if (!event) {
        throw new Error('GroupCreated event not found in transaction receipt');
      }

      const groupId = event.args.groupId;
      console.log('[v0] Group created with ID:', groupId);
      
      return { txHash: tx.hash, groupId };
    } catch (error: any) {
      console.error('[v0] Error creating group:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new ContractError(
        `Failed to create group: ${message}`,
        'CREATE_GROUP_FAILED'
      );
    }
  },

  /**
   * Add a new member to the group
   */
  async addMember(groupId: string, memberAddress: string, memberName: string): Promise<string> {
    try {
      const contract = await getChamaContract();
      const tx = await contract.addMember(groupId, memberAddress, memberName);
      console.log('[v0] Add member transaction:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('[v0] Add member confirmed:', receipt?.hash);
      
      return tx.hash;
    } catch (error) {
      console.error('[v0] Error adding member:', error);
      throw new ContractError(
        `Failed to add member to group ${groupId}`,
        'ADD_MEMBER_FAILED'
      );
    }
  },

  /**
   * Remove a member from the group
   */
  async removeMember(groupId: string, memberAddress: string): Promise<string> {
    try {
      const contract = await getChamaContract();
      const tx = await contract.removeMember(groupId, memberAddress);
      console.log('[v0] Remove member transaction:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('[v0] Remove member confirmed:', receipt?.hash);
      
      return tx.hash;
    } catch (error) {
      console.error('[v0] Error removing member:', error);
      throw new ContractError(
        `Failed to remove member from group ${groupId}`,
        'REMOVE_MEMBER_FAILED'
      );
    }
  },

  /**
   * Make a contribution to the group
   */
  async contribute(groupId: string, amount: string): Promise<string> {
    try {
      const contract = await getChamaContract();
      const weiAmount = ethers.parseEther(amount);
      const tx = await contract.contribute(groupId, weiAmount);
      console.log('[v0] Contribution transaction:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('[v0] Contribution confirmed:', receipt?.hash);
      
      return tx.hash;
    } catch (error) {
      console.error('[v0] Error making contribution:', error);
      throw new ContractError(
        `Failed to contribute to group ${groupId}`,
        'CONTRIBUTE_FAILED'
      );
    }
  },

  /**
   * Get all contributions for a group
   */
  async getContributions(groupId: string, limit: number = 100): Promise<Contribution[]> {
    try {
      const contract = getChamaContractReadOnly();
      const contributionsData = await contract.getContributions(groupId, limit);
      
      return contributionsData.map((c: any) => ({
        id: c.id,
        member: c.member,
        amount: ethers.formatEther(c.amount),
        timestamp: Number(c.timestamp),
        transactionHash: c.transactionHash,
        status: ['pending', 'confirmed', 'failed'][c.status] || 'pending',
      }));
    } catch (error) {
      console.error('[v0] Error fetching contributions:', error);
      throw new ContractError(
        `Failed to fetch contributions for group ${groupId}`,
        'GET_CONTRIBUTIONS_FAILED'
      );
    }
  },

  /**
   * Process a payout to a member
   */
  async processPayout(groupId: string, recipientAddress: string, amount: string): Promise<string> {
    try {
      const contract = await getChamaContract();
      const weiAmount = ethers.parseEther(amount);
      const tx = await contract.processPayout(groupId, recipientAddress, weiAmount);
      console.log('[v0] Payout transaction:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('[v0] Payout confirmed:', receipt?.hash);
      
      return tx.hash;
    } catch (error) {
      console.error('[v0] Error processing payout:', error);
      throw new ContractError(
        `Failed to process payout for group ${groupId}`,
        'PROCESS_PAYOUT_FAILED'
      );
    }
  },

  /**
   * Get all payouts for a group
   */
  async getPayouts(groupId: string, round?: number): Promise<Payout[]> {
    try {
      const contract = getChamaContractReadOnly();
      const roundNumber = round || (await contract.getCurrentRound(groupId));
      const payoutsData = await contract.getPayouts(groupId, roundNumber);
      
      return payoutsData.map((p: any) => ({
        id: p.id,
        recipient: p.recipient,
        amount: ethers.formatEther(p.amount),
        round: Number(p.round),
        status: ['pending', 'completed', 'failed'][p.status] || 'pending',
        transactionHash: p.transactionHash,
        timestamp: Number(p.timestamp),
      }));
    } catch (error) {
      console.error('[v0] Error fetching payouts:', error);
      throw new ContractError(
        `Failed to fetch payouts for group ${groupId}`,
        'GET_PAYOUTS_FAILED'
      );
    }
  },

  /**
   * Get the current payout round
   */
  async getCurrentRound(groupId: string): Promise<number> {
    try {
      const contract = getChamaContractReadOnly();
      const round = await contract.getCurrentRound(groupId);
      return Number(round);
    } catch (error) {
      console.error('[v0] Error fetching current round:', error);
      throw new ContractError(
        `Failed to fetch current round for group ${groupId}`,
        'GET_CURRENT_ROUND_FAILED'
      );
    }
  },

  /**
   * Get the next payout recipient
   */
  async getNextPayoutRecipient(groupId: string): Promise<string> {
    try {
      const contract = getChamaContractReadOnly();
      const recipient = await contract.getNextPayoutRecipient(groupId);
      return recipient;
    } catch (error) {
      console.error('[v0] Error fetching next payout recipient:', error);
      throw new ContractError(
        `Failed to fetch next payout recipient for group ${groupId}`,
        'GET_NEXT_RECIPIENT_FAILED'
      );
    }
  },
};

// ============================================================================
// WALLET SERVICE - MetaMask integration
// ============================================================================

export const walletService = {
  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<string> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new ContractError(
          'MetaMask is not installed',
          'NO_WALLET'
        );
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new ContractError(
          'No accounts found in wallet',
          'NO_ACCOUNTS'
        );
      }

      // Initialize provider and signer
      await initializeProvider();

      console.log('[v0] Wallet connected:', accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error('[v0] Error connecting wallet:', error);
      throw new ContractError(
        'Failed to connect wallet',
        'CONNECT_FAILED'
      );
    }
  },

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    provider = null;
    signer = null;
    console.log('[v0] Wallet disconnected');
  },

  /**
   * Get the currently connected wallet address
   */
  async getConnectedAddress(): Promise<string | null> {
    try {
      const currentSigner = await getSigner();
      if (!currentSigner) return null;
      return await currentSigner.getAddress();
    } catch (error) {
      console.error('[v0] Error getting connected address:', error);
      return null;
    }
  },

  /**
   * Switch to a specific network
   */
  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new ContractError('MetaMask is not installed', 'NO_WALLET');
      }

      const hexChainId = `0x${chainId.toString(16)}`;
      
      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
          if (!network) {
            throw new ContractError(
              `Network with chainId ${chainId} not found`,
              'NETWORK_NOT_FOUND'
            );
          }

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: hexChainId,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              nativeCurrency: {
                name: chainId === 296 ? 'HBAR' : (chainId === 23295 ? 'ROSE' : 'ETH'),
                symbol: chainId === 296 ? 'HBAR' : (chainId === 23295 ? 'ROSE' : 'ETH'),
                decimals: 18,
              },
            }],
          });
        } else {
          throw switchError;
        }
      }

      // Re-initialize provider after switching
      await initializeProvider();
      console.log('[v0] Network switched to chainId:', chainId);
    } catch (error) {
      console.error('[v0] Error switching network:', error);
      throw new ContractError(
        'Failed to switch network',
        'SWITCH_NETWORK_FAILED'
      );
    }
  },

  /**
   * Get wallet balance in native currency
   */
  async getBalance(address: string): Promise<string> {
    try {
      const contractProvider = getProvider();
      const balance = await contractProvider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('[v0] Error fetching balance:', error);
      throw new ContractError(
        `Failed to fetch balance for address ${address}`,
        'GET_BALANCE_FAILED'
      );
    }
  },
};

// ============================================================================
// TRANSACTION UTILITIES
// ============================================================================

/**
 * Wait for a transaction to be confirmed
 */
export async function waitForTransaction(
  transactionHash: string,
  maxWaitTime: number = 120000
): Promise<boolean> {
  try {
    const contractProvider = getProvider();
    const receipt = await contractProvider.waitForTransaction(transactionHash);
    
    if (receipt && receipt.status === 1) {
      console.log('[v0] Transaction confirmed:', transactionHash);
      return true;
    } else {
      console.log('[v0] Transaction failed:', transactionHash);
      return false;
    }
  } catch (error) {
    console.error('[v0] Error waiting for transaction:', error);
    return false;
  }
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(
  transactionHash: string
): Promise<'pending' | 'confirmed' | 'failed'> {
  try {
    const contractProvider = getProvider();
    const receipt = await contractProvider.getTransactionReceipt(transactionHash);
    
    if (!receipt) return 'pending';
    if (receipt.status === 1) return 'confirmed';
    return 'failed';
  } catch (error) {
    console.error('[v0] Error fetching transaction status:', error);
    return 'pending';
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class ContractError extends Error {
  constructor(
    message: string,
    public code?: string,
    public transactionHash?: string
  ) {
    super(message);
    this.name = 'ContractError';
  }
}

// ============================================================================
// SETUP GUIDE
// ============================================================================

/*
SETUP INSTRUCTIONS:

1. Install ethers.js:
   npm install ethers

2. Deploy your Chama smart contract to Hedera or Oasis Sapphire testnet

3. Update CONTRACT_CONFIG with your contract details:
   - Set NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS to your deployed contract address
   - Set NEXT_PUBLIC_NETWORK to 'HEDERA_TESTNET' or 'OASIS_SAPPHIRE'

4. Update CHAMA_CONTRACT_ABI with your actual contract ABI:
   - Export your contract ABI from Foundry/Hardhat
   - Replace the minimal ABI above with your full contract ABI

5. Environment variables to add (.env.local or Vercel):
   NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE

6. Test with these steps:
   - Open the dApp and click "Connect Wallet"
   - Make sure you have testnet tokens (HBAR or ROSE)
   - Try creating a group, adding members, and making contributions
   - Monitor transactions on the appropriate testnet explorer:
     * Hedera: https://testnet.hashscan.io/
     * Oasis Sapphire: https://testnet.explorer.oasis.io/

7. KRNL SDK Integration:
   - If using KRNL SDK, import and initialize it before contract operations
   - Ensure contract addresses and ABIs are compatible with KRNL

*/

# Smart Contract Integration Setup Guide

This guide walks you through integrating your Decentralized-Chama smart contracts with the dApp frontend.

## Quick Start

### 1. Install Dependencies

```bash
npm install ethers
```

### 2. Configure Contract Details

Update your environment variables in `.env.local`:

```env
NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE
```

Replace `0x1234...` with your deployed contract address.

### 3. Update Contract ABI

In `/lib/contract.ts`, find the `CHAMA_CONTRACT_ABI` constant and replace it with your contract's actual ABI.

You can export your ABI from Foundry:
```bash
forge inspect Chama abi > chama-abi.json
```

Then update the ABI in the file.

## Integration Details

### Contract Functions Expected

The integration expects your contract to have these functions:

#### Read Functions (View)
```solidity
function getGroup(string memory groupId) external view returns (ChamaGroup)
function getMembers(string memory groupId) external view returns (Member[])
function getContributions(string memory groupId, uint256 limit) external view returns (Contribution[])
function getPayouts(string memory groupId, uint256 round) external view returns (Payout[])
function getCurrentRound(string memory groupId) external view returns (uint256)
function getNextPayoutRecipient(string memory groupId) external view returns (address)
```

#### Write Functions
```solidity
function addMember(string memory groupId, address memberAddress, string memory memberName) external
function removeMember(string memory groupId, address memberAddress) external
function contribute(string memory groupId, uint256 amount) external
function processPayout(string memory groupId, address recipient, uint256 amount) external
```

### Return Type Structures

Your contract should return these struct formats:

```solidity
struct ChamaGroup {
    string id;
    string name;
    string description;
    uint256 totalMembers;
    uint256 treasuryBalance;
    uint256 contributionAmount;
    uint256 payoutCycle;
    uint256 createdAt;
    address contractAddress;
}

struct Member {
    address addr;
    string name;
    uint256 totalContributions;
    uint8 status; // 0=active, 1=pending, 2=inactive
    uint256 joinDate;
    uint256 lastContribution;
}

struct Contribution {
    string id;
    address member;
    uint256 amount;
    uint256 timestamp;
    string transactionHash;
    uint8 status; // 0=pending, 1=confirmed, 2=failed
}

struct Payout {
    string id;
    address recipient;
    uint256 amount;
    uint256 round;
    uint8 status; // 0=pending, 1=completed, 2=failed
    string transactionHash;
    uint256 timestamp;
}
```

## Network Configuration

### Hedera Testnet
- **Chain ID**: 296
- **RPC URL**: https://testnet.hashio.io/api
- **Explorer**: https://testnet.hashscan.io/
- **Native Token**: HBAR
- **Faucet**: https://testnet.faucet.hedera.com/

### Oasis Sapphire Testnet
- **Chain ID**: 23295
- **RPC URL**: https://testnet.sapphire.oasis.io
- **Explorer**: https://testnet.explorer.oasis.io/
- **Native Token**: ROSE
- **Faucet**: https://faucet.testnet.oasis.io/

## Testing the Integration

### 1. Setup MetaMask
- Install MetaMask browser extension
- Add the testnet network (the dApp will prompt you)
- Get testnet tokens from the appropriate faucet

### 2. Deploy Your Contract
Deploy to your chosen network using Foundry:

```bash
forge create --rpc-url <testnet-rpc-url> \
  --private-key <your-private-key> \
  src/Chama.sol:Chama
```

### 3. Test in dApp
1. Open the dApp in your browser
2. Click "Connect Wallet" and approve MetaMask
3. The dApp should switch to the configured network automatically
4. Create a test group
5. Add members
6. Make contributions
7. Process payouts

### 4. Monitor Transactions
- Check transaction status on the appropriate block explorer
- Hedera: https://testnet.hashscan.io/
- Oasis Sapphire: https://testnet.explorer.oasis.io/

## KRNL SDK Integration

If using KRNL SDK for enhanced functionality:

### 1. Install KRNL SDK
```bash
npm install @krnl-sdk/core
```

### 2. Initialize KRNL in Your App

Create `/lib/krnl.ts`:
```typescript
import { KRNL } from '@krnl-sdk/core';

const krnl = new KRNL({
  network: process.env.NEXT_PUBLIC_NETWORK,
  contractAddress: process.env.NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS,
});

export default krnl;
```

### 3. Use KRNL in Contract Service

In `/lib/contract.ts`, you can use KRNL methods alongside ethers.js:

```typescript
import krnl from './krnl';

export const contractService = {
  async getGroup(groupId: string): Promise<ChamaGroup> {
    // Option 1: Using KRNL
    const groupData = await krnl.call('getGroup', [groupId]);
    
    // Option 2: Using ethers.js
    const contract = getChamaContractReadOnly();
    const groupData = await contract.getGroup(groupId);
    
    // ... rest of the function
  },
};
```

## Debugging

Enable debug logging in your browser console:

```javascript
// In your browser console
window.localStorage.setItem('debug', 'v0:*');
```

Check `/lib/contract.ts` for `console.log("[v0] ...")` statements that help track execution flow.

## Common Issues

### Error: "Contract not found at address"
- Verify the contract address in your environment variables
- Check that the address is correct for the network you're using
- Ensure you're on the correct testnet

### Error: "MetaMask is not installed"
- Install MetaMask browser extension
- Reload the dApp page

### Error: "Invalid ABI"
- Make sure your contract ABI matches your deployed contract
- Export the ABI from your compiled contract and update `CHAMA_CONTRACT_ABI`

### Transactions Fail Silently
- Check MetaMask gas settings
- Ensure account has sufficient balance for gas fees
- Verify contract has the required permissions/roles

## Next Steps

1. **Test extensively** on testnet before mainnet deployment
2. **Implement error handling** for user-facing error messages
3. **Add transaction loading states** to provide user feedback
4. **Setup monitoring** with services like Sentry for error tracking
5. **Deploy to Vercel** when ready for production

## Support

For issues with:
- **Smart Contract Integration**: Check `/lib/contract.ts` comments and setup guide
- **Wallet Connection**: Verify MetaMask is installed and configured
- **KRNL SDK**: Refer to KRNL documentation at [krnl.dev](https://krnl.dev)
- **Hedera**: Visit [Hedera Developer Portal](https://developer.hedera.com)
- **Oasis**: Visit [Oasis Protocol Documentation](https://docs.oasis.io)

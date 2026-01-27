# Smart Contract Deployment Guide for Decentralized-Chama-KRNL

A comprehensive guide to deploy the ChamaCore and ChamaKernel smart contracts to Hedera and Oasis Sapphire testnets.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Contract Compilation](#contract-compilation)
4. [Deployment to Hedera Testnet](#deployment-to-hedera-testnet)
5. [Deployment to Oasis Sapphire](#deployment-to-oasis-sapphire)
6. [Contract Verification](#contract-verification)
7. [KRNL SDK Integration](#krnl-sdk-integration)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

### System Requirements
- **Node.js**: v18 or higher
- **Foundry**: Latest version (https://book.getfoundry.sh/)
- **Git**: For version control
- **MetaMask or Web3 Wallet**: For deploying and interacting with contracts

### Getting Started with Foundry

Install Foundry using Curl:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:

```bash
forge --version
cast --version
```

### Create a Foundry Project

If you don't have a Foundry project yet:

```bash
forge init decentralized-chama --no-git
cd decentralized-chama
```

---

## Environment Setup

### 1. Create `.env` File

In your Foundry project root, create a `.env` file:

```env
# Private Keys (NEVER commit this file!)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Network RPC URLs
HEDERA_RPC_URL=https://testnet.hashio.io/api
OASIS_SAPPHIRE_RPC_URL=https://testnet.sapphire.oasis.io

# Optional: Block Explorer Keys for Verification
HEDERA_SCAN_API_KEY=your_hashscan_api_key
OASIS_SCAN_API_KEY=your_oasis_explorer_api_key

# KRNL Configuration (if using KRNL SDK)
KRNL_API_KEY=your_krnl_api_key
KRNL_CLUSTER_ID=your_krnl_cluster_id
```

### 2. Configure `foundry.toml`

Update your `foundry.toml` to include network configurations:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer_runs = 200

# Hedera Configuration
[rpc_endpoints]
hedera = "https://testnet.hashio.io/api"
oasis_sapphire = "https://testnet.sapphire.oasis.io"

# Chain configurations
[chain.hedera]
chain_id = 296
rpc_url = "https://testnet.hashio.io/api"

[chain.oasis_sapphire]
chain_id = 23295
rpc_url = "https://testnet.sapphire.oasis.io"
```

### 3. Load Environment Variables

Create a `.env.local` file (not committed) and load it before deployment:

```bash
# Load env file
source .env

# Or use direnv (recommended)
# Install: https://direnv.net
# Create .envrc file with: dotenv
```

---

## Contract Compilation

### 1. Install Dependencies

```bash
# Install OpenZeppelin contracts (recommended for security)
forge install OpenZeppelin/openzeppelin-contracts

# Install other dependencies as needed
forge install transmissions11/solmate
```

### 2. Create Your Smart Contracts

Create `src/ChamaCore.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ChamaCore
 * @dev Main treasury and member registry for Chama savings groups on Hedera
 */
contract ChamaCore is Ownable, ReentrancyGuard {
    
    // ============================================================================
    // STRUCTS
    // ============================================================================
    
    struct Group {
        string id;
        string name;
        string description;
        uint256 totalMembers;
        uint256 treasuryBalance;
        uint256 contributionAmount;
        uint256 payoutCycle; // in days
        uint256 createdAt;
        address[] members;
        bool exists;
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
    
    // ============================================================================
    // STATE VARIABLES
    // ============================================================================
    
    mapping(string => Group) public groups;
    mapping(string => mapping(address => Member)) public members;
    mapping(string => Contribution[]) public contributions;
    mapping(string => Payout[]) public payouts;
    mapping(string => uint256) public currentRound;
    mapping(string => uint256) public nextPayoutIndex;
    
    address public krnlKernel; // KRNL Kernel address for automated payouts
    
    uint256 constant MAX_MEMBERS = 10;
    
    // ============================================================================
    // EVENTS
    // ============================================================================
    
    event GroupCreated(string indexed groupId, string name, address creator);
    event MemberAdded(string indexed groupId, address indexed member, string name);
    event MemberRemoved(string indexed groupId, address indexed member);
    event ContributionMade(string indexed groupId, address indexed member, uint256 amount);
    event PayoutProcessed(string indexed groupId, address indexed recipient, uint256 amount, uint256 round);
    event KernelUpdated(address newKernel);
    
    // ============================================================================
    // MODIFIERS
    // ============================================================================
    
    modifier groupExists(string memory groupId) {
        require(groups[groupId].exists, "Group does not exist");
        _;
    }
    
    modifier onlyKernel() {
        require(msg.sender == krnlKernel, "Only KRNL Kernel can call this");
        _;
    }
    
    modifier memberExists(string memory groupId, address memberAddr) {
        require(members[groupId][memberAddr].addr != address(0), "Member does not exist");
        _;
    }
    
    // ============================================================================
    // FUNCTIONS
    // ============================================================================
    
    /**
     * @dev Create a new Chama group
     */
    function createGroup(
        string memory groupId,
        string memory name,
        string memory description,
        uint256 contributionAmount,
        uint256 payoutCycle
    ) external {
        require(!groups[groupId].exists, "Group already exists");
        require(bytes(groupId).length > 0, "Group ID cannot be empty");
        require(contributionAmount > 0, "Contribution amount must be > 0");
        
        Group storage newGroup = groups[groupId];
        newGroup.id = groupId;
        newGroup.name = name;
        newGroup.description = description;
        newGroup.contributionAmount = contributionAmount;
        newGroup.payoutCycle = payoutCycle;
        newGroup.createdAt = block.timestamp;
        newGroup.exists = true;
        
        // Add creator as first member
        _addMember(groupId, msg.sender, "Group Creator");
        
        emit GroupCreated(groupId, name, msg.sender);
    }
    
    /**
     * @dev Get group details
     */
    function getGroup(string memory groupId) 
        external 
        view 
        groupExists(groupId) 
        returns (Group memory) 
    {
        return groups[groupId];
    }
    
    /**
     * @dev Add a member to the group
     */
    function addMember(
        string memory groupId,
        address memberAddress,
        string memory memberName
    ) external groupExists(groupId) {
        require(groups[groupId].totalMembers < MAX_MEMBERS, "Group is full");
        _addMember(groupId, memberAddress, memberName);
    }
    
    /**
     * @dev Internal function to add member
     */
    function _addMember(
        string memory groupId,
        address memberAddress,
        string memory memberName
    ) internal {
        require(memberAddress != address(0), "Invalid member address");
        require(members[groupId][memberAddress].addr == address(0), "Member already exists");
        
        Member storage newMember = members[groupId][memberAddress];
        newMember.addr = memberAddress;
        newMember.name = memberName;
        newMember.status = 0; // active
        newMember.joinDate = block.timestamp;
        
        groups[groupId].members.push(memberAddress);
        groups[groupId].totalMembers++;
        
        emit MemberAdded(groupId, memberAddress, memberName);
    }
    
    /**
     * @dev Remove a member from the group
     */
    function removeMember(string memory groupId, address memberAddress) 
        external 
        groupExists(groupId)
        memberExists(groupId, memberAddress)
    {
        Member storage member = members[groupId][memberAddress];
        member.status = 2; // inactive
        
        groups[groupId].totalMembers--;
        
        emit MemberRemoved(groupId, memberAddress);
    }
    
    /**
     * @dev Get all members of a group
     */
    function getMembers(string memory groupId) 
        external 
        view 
        groupExists(groupId)
        returns (Member[] memory) 
    {
        address[] storage memberAddresses = groups[groupId].members;
        Member[] memory memberList = new Member[](memberAddresses.length);
        
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            memberList[i] = members[groupId][memberAddresses[i]];
        }
        
        return memberList;
    }
    
    /**
     * @dev Make a contribution to the group
     */
    function contribute(string memory groupId) 
        external 
        payable 
        groupExists(groupId)
        memberExists(groupId, msg.sender)
        nonReentrant
    {
        require(msg.value == groups[groupId].contributionAmount, "Incorrect contribution amount");
        
        // Update member contribution
        members[groupId][msg.sender].totalContributions += msg.value;
        members[groupId][msg.sender].lastContribution = block.timestamp;
        
        // Update group treasury
        groups[groupId].treasuryBalance += msg.value;
        
        // Record contribution
        Contribution memory newContribution = Contribution({
            id: _generateId(),
            member: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            transactionHash: "",
            status: 1 // confirmed
        });
        
        contributions[groupId].push(newContribution);
        
        emit ContributionMade(groupId, msg.sender, msg.value);
    }
    
    /**
     * @dev Get contributions for a group
     */
    function getContributions(string memory groupId, uint256 limit) 
        external 
        view 
        groupExists(groupId)
        returns (Contribution[] memory) 
    {
        Contribution[] storage allContributions = contributions[groupId];
        uint256 length = limit > 0 && limit < allContributions.length 
            ? limit 
            : allContributions.length;
        
        Contribution[] memory result = new Contribution[](length);
        
        // Return most recent contributions first
        for (uint256 i = 0; i < length; i++) {
            result[i] = allContributions[allContributions.length - 1 - i];
        }
        
        return result;
    }
    
    /**
     * @dev Process a payout to a member (can only be called by KRNL Kernel)
     */
    function processPayout(
        string memory groupId,
        address recipient,
        uint256 amount
    ) 
        external 
        onlyKernel
        groupExists(groupId)
        memberExists(groupId, recipient)
        nonReentrant
    {
        require(groups[groupId].treasuryBalance >= amount, "Insufficient treasury balance");
        
        // Update treasury
        groups[groupId].treasuryBalance -= amount;
        
        // Record payout
        uint256 round = currentRound[groupId];
        Payout memory newPayout = Payout({
            id: _generateId(),
            recipient: recipient,
            amount: amount,
            round: round,
            status: 1, // completed
            transactionHash: "",
            timestamp: block.timestamp
        });
        
        payouts[groupId].push(newPayout);
        
        // Advance to next recipient
        nextPayoutIndex[groupId]++;
        if (nextPayoutIndex[groupId] >= groups[groupId].totalMembers) {
            nextPayoutIndex[groupId] = 0;
            currentRound[groupId]++;
        }
        
        // Transfer funds
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit PayoutProcessed(groupId, recipient, amount, round);
    }
    
    /**
     * @dev Get payouts for a group
     */
    function getPayouts(string memory groupId, uint256 round) 
        external 
        view 
        groupExists(groupId)
        returns (Payout[] memory) 
    {
        Payout[] storage allPayouts = payouts[groupId];
        
        // Filter payouts by round
        uint256 count = 0;
        for (uint256 i = 0; i < allPayouts.length; i++) {
            if (allPayouts[i].round == round) {
                count++;
            }
        }
        
        Payout[] memory result = new Payout[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allPayouts.length; i++) {
            if (allPayouts[i].round == round) {
                result[index] = allPayouts[i];
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get current round
     */
    function getCurrentRound(string memory groupId) 
        external 
        view 
        groupExists(groupId)
        returns (uint256) 
    {
        return currentRound[groupId];
    }
    
    /**
     * @dev Get next payout recipient
     */
    function getNextPayoutRecipient(string memory groupId) 
        external 
        view 
        groupExists(groupId)
        returns (address) 
    {
        address[] storage memberAddresses = groups[groupId].members;
        if (memberAddresses.length == 0) return address(0);
        
        uint256 index = nextPayoutIndex[groupId] % memberAddresses.length;
        return memberAddresses[index];
    }
    
    /**
     * @dev Set KRNL Kernel address
     */
    function setKernelAddress(address kernel) external onlyOwner {
        require(kernel != address(0), "Invalid kernel address");
        krnlKernel = kernel;
        emit KernelUpdated(kernel);
    }
    
    /**
     * @dev Generate a unique ID (in production, use more robust method)
     */
    function _generateId() internal view returns (string memory) {
        return string(abi.encodePacked(
            block.timestamp,
            block.number,
            msg.sender
        ));
    }
    
    /**
     * @dev Fallback function to receive HBAR
     */
    receive() external payable {}
}
```

Create `src/ChamaKernel.sol` (if using KRNL):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ChamaCore.sol";

/**
 * @title ChamaKernel
 * @dev KRNL-enabled automation for monthly payout rotation
 */
contract ChamaKernel {
    
    ChamaCore public chamaCore;
    address public owner;
    
    // Track last execution time for each group
    mapping(string => uint256) public lastExecutionTime;
    
    event PayoutAutomated(string indexed groupId, address recipient, uint256 amount);
    event ChamaAddressUpdated(address newAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor(address _chamaCore) {
        chamaCore = ChamaCore(_chamaCore);
        owner = msg.sender;
    }
    
    /**
     * @dev Execute monthly payout (called by KRNL Cron)
     * Verifies all members have contributed before processing payout
     */
    function executeMonthlyPayout(string memory groupId) external {
        require(_canExecutePayout(groupId), "Cannot execute payout yet");
        
        // Verify all members contributed
        require(_allMembersContributed(groupId), "Not all members have contributed");
        
        // Get next recipient
        address recipient = chamaCore.getNextPayoutRecipient(groupId);
        require(recipient != address(0), "No valid recipient");
        
        // Get treasury balance
        ChamaCore.Group memory group = chamaCore.getGroup(groupId);
        uint256 payoutAmount = group.contributionAmount;
        
        // Process payout through ChamaCore
        chamaCore.processPayout(groupId, recipient, payoutAmount);
        
        // Update execution time
        lastExecutionTime[groupId] = block.timestamp;
        
        emit PayoutAutomated(groupId, recipient, payoutAmount);
    }
    
    /**
     * @dev Check if payout can be executed
     */
    function _canExecutePayout(string memory groupId) internal view returns (bool) {
        ChamaCore.Group memory group = chamaCore.getGroup(groupId);
        
        // Check if enough time has passed (30 days = 2592000 seconds)
        uint256 cycleSeconds = group.payoutCycle * 1 days;
        return block.timestamp >= (lastExecutionTime[groupId] + cycleSeconds);
    }
    
    /**
     * @dev Check if all members have contributed this cycle
     */
    function _allMembersContributed(string memory groupId) internal view returns (bool) {
        ChamaCore.Member[] memory groupMembers = chamaCore.getMembers(groupId);
        uint256 lastExecution = lastExecutionTime[groupId];
        
        // For first execution, check all have ever contributed
        // For subsequent, check they contributed after last execution
        for (uint256 i = 0; i < groupMembers.length; i++) {
            if (groupMembers[i].status == 2) continue; // Skip inactive
            
            if (lastExecution == 0) {
                // First cycle: just need at least one contribution
                if (groupMembers[i].totalContributions == 0) return false;
            } else {
                // Subsequent cycles: must have contributed after last payout
                if (groupMembers[i].lastContribution <= lastExecution) return false;
            }
        }
        
        return true;
    }
    
    /**
     * @dev Update ChamaCore address
     */
    function setChamaCoreAddress(address _chamaCore) external onlyOwner {
        require(_chamaCore != address(0), "Invalid address");
        chamaCore = ChamaCore(_chamaCore);
        emit ChamaAddressUpdated(_chamaCore);
    }
}
```

### 3. Compile Contracts

```bash
# Compile all contracts
forge build

# Compile specific contract
forge build --contracts src/ChamaCore.sol

# See compilation details
forge build --via-ir
```

Check for compiler errors. If successful, you'll see:

```
Compiling...
Compiled successfully!
```

---

## Deployment to Hedera Testnet

### 1. Get Testnet Tokens

Visit the Hedera faucet: https://testnet.faucet.hedera.com/

- Use your MetaMask address to receive test HBAR
- You'll need approximately 1 HBAR for deployment

### 2. Set Private Key

```bash
# Load your private key (DO NOT COMMIT THIS!)
export PRIVATE_KEY="0x..."  # Your MetaMask private key

# Or add to .env file (make sure it's in .gitignore)
echo "PRIVATE_KEY=0x..." >> .env
```

### 3. Deploy ChamaCore to Hedera

```bash
# Deploy ChamaCore
forge create src/ChamaCore.sol:ChamaCore \
  --rpc-url https://testnet.hashio.io/api \
  --private-key $PRIVATE_KEY \
  --gas-price 100000000 \
  --verify-contract

# Output should show:
# Deployed to: 0x1234...5678
```

Save the deployed contract address:

```bash
# Example output:
export CHAMA_CORE_ADDRESS="0x1234567890abcdef1234567890abcdef12345678"
```

### 4. Deploy ChamaKernel to Hedera

```bash
forge create src/ChamaKernel.sol:ChamaKernel \
  --rpc-url https://testnet.hashio.io/api \
  --private-key $PRIVATE_KEY \
  --constructor-args $CHAMA_CORE_ADDRESS \
  --gas-price 100000000

# Save the address
export CHAMA_KERNEL_ADDRESS="0x..."
```

### 5. Link Kernel to Core

```bash
# Set kernel address in ChamaCore
cast send $CHAMA_CORE_ADDRESS \
  "setKernelAddress(address)" $CHAMA_KERNEL_ADDRESS \
  --rpc-url https://testnet.hashio.io/api \
  --private-key $PRIVATE_KEY
```

---

## Deployment to Oasis Sapphire

### 1. Get Sapphire Testnet Tokens

Visit: https://faucet.testnet.oasis.io/

- Request test ROSE tokens for Oasis Sapphire
- You'll need approximately 1 ROSE for deployment

### 2. Deploy to Oasis Sapphire

```bash
# Deploy ChamaCore
forge create src/ChamaCore.sol:ChamaCore \
  --rpc-url https://testnet.sapphire.oasis.io \
  --private-key $PRIVATE_KEY \
  --gas-price 100000000

export OASIS_CHAMA_CORE="0x..."

# Deploy ChamaKernel
forge create src/ChamaKernel.sol:ChamaKernel \
  --rpc-url https://testnet.sapphire.oasis.io \
  --private-key $PRIVATE_KEY \
  --constructor-args $OASIS_CHAMA_CORE

export OASIS_CHAMA_KERNEL="0x..."

# Link Kernel to Core
cast send $OASIS_CHAMA_CORE \
  "setKernelAddress(address)" $OASIS_CHAMA_KERNEL \
  --rpc-url https://testnet.sapphire.oasis.io \
  --private-key $PRIVATE_KEY
```

---

## Contract Verification

### Hedera Explorer

```bash
# Use Foundry's verification (if supported)
forge verify-contract $CHAMA_CORE_ADDRESS \
  src/ChamaCore.sol:ChamaCore \
  --chain-id 296 \
  --etherscan-api-key $HEDERA_SCAN_API_KEY
```

### Manual Verification Steps

1. Go to https://testnet.hashscan.io/
2. Search for your contract address
3. Click "Verify & Publish"
4. Upload your contract source code (flatten if necessary):

```bash
# Flatten contracts
forge flatten src/ChamaCore.sol > ChamaCore.flat.sol
```

---

## KRNL SDK Integration

### 1. Register Contracts with KRNL

```bash
# Install KRNL CLI (if not already installed)
npm install -g @krnl-cli/core

# Initialize KRNL project
krnl init -n decentralized-chama

# Register ChamaCore
krnl register \
  --contract ChamaCore \
  --address $CHAMA_CORE_ADDRESS \
  --network hedera-testnet

# Register ChamaKernel as execution layer
krnl register-kernel \
  --kernel ChamaKernel \
  --address $CHAMA_KERNEL_ADDRESS \
  --network hedera-testnet
```

### 2. Setup Cron Trigger

```bash
# Create 30-day cron schedule
krnl schedule \
  --kernel $CHAMA_KERNEL_ADDRESS \
  --function executeMonthlyPayout \
  --interval 30d \
  --group-id "group-1"
```

---

## Testing

### 1. Deploy to Local Anvil

```bash
# Start Anvil (local Ethereum simulator)
anvil --fork-url https://testnet.hashio.io/api

# In another terminal, deploy
ANVIL_PRIVATE_KEY=$(cast key-utils --key-type plain 0x1)
forge create src/ChamaCore.sol:ChamaCore \
  --rpc-url http://localhost:8545 \
  --private-key $ANVIL_PRIVATE_KEY
```

### 2. Create Test Suite

Create `test/ChamaCore.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ChamaCore.sol";

contract ChamaCoreTest is Test {
    ChamaCore chama;
    address user1 = address(0x1);
    address user2 = address(0x2);
    
    function setUp() public {
        chama = new ChamaCore();
    }
    
    function testCreateGroup() public {
        vm.prank(user1);
        chama.createGroup(
            "group-1",
            "Test Group",
            "A test savings group",
            1 ether,
            30
        );
        
        ChamaCore.Group memory group = chama.getGroup("group-1");
        assertEq(group.name, "Test Group");
        assertEq(group.totalMembers, 1);
    }
    
    function testContribute() public {
        vm.prank(user1);
        chama.createGroup("group-1", "Test", "Test", 1 ether, 30);
        
        vm.prank(user2);
        chama.addMember("group-1", user2, "User 2");
        
        vm.prank(user2);
        vm.deal(user2, 2 ether);
        chama.contribute{value: 1 ether}("group-1");
        
        ChamaCore.Group memory group = chama.getGroup("group-1");
        assertEq(group.treasuryBalance, 1 ether);
    }
}
```

### 3. Run Tests

```bash
# Run all tests
forge test

# Run specific test
forge test --match testCreateGroup

# Verbose output
forge test -vvv
```

---

## Troubleshooting

### Common Errors

#### 1. "Permission denied" for private key

```bash
# Make sure private key file has correct permissions
chmod 600 .env
```

#### 2. "Insufficient balance for gas"

- Get more testnet tokens from faucet
- Reduce gas price: `--gas-price 50000000`

#### 3. "Invalid ABI encoding" during constructor arguments

```bash
# Make sure constructor args match the contract signature
# Example for ChamaKernel with address argument:
forge create src/ChamaKernel.sol:ChamaKernel \
  --constructor-args "0x1234567890abcdef1234567890abcdef12345678"
```

#### 4. "Contract not found at RPC"

- Wait a few seconds for transaction to be mined
- Verify contract address is correct
- Check you're on the right network

#### 5. "ethers.js shows outdated ABI"

```bash
# Export fresh ABI
forge inspect ChamaCore abi > chama-abi.json

# Update in /lib/contract.ts
```

### Debugging with Cast

```bash
# Check contract balance
cast balance $CHAMA_CORE_ADDRESS --rpc-url https://testnet.hashio.io/api

# Call read function
cast call $CHAMA_CORE_ADDRESS "getCurrentRound(string)" "group-1" \
  --rpc-url https://testnet.hashio.io/api

# Send transaction
cast send $CHAMA_CORE_ADDRESS "contribute(string)" "group-1" \
  --value 1ether --rpc-url https://testnet.hashio.io/api
```

---

## Post-Deployment

### 1. Update Environment Variables

```env
NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x...  # Your deployed address
NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE
NEXT_PUBLIC_HEDERA_CONTRACT_ADDRESS=0x...  # If deploying to both
```

### 2. Update dApp Integration

In `/lib/contract.ts`, update `CONTRACT_CONFIG`:

```typescript
export const CONTRACT_CONFIG = {
  address: process.env.NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS || '0x0000...',
  network: process.env.NEXT_PUBLIC_NETWORK || 'OASIS_SAPPHIRE',
};
```

### 3. Test Full Integration

1. Start the dApp
2. Connect MetaMask to the testnet
3. Create a group
4. Add members
5. Make contributions
6. Check transactions on block explorer

---

## Resources

- **Hedera Documentation**: https://developer.hedera.com/
- **Oasis Documentation**: https://docs.oasis.io/
- **Foundry Book**: https://book.getfoundry.sh/
- **KRNL Documentation**: https://docs.krnl.dev/
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts/

---

## Support

For deployment issues:
1. Check testnet faucets have valid tokens
2. Verify RPC endpoints are responsive
3. Check contract ABI matches deployed code
4. Review console logs for detailed error messages
5. Use `forge test -vvv` for debug output

Happy deploying! 🚀

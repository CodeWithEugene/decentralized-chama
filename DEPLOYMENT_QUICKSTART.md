# Smart Contract Deployment Quick Start

Deploy your Chama smart contracts in minutes using this quick reference guide.

## 30-Second Setup

```bash
# 1. Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. Create .env file with your private key
echo "PRIVATE_KEY=0x..." > .env  # Add your MetaMask private key

# 3. Get testnet tokens
# Hedera: https://testnet.faucet.hedera.com/
# Oasis: https://faucet.testnet.oasis.io/

# 4. Deploy! Choose one:
./scripts/deploy.sh hedera      # Deploy to Hedera
./scripts/deploy.sh oasis       # Deploy to Oasis Sapphire
./scripts/deploy.sh both        # Deploy to both networks

# 5. Copy the contract addresses and add to .env.local
NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE
```

## Step-by-Step Guide

### Step 1: Install Foundry

```bash
# Download and install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Update PATH
source $HOME/.bashrc

# Verify installation
forge --version
cast --version
```

### Step 2: Get Your Private Key

**From MetaMask:**
1. Open MetaMask
2. Click account icon → Settings → Security & Privacy
3. Click "Reveal Secret Recovery Phrase"
4. **OR** for a specific account:
   - Click account selector → "Account Details"
   - Click "Export Private Key"
   - Enter password

⚠️ **NEVER share your private key or commit it to Git!**

### Step 3: Create Environment File

```bash
# In your contract directory (if you don't have one yet)
cat > .env << EOF
PRIVATE_KEY=0xYourPrivateKeyHere
HEDERA_RPC_URL=https://testnet.hashio.io/api
OASIS_SAPPHIRE_RPC_URL=https://testnet.sapphire.oasis.io
GAS_PRICE=100000000
EOF

# Add to .gitignore (IMPORTANT!)
echo ".env" >> .gitignore
```

### Step 4: Get Testnet Tokens

#### For Hedera:
1. Go to https://testnet.faucet.hedera.com/
2. Enter your MetaMask address (without 0x)
3. Receive 100 test HBAR

#### For Oasis Sapphire:
1. Go to https://faucet.testnet.oasis.io/
2. Connect your wallet or paste address
3. Receive test ROSE tokens

### Step 5: Deploy Contracts

Make the deploy script executable:

```bash
chmod +x scripts/deploy.sh
```

Then deploy to your chosen network:

```bash
# Hedera
./scripts/deploy.sh hedera

# Oasis Sapphire
./scripts/deploy.sh oasis

# Both networks
./scripts/deploy.sh both
```

The script will:
- ✓ Compile your contracts
- ✓ Deploy ChamaCore
- ✓ Deploy ChamaKernel
- ✓ Link Kernel to Core
- ✓ Save deployment info
- ✓ Output contract addresses

### Step 6: Update Your dApp

Add the contract addresses to your `.env.local`:

```env
NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE
```

### Step 7: Test in dApp

1. Start your dApp: `npm run dev`
2. Open http://localhost:3000
3. Click "Connect Wallet"
4. Approve MetaMask connection
5. Create a test group
6. Make contributions
7. Check transactions on block explorer

---

## Using the Interactive Menu

Run without arguments for menu:

```bash
./scripts/deploy.sh

# Menu will show:
# 1) Deploy to Hedera Testnet
# 2) Deploy to Oasis Sapphire Testnet
# 3) Deploy to Both Networks
# 4) Verify Contracts
# 5) Exit
```

---

## Verify Contract Code

After deployment, verify your contract on block explorer for transparency:

```bash
# Flatten contract
forge flatten src/ChamaCore.sol > ChamaCore.flat.sol
```

Then:
- **Hedera**: https://testnet.hashscan.io/ → Search address → "Verify & Publish"
- **Oasis**: https://testnet.explorer.oasis.io/ → Search address → "Verify Contract"

Upload `ChamaCore.flat.sol` and contract details.

---

## Common Issues & Solutions

### ❌ "Permission denied" for .env

```bash
chmod 600 .env
```

### ❌ "Insufficient balance"

- Verify you got testnet tokens from faucet
- Wait a few minutes for tokens to arrive
- Try different faucet if first one doesn't work

### ❌ "Invalid RPC URL"

```bash
# Test RPC connection
curl -s https://testnet.hashio.io/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' | jq
```

### ❌ "forge: command not found"

Reinstall Foundry:
```bash
foundryup
source ~/.bashrc
```

### ❌ "Compilation error"

Check Solidity version:
```bash
# Update if needed in foundry.toml
solc_version = "0.8.20"

# Then rebuild
forge build --force
```

---

## What Gets Deployed

| Contract | Network | Purpose |
|----------|---------|---------|
| **ChamaCore** | Hedera/Oasis | Main treasury, member management, contributions |
| **ChamaKernel** | Hedera/Oasis | Automated payouts, KRNL integration |

---

## Block Explorers

- **Hedera Testnet**: https://testnet.hashscan.io/
- **Oasis Sapphire**: https://testnet.explorer.oasis.io/

Search your contract address to view transactions and verify code.

---

## Next Steps

After successful deployment:

1. ✓ Add contract addresses to `.env.local`
2. ✓ Test dApp with real contracts
3. ✓ Verify contracts on block explorers
4. ✓ Setup KRNL automation (optional)
5. ✓ Deploy to mainnet when ready

---

## Useful Commands

```bash
# Check contract balance
cast balance 0xYourContractAddress --rpc-url https://testnet.hashio.io/api

# Call read function
cast call 0xYourContractAddress \
  "getCurrentRound(string)" '"group-1"' \
  --rpc-url https://testnet.hashio.io/api

# Send transaction
cast send 0xYourContractAddress \
  "createGroup(string,string,string,uint256,uint256)" \
  '"group-1"' '"My Group"' '"Test"' "1000000000000000000" "30" \
  --rpc-url https://testnet.hashio.io/api \
  --private-key 0x...

# Get transaction receipt
cast receipt 0xTransactionHash --rpc-url https://testnet.hashio.io/api
```

---

## Need Help?

- **Foundry Issues**: https://book.getfoundry.sh/
- **Hedera Support**: https://developer.hedera.com/
- **Oasis Support**: https://docs.oasis.io/
- **MetaMask Help**: https://support.metamask.io/

Good luck! 🚀

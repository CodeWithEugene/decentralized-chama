<div align="center">
  <img src="public/logo.png" alt="Decentralized Chama Logo">

# Decentralized Chama (DChama)

**Digitizing Trust. Automating Prosperity.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Solidity](https://img.shields.io/badge/Solidity-Smart_Contracts-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-627EEA?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![KRNL](https://img.shields.io/badge/KRNL-Orchestration-121212?style=for-the-badge&logo=squarespace&logoColor=white)](https://krnl.app/)

  <p align="center">
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

## Overview

**Decentralized Chama (DChama)** is a modern financial platform that brings traditional Rotating Savings and Credit Associations (**ROSCAs**) onto the blockchain. By leveraging smart contracts and real-time data synchronization, DChama automates the "Merry-Go-Round" cycle—ensuring transparency, security, and trustless execution for all members.

DChama solves the classic problems of informal groups:

- **Trust**: Funds are held in a non-custodial smart contract vault.
- **Transparency**: Every contribution and payout is recorded on-chain.
- **Automation**: KRNL orchestration ensures payouts happen strictly according to schedule.

## How It Works

DChama simplifies the traditional Chama experience into a digital, automated flow:

1. **Connect Wallet**: Users connect their digital wallet (like MetaMask) to the app. This wallet acts as their identity and bank account.
2. **Create or Join**: A user can create a new Chama group (setting the contribution amount and cycle) or join an existing one using a Group ID.
3. **Contribute**: Members contribute funds (ETH) directly to the smart contract vault. These funds are locked and safe.
4. **Rotate & Receive**: Based on the predetermined schedule, the system automatically enables the next member in line to receive the pooled funds.
5. **Track**: Everything is visible on the dashboard—who paid, who owes, and whose turn it is next.

## Current Network

**DChama is currently deployed on the Sepolia Testnet** for development and testing purposes.

- **Network**: Sepolia Testnet (Ethereum)
- **Currency**: ETH (test tokens)
- **Chain ID**: 11155111
- **Get Test ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)

> **Note**: This is a testnet deployment. Never use real mainnet funds with this application.

## Deployed Contracts

The following smart contracts are currently deployed on Sepolia Testnet:

- **ChamaFactory**: [`0x69990DC035ED6d1Ae845ce956657005E86812d7a`](https://sepolia.etherscan.io/address/0x69990DC035ED6d1Ae845ce956657005E86812d7a)
- **ChamaKernel**: [`0x92243e7D704280CFae02478C5ac1c3756c12497B`](https://sepolia.etherscan.io/address/0x92243e7D704280CFae02478C5ac1c3756c12497B)

You can view all transactions, contract code, and events on Sepolia Etherscan using the links above.

## Key Features

- 🏦 **Smart Vaults**: Funds are secured in the `ChamaCore` contract via the `ChamaFactory` pattern, not a personal bank account.
- 🔄 **Automated Payouts with KRNL**: The `ChamaKernel` uses the **KRNL Protocol** to orchestrate rotating payouts. It imposes checks (like solvency and time verification) off-chain before authorizing the on-chain release of funds, ensuring the rotation is tamper-proof.
- 📊 **Real-Time Dashboard**: A responsive UI powered by Supabase for instant feedback, synchronized with on-chain data.
- 📈 **Live Contribution Charts**: Visual trends showing your group's contribution history with real blockchain data.
- 👛 **Wallet Integration**: Seamless connection with MetaMask (and compatible wallets) for ETH transactions.
- 🔌 **Disconnect Wallet**: Easy wallet management with dropdown controls.
- 📱 **Mobile First**: Fully responsive design optimized for on-the-go management.
- 🛡️ **Dual-Write Architecture**: Immediate UI updates coupled with immutable blockchain verification.

## Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend & Data

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Indexing**: Custom "Dual Write" logic (Frontend → Chain → DB)

### Blockchain

- **Contracts**: Solidity (compiled with `foundry`)
- **Network**: Sepolia Testnet (Ethereum)
- **Orchestration**: KRNL (Kernel) Protocol
- **Interaction**: [Ethers.js v6](https://docs.ethers.org/v6/)
- **Pattern**: Factory Pattern (`ChamaFactory` creates `ChamaCore` instances)

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm
- MetaMask installed with Sepolia testnet configured
- Sepolia test ETH from a faucet

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/eugene-gabriel/decentralized-chama.git
   cd decentralized-chama
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=your_factory_contract_address
   NEXT_PUBLIC_KRNL_KERNEL_ADDRESS=your_kernel_contract_address
   NEXT_PUBLIC_NETWORK=SEPOLIA
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

5. **Connect MetaMask**
   - Switch to Sepolia testnet in MetaMask
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
   - Connect your wallet to the app

## Architecture

### 1. Smart Contracts

The core logic uses a Factory Pattern:

- **`ChamaFactory.sol`**: Creates and manages multiple Chama groups, emits `GroupCreated` events with sequential IDs.
- **`ChamaCore.sol`**: The Vault. Stores funds, manages member registry, and tracks rounds for each group.
- **`ChamaKernel.sol`**: The Brain. Validates off-chain logic (via KRNL) and authorizes `ChamaCore` to release funds.

### 2. Data Flow

To ensure a snappy UX without waiting for block confirmations for every read:

1. **Read**: The UI fetches displayed data (Dashboard stats, Member lists, Contribution history) primarily from **Supabase**.
2. **Write**: Critical actions (Create Group, Join Group, Contribute, Payout) are executed on the **Blockchain**.
3. **Sync**: Successful on-chain transactions trigger updates to Supabase, keeping the two states in sync.

### 3. Recent Improvements

- ✅ **Real-Time Data Integration**: All pages now display live blockchain and Supabase data
- ✅ **Dynamic Currency Handling**: Automatically displays ETH for Sepolia
- ✅ **Interactive Dialogs**: Functional "Make Contribution" and "Add Member" buttons
- ✅ **Contribution History Charts**: Visual trends from real transaction data
- ✅ **Wallet Management**: Disconnect wallet via dropdown menu

## License

This project is licensed under the MIT License.

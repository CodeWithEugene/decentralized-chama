<div align="center">
  <img src="public/logo.png" alt="Decentralized Chama Logo">

# Decentralized Chama (DChama)

**Digitizing Trust. Automating Prosperity.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Solidity](https://img.shields.io/badge/Solidity-Smart_Contracts-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Hedera](https://img.shields.io/badge/Hedera-Testnet-222222?style=for-the-badge&logo=hedera&logoColor=white)](https://hedera.com/)
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

**Decentralized Chama (DChama)** is a modern financial platform that brings traditional Rotating Savings and Credit Associations (<strong>ROSCAs</strong>) onto the blockchain. By leveraging smart contracts and real-time data synchronization, DChama automates the "Merry-Go-Round" cycle—ensuring transparency, security, and trustless execution for all members.

DChama solves the classic problems of informal groups:

- **Trust**: Funds are held in a non-custodial smart contract vault.
- **Transparency**: Every contribution and payout is recorded on-chain.
- **Automation**: KRNL orchestration ensures payouts happen strictly according to schedule.

## How It Works

DChama simplifies the traditional Chama experience into a digial, automated flow. Here is how a user interacts with the platform:

1.  **Connect Wallet**: Users connect their digital wallet (like MetaMask) to the app. This wallet acts as their identity and bank account.
2.  **Create or Join**: A user can create a new Chama group (setting the contribution amount and cycle) or join an existing one using a Group ID.
3.  **Contribute**: Members contribute funds (ROSE or HBAR) directly to the smart contract vault. These funds are locked and safe.
4.  **Rotate & Receive**: Based on the predetermined schedule, the system automatically enables the next member in line to receive the pooled funds.
5.  **Track**: Everything is visible on the dashboard—who paid, who owes, and whose turn it is next.

## Supported Tokens

Understanding the currency of the platform:

- **ROSE (Oasis Network)**: The native token of the Oasis Sapphire blockchain. It is used to pay for transaction fees (gas) and is the currency used for contributions and payouts within the Chama when running on Oasis. Sapphire adds a layer of privacy to these transactions.
- **HBAR (Hedera)**: The native token of the Hedera network. Known for its high speed and low fixed fees, HBAR is used for contributions when the platform is deployed on Hedera.

## Key Features

- 🏦 **Smart Vaults**: Funds are secured in the `ChamaCore` contract, not a personal bank account.
- 🔄 **Automated Payouts with KRNL**: The `ChamaKernel` uses the **KRNL Protocol** to orchestrate rotating payouts. It imposes checks (like solvency and time verification) off-chain before authorizing the on-chain release of funds, ensuring the rotation is tamper-proof.
- 📊 **Real-Time Dashboard**: A responsive UI powered by Supabase for instant feedback, synchronized with on-chain data.
- 👛 **Wallet Integration**: Seamless connection with MetaMask (and compatible wallets) for HBAR/ROSE transactions.
- 📱 **Mobile First**: Fully responsive design optimized for on-the-go management.
- 🛡️ **Dual-Write Architecture**: immediate UI updates coupled with immutable blockchain verification.

## Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Data

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Indexing**: Custom "Dual Write" logic (Frontend → Chain → DB)

### Blockchain

- **Contracts**: Solidity (`foundry`)
- **Networks**: Hedera Testnet, Oasis Sapphire Testnet
- **Orchestration**: KRNL (Kernel) Protocol
- **Interaction**: [Ethers.js v6](https://docs.ethers.org/v6/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm
- MetaMask installed

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/eugene-gabriel/decentralized-chama.git
    cd decentralized-chama
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=your_contract_address
    NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Architecture

### 1. Smart Contracts

The core logic resides in two contracts:

- **`ChamaCore.sol`**: The Vault. Stores funds, manages member registry, and tracks rounds.
- **`ChamaKernel.sol`**: The Brain. Validates off-chain logic (via KRNL) and authorizes `ChamaCore` to release funds.

### 2. Data Flow

To ensure a snappy UX without waiting for block confirmations for every read:

1.  **Read**: The UI fetches displayed data (Dashboard stats, Member lists) primarily from **Supabase**.
2.  **Write**: Critical actions (Contribute, Payout) are executed on the **Blockchain**.
3.  **Sync**: Successful on-chain transactions trigger updates to Supabase, keeping the two states in sync.

## License

This project is licensed under the MIT License.

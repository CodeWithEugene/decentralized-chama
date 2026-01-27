# Decentralised Chama

DChama is a decentralized financial platform that digitizes traditional Kenyan informal savings groups (Chamas) by using blockchain smart contracts to automate contributions, secure rotating payouts, and provide immutable, transparent record-keeping for all members.

_Automatically synced with your [v0.app](https://v0.app) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/eugene-gabriel/v0-decentralized-chama-krnl)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/pc6H6iq7A5W)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/eugene-gabriel/v0-decentralized-chama-krnl](https://vercel.com/eugene-gabriel/v0-decentralized-chama-krnl)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/pc6H6iq7A5W](https://v0.app/chat/pc6H6iq7A5W)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Technical Overview

### 1. DChama Platform Overview

DChama is a web-based dApp that allows users to form or join ROSCAs (Rotating Savings and Credit Associations). It automates the "Merry-Go-Round" cycle where members contribute a fixed monthly amount, and the pool is disbursed to one member each month in a predetermined rotation.

#### User Journey

- **Creation:** A group leader creates a DChama, sets the contribution (e.g., 1,000 KES eq), and invites 9 other members.
- **Contribution:** Every 30 days, members deposit their funds into the ChamaCore vault.
- **Orchestration:** The KRNL Kernel verifies that all deposits are present.
- **Payout:** KRNL triggers the automated payout to the next member in the rotation.

### 2. Technical Architecture

The platform is split into three layers to balance security, automation, and privacy.

- **Execution Layer (Hedera/Solidity):** The `ChamaCore.sol` contract manages the vault and membership.
- **Orchestration Layer (KRNL):** The `ChamaKernel.sol` manages time-based triggers and ensures business logic (e.g., "did everyone pay?") is verified before any transaction.
- **Privacy Layer (KRNL Token Authority):** Keeps the mapping of "Wallet Address to Real Name" private, only revealing it to group members.

### 3. Smart Contract Security Rules

To protect the treasury from hacks and internal bad actors, DChama implements the following security protocols:

#### A. The "Checks-Effects-Interactions" Pattern

- **Rule:** The contract must update the "payout status" for a member before actually sending the funds.
- **Why:** Prevents Reentrancy Attacks, where a malicious contract could try to drain the pool by calling the withdrawal function multiple times before the balance is updated.

#### B. KRNL-Only Access Control

- **Rule:** The `executePayout()` function must be restricted to the KRNL Kernel address using a custom modifier.
- **Why:** Ensures that no individual—not even the group creator—can manually trigger a payout to themselves out of turn.

#### C. Integer Overflow Protection (Solidity 0.8+)

- **Rule:** Use Solidity version `^0.8.0` for all arithmetic.
- **Why:** Automatically reverts transactions if a calculation would result in an overflow or underflow, preventing "fake balance" exploits.

#### D. The "Pull" over "Push" Payment Pattern

- **Rule:** Instead of the contract automatically pushing funds to a winner's wallet (which could fail and freeze the contract), the contract marks funds as "Available for Claim."
- **Why:** Protects the cycle from being stalled if a member’s wallet is blacklisted or incompatible with the payout.
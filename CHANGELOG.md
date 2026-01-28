# Changelog

All notable changes to the **Decentralized Chama (DChama)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **KRNL Integration**: Added `ChamaKernel.sol` for orchestrating payouts using KRNL verification protocols.
- **Smart Contracts**: Implemented `ChamaCore.sol` for secure vault management and member registry.
- **Supabase Integration**: Implemented "Dual Write" strategy to sync blockchain events with Supabase database for real-time UI updates.
- **Dashboard UI**:
  - Real-time statistics for Treasury Balance, Member Count, and Contribution totals.
  - "Connect Wallet" functionality using Ethers.js.
  - Interactive charts (placeholder data removed).
- **Mobile Responsiveness**: optimized Sidebar and page layouts for mobile viewports.
- **Documentation**: Added comprehensive `README.md` with architecture diagrams and setup guides.

### Changed

- **Data Source**: Migrated from hardcoded dummy data to dynamic fetching from Supabase `groups`, `members`, and `contributions` tables.
- **UI Polish**: Updated Sidebar styling (Purple logout button, centered text) and removed Theme Toggle.
- **Configuration**: Updated `next.config.mjs` to resolve Turbopack compatibility warnings.

### Fixed

- **Contract Calls**: Resolved "Provider not initialized" errors in `useChamaGroup` hook by adding initialization guards.
- **Build Errors**: Fixed syntax errors in `sidebar.tsx` and resolved linting conflicts.

## [0.1.0] - 2024-03-XX

### Initial Release

- Basic Next.js application structure with Shadcn UI.
- Initial smart contract prototypes.
- Authentication flow setup.

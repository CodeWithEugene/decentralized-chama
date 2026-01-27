# Terms of Service for DChama

**Last Updated:** 27 January 2026

Welcome to DChama! These Terms of Service ("Terms") govern your use of our web-based decentralized application (dApp) for Rotating Savings and Credit Associations (ROSCAs). By using DChama, you agree to these terms.

## 1. Description of Service

DChama is a platform that allows users to create and participate in decentralized "Merry-Go-Round" savings cycles. The platform leverages smart contracts to automate contributions and payouts.

- **Group Creation:** A user can create a DChama, define the contribution amount, and invite other members.
- **Automated Cycle:** Members contribute funds to a smart contract vault (ChamaCore.sol) every 30 days. An orchestration layer (ChamaKernel.sol) verifies all conditions are met and triggers an automated payout to the member whose turn it is in the rotation.

## 2. Your Responsibilities

- **Wallet Security:** You are solely responsible for the security of your own blockchain wallet, private keys, and any other credentials used to access DChama. We do not have access to your private keys and cannot recover your funds if you lose them.
- **Group Agreements:** You agree to abide by the contribution amount and schedule set by your DChama group leader. Failure to contribute on time may result in penalties or removal from the group, as defined by the group's rules.
- **Taxes:** You are responsible for determining what, if any, taxes apply to the transactions you make on the platform.

## 3. Platform Architecture and Security

DChama is built on a three-layer architecture to ensure security, automation, and privacy:
- **Execution Layer (Hedera/Solidity):** The `ChamaCore.sol` contract manages funds and membership.
- **Orchestration Layer (KRNL):` The `ChamaKernel.sol` contract enforces time-based triggers and business logic.
- **Privacy Layer (KRNL Token Authority):** Protects the mapping of wallet addresses to real names, revealing it only to group members.

We have implemented several security protocols to protect user funds, including:
- The "Checks-Effects-Interactions" pattern to prevent reentrancy attacks.
- KRNL-Only access control to ensure only the automated kernel can trigger payouts.
- Solidity version `^0.8.0` for integer overflow protection.
- A "pull" over "push" payment pattern to prevent stalled contracts.

## 4. Disclaimers and Limitation of Liability

- **AS-IS Service:** DChama is provided "as is" and "as available" without any warranties. While we have built a secure system, we cannot guarantee that it will be free from bugs, hacks, or other errors.
- **Risk of Blockchain Technology:** You understand that using a dApp involves risks, including but not limited to, the risk of smart contract vulnerabilities, blockchain network failures, and regulatory changes.
- **No Financial Advice:** We are not a financial institution and do not provide financial advice. Your use of DChama is at your own risk.

## 5. Changes to Terms

We may amend these Terms at any time by posting the revised version on our website. The changes will be effective immediately upon posting.

## 6. Contact Us

If you have any questions about these Terms, please contact us via the methods listed on our platform.

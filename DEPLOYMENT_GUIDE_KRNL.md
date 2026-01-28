# KRNL Smart Contract Deployment Guide

This guide explains how to deploy the **ChamaKernel** and **ChamaCore** contracts and integrate them with the KRNL Protocol.

## Prerequisites

1.  **Foundry**: Required for contract deployment.
    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    # Restart terminal or source rc file
    foundryup
    ```
2.  **Docker Desktop**: Required for creating the Attestor image.
    [Download Docker Desktop](https://www.docker.com/get-started/)
3.  **Privy Account**: Required for embedded wallet functionality.
    [Dashboard](https://dashboard.privy.io/)
4.  **Pimlico API Key**: Required for account abstraction/bundlers.
    [Dashboard](https://dashboard.pimlico.io/)

## Step 1: Configuration

Ensure your `.env` file has the following filled out:

```env
PRIVATE_KEY=0xYourPrivateKey
NEXT_PUBLIC_DELEGATED_ACCOUNT_ADDRESS=0x9969827E2CB0582e08787B23F641b49Ca82bc774
NEXT_PUBLIC_PRIVY_APP_ID=YourPrivyAppID
```

## Step 2: Contract Deployment

Run the automated deployment script to deploy contracts to the Hedera Testnet (or configured network).

```bash
./scripts/deploy-krnl.sh
```

_Copy the `ChamaCore` and `ChamaKernel` addresses from the output to your `.env`._

## Step 3: Setup KRNL Attestor

The Attestor handles the secure execution of your workflows.

1.  Run the setup script:
    ```bash
    ./scripts/setup-attestor.sh
    ```
2.  Follow the interactive prompts from the `create-attestor-standalone` script.
    - **Note**: You will need your Docker Registry/Username and Private Key.
3.  Copy the generated **Attestor Image URI** (starts with `image://`).
4.  Add it to your `.env`:
    ```env
    NEXT_PUBLIC_ATTESTOR_IMAGE=image://docker.io/yourname/attestor-realestate:latest
    ```

## Step 4: Frontend Integration

Ensure your frontend environment variables are set:

```env
NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_KRNL_KERNEL_ADDRESS=0x...
NEXT_PUBLIC_ATTESTOR_IMAGE=image://...
NEXT_PUBLIC_PRIVY_APP_ID=...
```

## Troubleshooting

- **Forge not found**: Run `foundryup` and check your PATH.
- **Docker not running**: Start Docker Desktop before running the attestor script.

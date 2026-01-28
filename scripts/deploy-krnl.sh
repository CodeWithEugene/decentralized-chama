#!/bin/bash

# Load environment variables
export PATH="$HOME/.foundry/bin:$PATH"

if [ -f .env ]; then
    source .env
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not found in .env"
    exit 1
fi

echo "Deploying to Hedera Testnet..."

# 1. Deploy ChamaKernel (The Brain)
echo "Deploying ChamaKernel..."
KERNEL_OUTPUT=$(forge create contracts/ChamaKernel.sol:ChamaKernel \
    --rpc-url hedera_testnet \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --json)

KERNEL_ADDRESS=$(echo $KERNEL_OUTPUT | grep -o '"deployedTo": *"[^"]*"' | cut -d'"' -f4)
echo "ChamaKernel deployed to: $KERNEL_ADDRESS"

# 2. Deploy ChamaCore (The Vault)
# Args: name, description, contributionAmount (in wei), payoutCycle (seconds), kernelAddress
NAME="Chama Demo Group"
DESC="A decentralized savings group"
AMOUNT="1000000000000000000" # 1 HBAR/ROSE
CYCLE="2592000" # 30 days

echo "Deploying ChamaCore..."
CORE_OUTPUT=$(forge create contracts/ChamaCore.sol:ChamaCore \
    --rpc-url hedera_testnet \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --json \
    --constructor-args "$NAME" "$DESC" "$AMOUNT" "$CYCLE" "$KERNEL_ADDRESS")

CORE_ADDRESS=$(echo $CORE_OUTPUT | grep -o '"deployedTo": *"[^"]*"' | cut -d'"' -f4)
echo "ChamaCore deployed to: $CORE_ADDRESS"

echo "----------------------------------------------------"
echo "Deployment Complete!"
echo "Kernel: $KERNEL_ADDRESS"
echo "Core:   $CORE_ADDRESS"
echo "----------------------------------------------------"
echo "Update your .env.local with these addresses!"

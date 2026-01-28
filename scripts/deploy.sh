#!/bin/bash

# Decentralized-Chama Deployment Script
# Automates smart contract deployment to Hedera and Oasis Sapphire

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# CONFIGURATION
# ============================================================================

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env with PRIVATE_KEY, HEDERA_RPC_URL, and OASIS_SAPPHIRE_RPC_URL"
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
check_env_var() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}Error: $1 is not set${NC}"
        exit 1
    fi
}

# Check required environment variables
check_env_var "PRIVATE_KEY"

# Set defaults if not provided
HEDERA_RPC_URL="${HEDERA_RPC_URL:-https://testnet.hashio.io/api}"
OASIS_SAPPHIRE_RPC_URL="${OASIS_SAPPHIRE_RPC_URL:-https://testnet.sapphire.oasis.io}"
SEPOLIA_RPC_URL="${SEPOLIA_RPC_URL:-https://ethereum-sepolia.publicnode.com}"
GAS_PRICE="${GAS_PRICE:-100000000}"
CHAIN="${CHAIN:-hedera}"  # Default to Hedera

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# ============================================================================
# DEPLOYMENT FUNCTIONS
# ============================================================================

deploy_to_hedera() {
    print_header "Deploying to Hedera Testnet"
    
    print_info "RPC URL: $HEDERA_RPC_URL"
    print_info "Gas Price: $GAS_PRICE"
    
    # Compile contracts
    print_info "Compiling contracts..."
    if ! forge build; then
        print_error "Compilation failed"
        exit 1
    fi
    print_success "Contracts compiled"
    
    # Deploy ChamaCore
    print_info "Deploying ChamaCore..."
    CHAMA_CORE=$(forge create src/ChamaCore.sol:ChamaCore \
        --rpc-url $HEDERA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --gas-price $GAS_PRICE \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_CORE" ]; then
        print_error "ChamaCore deployment failed"
        exit 1
    fi
    print_success "ChamaCore deployed to: $CHAMA_CORE"
    
    # Deploy ChamaKernel
    print_info "Deploying ChamaKernel..."
    CHAMA_KERNEL=$(forge create src/ChamaKernel.sol:ChamaKernel \
        --rpc-url $HEDERA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --constructor-args $CHAMA_CORE \
        --gas-price $GAS_PRICE \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_KERNEL" ]; then
        print_error "ChamaKernel deployment failed"
        exit 1
    fi
    print_success "ChamaKernel deployed to: $CHAMA_KERNEL"
    
    # Link Kernel to Core
    print_info "Linking ChamaKernel to ChamaCore..."
    cast send $CHAMA_CORE \
        "setKernelAddress(address)" $CHAMA_KERNEL \
        --rpc-url $HEDERA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --gas-price $GAS_PRICE
    print_success "Kernel address set"
    
    # Save deployment info
    save_deployment_info "hedera" "$CHAMA_CORE" "$CHAMA_KERNEL"
    
    print_header "Hedera Deployment Complete!"
    echo -e "${GREEN}ChamaCore:  $CHAMA_CORE${NC}"
    echo -e "${GREEN}ChamaKernel: $CHAMA_KERNEL${NC}"
    echo -e "\n${YELLOW}Add these to your .env.local:${NC}"
    echo "NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=$CHAMA_CORE"
    echo "NEXT_PUBLIC_NETWORK=HEDERA_TESTNET"
}

deploy_to_oasis() {
    print_header "Deploying to Oasis Sapphire"
    
    print_info "RPC URL: $OASIS_SAPPHIRE_RPC_URL"
    print_info "Gas Price: $GAS_PRICE"
    
    # Compile contracts
    print_info "Compiling contracts..."
    if ! forge build; then
        print_error "Compilation failed"
        exit 1
    fi
    print_success "Contracts compiled"
    
    # Deploy ChamaCore
    print_info "Deploying ChamaCore..."
    CHAMA_CORE=$(forge create src/ChamaCore.sol:ChamaCore \
        --rpc-url $OASIS_SAPPHIRE_RPC_URL \
        --private-key $PRIVATE_KEY \
        --gas-price $GAS_PRICE \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_CORE" ]; then
        print_error "ChamaCore deployment failed"
        exit 1
    fi
    print_success "ChamaCore deployed to: $CHAMA_CORE"
    
    # Deploy ChamaKernel
    print_info "Deploying ChamaKernel..."
    CHAMA_KERNEL=$(forge create src/ChamaKernel.sol:ChamaKernel \
        --rpc-url $OASIS_SAPPHIRE_RPC_URL \
        --private-key $PRIVATE_KEY \
        --constructor-args $CHAMA_CORE \
        --gas-price $GAS_PRICE \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_KERNEL" ]; then
        print_error "ChamaKernel deployment failed"
        exit 1
    fi
    print_success "ChamaKernel deployed to: $CHAMA_KERNEL"
    
    # Link Kernel to Core
    print_info "Linking ChamaKernel to ChamaCore..."
    cast send $CHAMA_CORE \
        "setKernelAddress(address)" $CHAMA_KERNEL \
        --rpc-url $OASIS_SAPPHIRE_RPC_URL \
        --private-key $PRIVATE_KEY \
        --gas-price $GAS_PRICE
    print_success "Kernel address set"
    
    # Save deployment info
    save_deployment_info "oasis" "$CHAMA_CORE" "$CHAMA_KERNEL"
    
    print_header "Oasis Sapphire Deployment Complete!"
    echo -e "${GREEN}ChamaCore:  $CHAMA_CORE${NC}"
    echo -e "${GREEN}ChamaKernel: $CHAMA_KERNEL${NC}"
    echo -e "\n${YELLOW}Add these to your .env.local:${NC}"
    echo "NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=$CHAMA_CORE"
    echo "NEXT_PUBLIC_NETWORK=OASIS_SAPPHIRE"
}

deploy_to_sepolia() {
    print_header "Deploying to Sepolia Testnet"
    
    print_info "RPC URL: $SEPOLIA_RPC_URL"
    
    # Compile contracts
    print_info "Compiling contracts..."
    if ! forge build; then
        print_error "Compilation failed"
        exit 1
    fi
    print_success "Contracts compiled"
    
    # Deploy ChamaKernel
    print_info "Deploying ChamaKernel..."
    CHAMA_KERNEL=$(forge create contracts/ChamaKernel.sol:ChamaKernel \
        --rpc-url $SEPOLIA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_KERNEL" ]; then
        print_error "ChamaKernel deployment failed"
        exit 1
    fi
    print_success "ChamaKernel deployed to: $CHAMA_KERNEL"

    # Deploy ChamaFactory (The Main Contract)
    print_info "Deploying ChamaFactory..."
    CHAMA_FACTORY=$(forge create contracts/ChamaFactory.sol:ChamaFactory \
        --rpc-url $SEPOLIA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        --constructor-args $CHAMA_KERNEL \
        2>&1 | grep "Deployed to:" | awk '{print $3}')
    
    if [ -z "$CHAMA_FACTORY" ]; then
        print_error "ChamaFactory deployment failed"
        exit 1
    fi
    print_success "ChamaFactory deployed to: $CHAMA_FACTORY"
    
    # Save deployment info
    save_deployment_info "sepolia" "$CHAMA_FACTORY" "$CHAMA_KERNEL"
    
    print_header "Sepolia Deployment Complete!"
    echo -e "${GREEN}ChamaFactory:  $CHAMA_FACTORY${NC}"
    echo -e "${GREEN}ChamaKernel: $CHAMA_KERNEL${NC}"
    echo -e "\n${YELLOW}Adding these to .env automatically...${NC}"
    
    # Update .env
    sed -i '' "s/NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CHAMA_CONTRACT_ADDRESS=$CHAMA_FACTORY/" .env
    sed -i '' "s/NEXT_PUBLIC_NETWORK=.*/NEXT_PUBLIC_NETWORK=SEPOLIA/" .env
    echo "Updated .env"
}

deploy_to_both() {
    print_header "Deploying to Both Networks"
    
    deploy_to_hedera
    deploy_to_oasis
    
    print_header "Multi-Chain Deployment Complete!"
}

save_deployment_info() {
    local network=$1
    local core=$2
    local kernel=$3
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    
    cat > "deployments/${network}_${timestamp}.json" <<EOF
{
  "network": "$network",
  "timestamp": "$(date)",
  "chamaCore": "$core",
  "chamaKernel": "$kernel",
  "rpcUrl": "${HEDERA_RPC_URL:-$OASIS_SAPPHIRE_RPC_URL}"
}
EOF
    
    print_success "Deployment info saved to deployments/${network}_${timestamp}.json"
}

verify_contracts() {
    print_header "Verifying Contracts"
    
    if [ -z "$CONTRACT_ADDRESS" ]; then
        print_error "CONTRACT_ADDRESS not provided"
        return 1
    fi
    
    print_info "Flattening contract for verification..."
    forge flatten src/ChamaCore.sol > ChamaCore.flat.sol
    print_success "Contract flattened"
    
    print_info "Visit the block explorer and upload ChamaCore.flat.sol for verification"
}

# ============================================================================
# MAIN MENU
# ============================================================================

show_menu() {
    echo -e "\n${GREEN}Decentralized-Chama Smart Contract Deployment${NC}"
    echo "============================================"
    echo "1) Deploy to Hedera Testnet"
    echo "2) Deploy to Oasis Sapphire Testnet"
    echo "3) Deploy to Sepolia Testnet"
    echo "4) Deploy to Both Networks"
    echo "5) Verify Contracts"
    echo "6) Exit"
    echo -e "\n${YELLOW}Select option:${NC} "
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    # Create deployments directory
    mkdir -p deployments
    
    # Check if CHAIN is provided as argument
    if [ $# -gt 0 ]; then
        case $1 in
            hedera)
                deploy_to_hedera
                ;;
            oasis)
                deploy_to_oasis
                ;;
            sepolia)
                deploy_to_sepolia
                ;;
            both)
                deploy_to_both
                ;;
            verify)
                verify_contracts
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Usage: ./scripts/deploy.sh [hedera|oasis|sepolia|both|verify]"
                exit 1
                ;;
        esac
    else
        # Interactive menu
        while true; do
            show_menu
            read -r choice
            
            case $choice in
                1)
                    deploy_to_hedera
                    ;;
                2)
                    deploy_to_oasis
                    ;;
                3)
                    deploy_to_sepolia
                    ;;
                4)
                    deploy_to_both
                    ;;
                5)
                    verify_contracts
                    ;;
                6)
                    print_info "Exiting..."
                    exit 0
                    ;;
                *)
                    print_error "Invalid option. Please try again."
                    ;;
            esac
        done
    fi
}

# Run main function
main "$@"

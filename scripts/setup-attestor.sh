#!/bin/bash

# Download the create-attestor script from KRNL docs
curl https://public.mypinata.cloud/ipfs/bafkreifvezdhwvmi6psqqk6vxalazp56ovx3fmgqkmfu5ih5xyxsdbfixi -o create-attestor-standalone.sh
chmod +x create-attestor-standalone.sh

echo "----------------------------------------------------------------"
echo "KRNL Attestor Setup Script Downloaded."
echo "----------------------------------------------------------------"
echo "Prerequisites:"
echo "1. Docker Desktop must be installed and running."
echo "2. You need a Docker Hub account."
echo "----------------------------------------------------------------"
echo "To create your attestor, run:"
echo "./create-attestor-standalone.sh"
echo "----------------------------------------------------------------"

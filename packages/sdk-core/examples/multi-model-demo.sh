#!/bin/bash

# Get provider from args
if [[ $1 != "--provider=openai" && $1 != "--provider=anthropic" && $1 != "--provider=gemini" ]]; then
  echo "Invalid provider: $1"
  echo "Usage: $0 [--provider=openai|anthropic|gemini]"
  exit 1
fi

# Extract provider name
provider=${1#--provider=}

# Run the demo
echo "=== Actionpackd AI SDK Demo ==="
echo "Provider: $provider"
echo "=========================="

# Run demo with provider
cd "$(dirname "$0")"
pnpm tsx "$(pwd)/simple-demo.ts" --provider $provider

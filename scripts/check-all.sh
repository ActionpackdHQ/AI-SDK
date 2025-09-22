#!/bin/bash
set -e

echo "Running all acceptance checks..."
echo

echo "1. Installing dependencies..."
pnpm -w install

echo
echo "2. Running tests..."
pnpm -w test

echo
echo "3. Building packages..."
pnpm -w build

echo
echo "4. Running simple demo..."
pnpm tsx packages/sdk-core/examples/simple-demo.ts --provider=openai

echo
echo "5. Running multi-model demo..."
bash packages/sdk-core/examples/multi-model-demo.sh --provider=gemini

echo
echo "6. Running secrets check..."
pnpm tsx packages/sdk-core/src/utils/secrets-check.ts

echo
echo "7. Running lint..."
pnpm -w lint

echo
echo "8. Running security audit..."
pnpm -w audit

echo
echo "All checks completed!"

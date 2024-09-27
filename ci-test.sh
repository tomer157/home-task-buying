#!/bin/bash

# Exit ..
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Run environment setup
echo "Setting up env variables..."
export $(grep -v '^#' .env | xargs)

# Run the Test suite
echo "Running Tests..."
npx playwright test


echo "All tests completed succefully!"
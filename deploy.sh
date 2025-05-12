#!/bin/bash

# Exit on any error
set -e

# Ensure we're using Node.js 18
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ ! $NODE_VERSION =~ ^v18 ]]; then
  echo "Please use Node.js v18 for Firebase deployment"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client and server
echo "Building application..."
npm run build

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --non-interactive

echo "Deployment complete! Your app should be available at https://${VITE_FIREBASE_PROJECT_ID}.web.app"
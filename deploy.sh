#!/bin/bash

# Exit on any error
set -e

# Ensure we're using Node.js 18 or higher
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
if [[ ! $NODE_VERSION =~ ^v18 && ! $NODE_VERSION =~ ^v20 && ! $NODE_VERSION =~ ^v22 ]]; then
  echo "Please use Node.js v18, v20, or v22 for Firebase deployment"
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client and server
echo "Building application..."
npm run build

# Check if user is logged in to Firebase
echo "Checking Firebase login status..."
firebase projects:list > /dev/null 2>&1 || {
  echo "You are not logged in to Firebase. Please run 'firebase login' first."
  exit 1
}

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy

echo "Deployment complete! Your app should be available at https://event-buddy-b042b.web.app"
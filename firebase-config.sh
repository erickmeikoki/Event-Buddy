#!/bin/bash

# This script sets up Firebase environment variables for deployment

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "Logging in to Firebase..."
firebase login

# Set environment variables
echo "Setting Firebase environment variables..."

# Ask for MongoDB URI
read -p "Enter MongoDB URI: " MONGODB_URI

# Set Firebase config values
firebase functions:config:set mongodb.uri="$MONGODB_URI"

# Verify the configuration
echo "Configuration set. Current Firebase configuration:"
firebase functions:config:get

echo "Firebase configuration complete!"
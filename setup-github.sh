#!/bin/bash

# GitHub Repository Setup Script (No gh CLI required)
#
# PREREQUISITES:
# 1. Create repo manually at https://github.com/new
# 2. Generate a Personal Access Token at:
#    GitHub → Settings → Developer settings → Personal access tokens
#    (Token is used as password, stored in macOS Keychain - never in this repo)

set -e

# ============ CONFIGURE THESE ============
GITHUB_USER="YOUR_USERNAME"     # Your GitHub username
REPO_NAME="bft-cloudflare"      # Repository name
GIT_NAME="Your Name"            # Your name for commits
GIT_EMAIL="you@example.com"     # Your email for commits
# =========================================

echo "=== GitHub Repository Setup ==="
echo ""

# Check if user configured the script
if [ "$GITHUB_USER" = "YOUR_USERNAME" ]; then
    echo "ERROR: Please edit this script first!"
    echo "Open setup-github.sh and set:"
    echo "  - GITHUB_USER (your GitHub username)"
    echo "  - GIT_NAME (your name)"
    echo "  - GIT_EMAIL (your email)"
    exit 1
fi

# Configure git if not already
if [ -z "$(git config --global user.name)" ]; then
    echo "Configuring git..."
    git config --global user.name "$GIT_NAME"
    git config --global user.email "$GIT_EMAIL"
    echo "✓ Git configured"
fi

# Store credentials in macOS Keychain
git config --global credential.helper osxkeychain

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    echo "Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "✓ Remote added"
else
    echo "✓ Remote already configured"
fi

# Add all files and commit
echo ""
echo "Adding files..."
git add .

if git diff --staged --quiet; then
    echo "No changes to commit"
else
    git commit -m "Initial commit: BFT Workout Tracker

- Cloudflare Workers backend with D1 database
- Mobile-first responsive UI
- Workout logging, planning, and progress tracking

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
    echo "✓ Changes committed"
fi

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
echo "(If prompted for password, use your Personal Access Token)"
echo ""
git branch -M main
git push -u origin main

echo ""
echo "=== Setup Complete ==="
echo "Repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "Your credentials are stored in macOS Keychain (not in this repo)"

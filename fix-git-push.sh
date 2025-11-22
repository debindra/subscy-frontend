#!/bin/bash

# Fix git push HTTP 400 error
# This script increases HTTP buffer size and attempts to push

set -e

echo "🔧 Fixing git push HTTP 400 error..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Increase HTTP post buffer size (500MB)
echo "📦 Increasing HTTP post buffer size..."
git config http.postBuffer 524288000

# Also increase HTTP version if needed
echo "📦 Configuring HTTP version..."
git config http.version HTTP/1.1

# Check current remote URL
echo ""
echo "📍 Current remote URL:"
git remote get-url origin

echo ""
echo "🔄 Attempting to push with increased buffer..."
echo ""

# Try to push
if git push origin main; then
    echo ""
    echo "✅ Push successful!"
else
    echo ""
    echo "⚠️  Push still failed. Trying alternative methods..."
    echo ""
    
    # Try pushing with verbose output
    echo "🔄 Attempting push with verbose output..."
    GIT_CURL_VERBOSE=1 GIT_TRACE=1 git push origin main 2>&1 | head -50
    
    echo ""
    echo "💡 If push still fails, try:"
    echo "   1. Check your GitHub authentication: git config --global credential.helper"
    echo "   2. Verify repository permissions"
    echo "   3. Try pushing in smaller chunks: git push origin HEAD~5:main (pushes last 5 commits)"
    echo "   4. Check for large files that should be in .gitignore or LFS"
fi



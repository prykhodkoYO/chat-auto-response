#!/bin/bash

# Project verification script
echo "🔍 Verifying project structure for deployment..."
echo

# Check for required files
echo "📁 Checking required configuration files:"
files=(
  "README.md"
  "DEPLOYMENT.md" 
  "CHECKLIST.md"
  ".gitignore"
  "render.yaml"
  "client/package.json"
  "client/vercel.json"
  "client/.env.example"
  "client/.gitignore"
  "server/package.json"
  "server/tsconfig.json"
  "server/.env.example"
  "server/.gitignore"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
  fi
done

echo
echo "⚠️  Checking for files that should NOT be committed:"
sensitive_files=(
  "client/.env"
  "server/.env"
  "server/server.js"
  "server/models/Chat.js"
  "server/routes/chatRoutes.js"
)

for file in "${sensitive_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ❌ $file (should be removed!)"
  else
    echo "  ✅ $file (not present - good)"
  fi
done

echo
echo "🎯 Project verification complete!"
echo "📖 See CHECKLIST.md for next steps"
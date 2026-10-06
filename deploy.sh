#!/bin/bash

# above is called the shebang line - to use the bash and run this script

set -e  # to prevent continuing if any fails

echo "🚀 1. Pulling latest changes from GitHub..."
git pull origin main

echo "⚙️ 2. Updating Back-end..."
cd back-end
npm install --no-audit
pm2 reload nexaro-api
echo "👍Backend Updated Succesfully and pm2 reloaded"

echo "🎨 3. Rebuilding Front-end..."
cd ../front-end
npm install --no-audit
npm run build
echo "Front-end re-build completed 👍"


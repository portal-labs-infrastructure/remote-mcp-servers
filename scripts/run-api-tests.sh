#!/bin/bash

# Test runner script for v0 API
set -e

echo "🚀 Starting v0 API Test Runner"

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    exit
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Start the development server in background
echo "📡 Starting development server..."
npm run dev &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 5

# Check if server is running on port 3000 or 3001
SERVER_URL=""
for i in {1..10}; do
    if curl -s http://localhost:3000/api/v0/servers?limit=1 > /dev/null 2>&1; then
        SERVER_URL="http://localhost:3000"
        echo "✅ Server is ready on port 3000!"
        break
    elif curl -s http://localhost:3001/api/v0/servers?limit=1 > /dev/null 2>&1; then
        SERVER_URL="http://localhost:3001"
        echo "✅ Server is ready on port 3001!"
        break
    fi
    echo "⏳ Still waiting... ($i/10)"
    sleep 2
done

if [ -z "$SERVER_URL" ]; then
    echo "❌ Server failed to start or is not accessible"
    exit 1
fi

# Run the tests
echo "🧪 Running tests..."
npx vitest run tests/integration/api-v0.test.ts --reporter=verbose

echo "✨ Tests completed!"
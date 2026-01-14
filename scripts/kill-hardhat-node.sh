#!/bin/bash
# Kill any process using port 8545 (Hardhat default port)

PORT=8545
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✓ Port $PORT is already free"
  exit 0
fi

echo "Found process $PID on port $PORT"
kill -9 $PID 2>/dev/null

sleep 1

if lsof -ti:$PORT > /dev/null 2>&1; then
  echo "⚠ Failed to kill process. Try manually: kill -9 $PID"
  exit 1
else
  echo "✓ Port $PORT is now free"
  exit 0
fi

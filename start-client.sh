#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export DANGEROUSLY_DISABLE_HOST_CHECK=true
export HOST=0.0.0.0
export PORT=3000
cd /Users/satvikreddy/ShopLC
exec /opt/homebrew/bin/npm start --prefix client

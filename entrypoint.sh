#!/bin/bash
export VITE_BUILD_HASH=$(cat /opt/app/build.hash 2>/dev/null || echo "development")
exec "$@"
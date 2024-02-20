#!/bin/bash
export VITE_BUILD_HASH=$(cat /opt/app/build.hash)
exec "$@"
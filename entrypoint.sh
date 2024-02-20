#!/bin/bash
export BUILD_HASH=$(cat ./build.hash)
exec "$@"
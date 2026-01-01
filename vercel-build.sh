#!/bin/bash
set -e # Exit on any error

# Install dependencies using pip instead of uv
pip install --upgrade pip
pip install -r requirements.txt

# If the above fails, try with specific flags
if [ $? -ne 0 ]; then
    echo "Standard pip install failed, trying with --no-cache-dir"
    pip install --no-cache-dir -r requirements.txt
fi
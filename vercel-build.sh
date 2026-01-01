#!/bin/bash
set -e # Exit on any error

# Force Vercel to use pip instead of uv
export PIP_USE_VENDOR_PACKAGING=1
export UV_TOOL_PYTHON=python3
export PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring

echo "Starting Vercel build process..."

# Install dependencies using pip instead of uv
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt --no-cache-dir

# If the above fails, try installing packages individually
if [ $? -ne 0 ]; then
    echo "Standard pip install failed, installing packages individually..."
    while read requirement; do
        if [[ ! -z "$requirement" && ! "$requirement" =~ ^# ]]; then
            echo "Installing $requirement..."
            pip install "$requirement" --no-cache-dir || echo "Failed to install $requirement, continuing..."
        fi
    done < requirements.txt
fi

# Verify installation
pip list

echo "Build process completed successfully!"
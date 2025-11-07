#!/bin/bash
TOKEN=$(head -c 16 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 12)
HASH=$(php -r "echo password_hash('$TOKEN', PASSWORD_DEFAULT);")
FILE="data/invite_token.txt"

mkdir -p "$(dirname "$FILE")"
echo "$HASH" > "$FILE"
chmod 600 "$FILE"

echo "New access token: $TOKEN"

#!/bin/bash
set -e

# Move Files into /var/www/html/
cp -r /src /var/www/html

# Run Setup
composer install --no-dev --optimize-autoloader
npm install
npm run prod

# Check if data directory is empty
if [ -z "$(ls -A /var/www/html/data)" ]; then
    echo "creating data directory..."
    mkdir -p /var/www/html/data
    chown -R www-data:www-data $APP_DIR
    chmod -R 775 $APP_DIR
fi

if [ -z "$(ls -A /var/www/html/.env)" ]; then
    echo "creating .env file..."
    touch .env
    echo "BREVO_API_KEY=" > .env
if 

echo "Docker entrypoint script finished"

# Pass control to Apache
exec apache2-foreground

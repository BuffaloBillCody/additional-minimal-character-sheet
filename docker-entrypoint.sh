#!/bin/bash
set -e

# Move Files into /var/www/html/
cp -r /src/. /var/www/html

# Run Setup
composer install --no-dev --optimize-autoloader
npm install
npm run prod


# Check if data directory is empty
if [ -z "$(ls -A /var/www/html/data)" ]; then
    echo "creating data directory..."
    mkdir -p /var/www/html/data
    chown -R www-data:www-data /var/www/html/data
    chmod -R 775 /var/www/html/data
    php /var/www/html/migrations/001.php
    php /var/www/html/migrations/002.php
fi

chown -R www-data:www-data /var/www/html/data
chmod -R 775 /var/www/html/data

if [ -z "$(ls -A /var/www/html/.env)" ]; then
    echo "creating .env file..."
    cd /var/www/html
    touch .env
    echo "BREVO_API_KEY=" > .env
fi

echo "Docker entrypoint script finished"

# Pass control to Apache
exec apache2-foreground
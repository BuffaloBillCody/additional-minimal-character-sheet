#!/bin/bash
set -e

# Path inside container where app lives
APP_DIR="/var/www/html/data"
cd $APP_DIR

# Check if APP_DIR is empty (e.g., first container run)
if [ -z "$(ls -A $APP_DIR)" ]; then
    mkdir -p /var/www/html/data
    echo "creating .env file..."
    touch .env
    echo "BREVO_API_KEY=" > .env
    echo "Setting Up Database..."
    php /var/www/html/migrations/001.php
    php /var/www/html/migrations/002.php
fi

echo "Docker entrypoint script finished"

# Pass control to Apache
exec apache2-foreground

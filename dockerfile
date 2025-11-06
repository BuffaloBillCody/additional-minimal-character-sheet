FROM php:8.4-apache
RUN a2enmod rewrite
COPY . /var/www/html
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y unzip npm \
    && git config --global --add safe.directory /var/www/html \
    && composer install --no-dev --optimize-autoloader \
    && rm -rf /var/lib/apt/lists/* \
    && npm install \
    && npm run prod \
    && mkdir data \
    && php migrations/001.php \
    && php migrations/002.php \
    && chown -R www-data:www-data /var/www/html/data \
    && chmod -R 775 /var/www/html/data

ENV BREVO_API_KEY="REPLACE ME"

EXPOSE 80/tcp



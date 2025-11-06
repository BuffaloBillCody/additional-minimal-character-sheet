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

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV BREVO_API_KEY="REPLACE ME"

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 80/tcp

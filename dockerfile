FROM php:8.4-apache
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

RUN a2enmod rewrite

COPY . /src

RUN apt-get update && apt-get install -y unzip npm cron\
    && rm -rf /var/lib/apt/lists/* \
    && git config --global --add safe.directory /var/www/html

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY token-gen.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/token-gen.sh

ENV BREVO_API_KEY="REPLACE ME"

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 80/tcp

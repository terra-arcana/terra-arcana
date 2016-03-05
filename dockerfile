FROM wordpress
MAINTAINER Francois Drouin-Morin

EXPOSE 80
EXPOSE 443

ENV WP_URL=""
ENV WP_TITLE="Test"
ENV WP_ADMIN_USER="admin"
ENV WP_ADMIN_PASSWORD="admin"
ENV WP_ADMIN_EMAIL="test@test.test"
ENV DB_NAME="wordpress"
ENV DB_USER="admin"
ENV DB_PASSWORD="admin"
ENV DB_HOST="localhost"

#Some boilerplate
USER root
RUN apt-get update
RUN apt-get install wget sudo git mysql-client -y
RUN mkdir -p /usr/src/wordpress/wp-content/themes/terra-arcana
WORKDIR /usr/src/wordpress/wp-content/themes/terra-arcana

#Install WP-CLI
RUN apt-get install wget
RUN wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar;chmod +x wp-cli.phar;mv wp-cli.phar /usr/local/bin/wp

#Install npm
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -;apt-get install nodejs -y

#Install global NodeJS packages
RUN npm install -g webpack esdoc

#Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#Add Terra theme
COPY . /usr/src/wordpress/wp-content/themes/terra-arcana

#Build Terra theme
RUN npm install
RUN composer install
RUN webpack

#Finalize
CMD sudo -u www-data bash /usr/src/wordpress/wp-content/themes/terra-arcana/entrypoint.sh

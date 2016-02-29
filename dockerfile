FROM wordpress
MAINTAINER Francois Drouin-Morin

ENV WP_URL=""
ENV WP_TITLE="Test"
ENV WP_ADMIN_USER="admin"
ENV WP_ADMIN_PASSWORD="admin"
ENV WP_ADMIN_EMAIL="test@test.test"

#Some boilerplate
RUN apt-get update
RUN apt-get install wget -y
WORKDIR /usr/src/wordpress

#Install WP-CLI
RUN apt-get install wget
RUN wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar;chmod +x wp-cli.phar;mv wp-cli.phar /usr/local/bin/wp

#Install npm
RUN apt-get install nodejs npm -y

#Install global NodeJS packages
RUN npm install -g webpack esdoc

#Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#Initialize wordpress
USER www-data
RUN wp core install --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL
USER root

#Add Terra theme
RUN mkdir /usr/src/wordpress/wp-content/themes/terra-arcana
COPY . /usr/src/wordpress/wp-content/themes/terra-arcana

#Build Terra theme
RUN npm install
RUN composer install
RUN webpack

#Activate Terra theme
USER www-data
RUN wp theme activate terra-arcana
USER root

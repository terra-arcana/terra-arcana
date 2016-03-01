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
RUN apt-get update
RUN apt-get install wget sudo git mysql-client -y
WORKDIR /var/www/html

#Install WP-CLI
RUN apt-get install wget
RUN wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar;chmod +x wp-cli.phar;mv wp-cli.phar /usr/local/bin/wp

#Install npm
RUN apt-get install nodejs-legacy npm -y

#Install global NodeJS packages
RUN npm install -g webpack esdoc

#Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#Add Terra theme
RUN mkdir /var/www/html/wp-content/themes/terra-arcana
COPY . /var/www/html/wp-content/themes/terra-arcana

#Build Terra theme
WORKDIR wp-content/themes/terra-arcana
RUN npm install
RUN composer install
RUN webpack

#Finalize
CMD sudo -u www-data bash /entrypoint.sh

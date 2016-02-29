FROM wordpress
MAINTAINER Francois Drouin-Morin

ENV WP_URL=""
ENV WP_TITLE="Test"
ENV WP_ADMIN_USER="admin"
ENV WP_ADMIN_PASSWORD="admin"
ENV WP_ADMIN_EMAIL="test@test.test"

#Some boilerplate
RUN mkdir /var/stuff
RUN cd /var/stuff

#Install WP-CLI
RUN wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x wp-cli.phar
RUN mv wp-cli.phar /usr/local/bin/wp

#Install npm
RUN apt-get install nodejs npm -y

#Install global NodeJS packages
RUN npm install -g webpack esdoc

#Install Composer
RUN curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

#Initialize wordpress
RUN wp core install --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL

#Add Terra theme
RUN mkdir /var/www/html/wp-content/themes/terra-arcana
COPY . /var/www/html/wp-content/themes/terra-arcana

#Build Terra theme
RUN npm install
RUN composer install
RUN webpack

#Activate Terra theme
RUN wp theme activate terra-arcana

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
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x wp-cli.phar
RUN mv wp-cli.phar /usr/local/bin/wp

#Initialize wordpress
RUN wp core install --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL

#Add Terra theme
RUN mkdir /var/www/html/wp-content/themes/terra
copy . /var/www/html/wp-content/themes/terra

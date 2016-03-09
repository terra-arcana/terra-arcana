#!/bin/bash
cd /var/www/html

echo "Downloading Wordpress"
sudo -u www-data wp core download

echo "Creating wp-config.php"
sudo -u www-data wp core config --dbname=$WORDPRESS_DB_NAME --dbuser=$WORDPRESS_DB_USER --dbpass=$WORDPRESS_DB_PASSWORD --dbhost=$WORDPRESS_DB_HOST

echo "Creating tables"
sudo -u www-data wp core install --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL

echo "Copying theme to /var/www/html/wp-content/themes/wp-content folder"
sudo -u www-data cp -r /usr/src/wordpress/wp-content/themes/terra-arcana /var/www/html/wp-content/themes/terra-arcana

echo "Installing Terra theme"
sudo -u www-data wp theme activate terra-arcana

exec "$@"

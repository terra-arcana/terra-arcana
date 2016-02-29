#TODO Add condition check for already initialized wordpress
#TODO Add configuration arguments for "wp core config"
wp core config --path=/usr/src/wordpress --dbname=$DB_NAME --dbuser=$DB_USER --dbpass=$DB_PASSWORD --dbhost=$DB_HOST
wp core install --path=/usr/src/wordpress --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL
wp theme activate --path=/usr/src/wordpress terra-arcana

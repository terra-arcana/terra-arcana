#!/bin/bash
cd /var/www/html

if [[ "$1" == apache2* ]] || [ "$1" == php-fpm ]; then
	if [ -n "$MYSQL_PORT_3306_TCP" ]; then
		if [ -z "$WORDPRESS_DB_HOST" ]; then
			WORDPRESS_DB_HOST='mysql'
		else
			echo >&2 'warning: both WORDPRESS_DB_HOST and MYSQL_PORT_3306_TCP found'
			echo >&2 "  Connecting to WORDPRESS_DB_HOST ($WORDPRESS_DB_HOST)"
			echo >&2 '  instead of the linked mysql container'
		fi
	fi

	if [ -z "$WORDPRESS_DB_HOST" ]; then
		echo >&2 'error: missing WORDPRESS_DB_HOST and MYSQL_PORT_3306_TCP environment variables'
		echo >&2 '  Did you forget to --link some_mysql_container:mysql or set an external db'
		echo >&2 '  with -e WORDPRESS_DB_HOST=hostname:port?'
		exit 1
	fi

	# if we're linked to MySQL and thus have credentials already, let's use them
	: ${WORDPRESS_DB_USER:=${MYSQL_ENV_MYSQL_USER:-root}}
	if [ "$WORDPRESS_DB_USER" = 'root' ]; then
		: ${WORDPRESS_DB_PASSWORD:=$MYSQL_ENV_MYSQL_ROOT_PASSWORD}
	fi
	: ${WORDPRESS_DB_PASSWORD:=$MYSQL_ENV_MYSQL_PASSWORD}
	: ${WORDPRESS_DB_NAME:=${MYSQL_ENV_MYSQL_DATABASE:-wordpress}}

	if [ -z "$WORDPRESS_DB_PASSWORD" ]; then
		echo >&2 'error: missing required WORDPRESS_DB_PASSWORD environment variable'
		echo >&2 '  Did you forget to -e WORDPRESS_DB_PASSWORD=... ?'
		echo >&2
		echo >&2 '  (Also of interest might be WORDPRESS_DB_USER and WORDPRESS_DB_NAME.)'
		exit 1
	fi

	if ! [ -e index.php -a -e wp-includes/version.php ]; then
		echo >&2 "WordPress not found in $(pwd) - copying now..."
		sudo -u www-data wp core download
		if [ ! -e .htaccess ]; then
			# NOTE: The "Indexes" option is disabled in the php:apache base image
			cat > .htaccess <<-'EOF'
				# BEGIN WordPress
				<IfModule mod_rewrite.c>
				RewriteEngine On
				RewriteBase /
				RewriteRule ^index\.php$ - [L]
				RewriteCond %{REQUEST_FILENAME} !-f
				RewriteCond %{REQUEST_FILENAME} !-d
				RewriteRule . /index.php [L]
				</IfModule>
				# END WordPress
			EOF
			chown www-data:www-data .htaccess
		fi
	fi
fi

sleep 20
if [ ! -e wp-config.php ]; then
	echo "Creating wp-config.php"
	sudo -u www-data wp core config --dbname=$WORDPRESS_DB_NAME --dbuser=$WORDPRESS_DB_USER --dbpass=$WORDPRESS_DB_PASSWORD --dbhost=$WORDPRESS_DB_HOST
fi

if ! $(wp core is-installed); then
	echo "Creating database"
	sudo -u www-data wp db create

	echo "Creating tables"
	sudo -u www-data wp core install --url=$WP_URL --title=$WP_TITLE --admin_user=$WP_ADMIN_USER --admin_password=$WP_ADMIN_PASSWORD --admin_email=$WP_ADMIN_EMAIL
fi

if [ ! -d /var/html/www/wp-content/themes/terra-arcana]; then
	echo "Copying theme to /var/www/html/wp-content/themes/terra-arcana folder"
	sudo -u www-data cp -r /usr/src/wordpress/wp-content/themes/terra-arcana /var/www/html/wp-content/themes/terra-arcana

	echo "Installing Terra theme"
	sudo -u www-data wp theme activate terra-arcana
fi

# TODO find how to check if installed
sudo -u www-data wp plugin install rest-api --force --activate
#sudo -u www-data wp plugin install OAuth1-master
sudo -u www-data wp plugin install $ACFP_URL --force --activate

#sudo -u www-data wp plugin activate rest-api
#sudo -u www-data wp plugin activate OAuth1-master
#sudo -u www-data wp plugin activate 'Advanced Custom Fields Pro'

exec "$@"

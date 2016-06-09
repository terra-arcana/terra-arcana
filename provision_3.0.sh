#Start docker containers
docker run --name mysql -e MYSQL_ROOT_PASSWORD=terradev --restart=always -p 3306:3306 -d mysql
docker run --name wordpress --link mysql:mysql --restart=always -e WORDPRESS_DB_PASSWORD=terradev -p 8080:80 -v /var/wordpress:/var/www/html -d wordpress

#Do a symlink between the development folder and the docker volume
mkdir -p /var/wordpress/wp-content/themes/terra-arcana
ln -s /home/vagrant/code/* /var/wordpress/wp-content/themes/terra-arcana

#Install npm
apt-get update
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -;apt-get install nodejs -y

#Install webpack and esdoc globally
npm install -g webpack esdoc

#Install Composer
apt-get install php5 -y
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

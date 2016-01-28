#Initial setup
export DEBIAN_FRONTEND=noninteractive

sudo aptitude update -q

#TODO Add logic to check for environment variable existance
PASSWORD='12345678'
PROJECTFOLDER='myproject'

#MySQL install
sudo echo "mysql-server mysql-server/root_password password $PASSWORD" | debconf-set-selections
sudo echo "mysql-server mysql-server/root_password_again password $PASSWORD" | debconf-set-selections

sudo aptitude install -q -y -f mysql-server mysql-client

#PHP install
sudo aptitude install -q -y -f php5-fpm
sudo aptitide install -q -y -f php5-mysql php5-curl php5-gd php5-intl php-pear php5-imagick php5-imap php5-mcrypt php5-memcached php5-ming php5-ps php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl php5-xcache php5-common libapache2-mod-php5 php5-cli

#Apache Install
sudo aptitude install -q -y -f apache2 apache2-doc

#PHPMyAdmin Install
sudo debconf-set-selections <<< "phpmyadmin phpmyadmin/dbconfig-install boolean true"
sudo debconf-set-selections <<< "phpmyadmin phpmyadmin/app-password-confirm password $PASSWORD"
sudo debconf-set-selections <<< "phpmyadmin phpmyadmin/mysql/admin-pass password $PASSWORD"
sudo debconf-set-selections <<< "phpmyadmin phpmyadmin/mysql/app-pass password $PASSWORD"
sudo debconf-set-selections <<< "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2"
sudo apt-get -y install phpmyadmin

#Project folder creation
#sudo mkdir "/var/www/html/${PROJECTFOLDER}"
sudo ln -s /vagrant "/var/www/html/${PROJECTFOLDER}"

VHOST=$(cat <<EOF
<VirtualHost *:80>
    DocumentRoot "/var/www/html/${PROJECTFOLDER}"
    <Directory "/var/www/html/${PROJECTFOLDER}">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF
)
echo "${VHOST}" > /etc/apache2/sites-available/000-default.conf

# enable mod_rewrite
sudo a2enmod rewrite

# restart apache
service apache2 restart

# install git
sudo apt-get -q -y -f install git

# install Composer
curl -s https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# install nodejs and npm
sudo apt-get -q -y -f install nodejs
sudo apt-get -q -y -f install npm

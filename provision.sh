#Initial setup
apt-get update
apt-get -y install git-all debconf-utils

#Apache setup
apt-get -y install apache2

#MYSQL setup
#
#Setup for script handling of password prompt
#Default password for dev workstation password: TerraArcana
debconf-set-selections <<< 'mysql-server mysql-server/root_password password TerraArcana'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password TerraArcana'
apt-get -y install mysql-server

#PHP setup
apt-get -y install php5-gd libssh2-php php5-cli php5-mysql

CREATE USER 'userapi'@'%' IDENTIFIED BY 'userapi';
ALTER USER 'userapi'@'%' IDENTIFIED WITH mysql_native_password BY 'userapi';
CREATE DATABASE user_data CHARACTER SET utf8 COLLATE utf8_unicode_ci;
GRANT ALL PRIVILEGES ON user_data.* TO 'userapi'@'%';

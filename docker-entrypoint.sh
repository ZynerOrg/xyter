#!/usr/bin/env sh

echo "Check DB!"
while ! mysqladmin ping -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD}; do
    echo "Wait ..."
    sleep 1
done
echo "DB ready!"

${@}

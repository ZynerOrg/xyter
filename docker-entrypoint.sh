#!/usr/bin/env sh

check_db_connection() {
    mysqladmin ping -h "${DB_HOST}" -u "${DB_USER}" -p"${DB_PASSWORD}" 2>/dev/null
}

wait_for_db() {
    echo "Checking database connection..."
    until check_db_connection; do
        echo "Waiting for the database..."
        sleep 1
    done
    echo "Database is ready!"
}

# Parse the DATABASE_URL into individual variables
DB_URL="${DATABASE_URL#*://}"
DB_USER="${DB_URL%%:*}"
DB_URL="${DB_URL#*:}"
DB_PASSWORD="${DB_URL%%@*}"
DB_HOST="${DB_URL#*@}"
DB_HOST="${DB_HOST%%/*}"
DB_NAME="${DB_URL#*/}"

wait_for_db
"$@"

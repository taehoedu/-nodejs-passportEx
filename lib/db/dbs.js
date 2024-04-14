const mysql = require('mysql');

const DBs = {
    DB_DEV: () => {
        return mysql.createConnection({
            host: '14.42.124.125',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_PASSPORT',
            dateStrings: true,
        });
    },
    DB_LOCAL: () => {
        return mysql.createConnection({
            host: '192.168.56.101',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_PASSPORT',
            dateStrings: true,
        });
    },
    DB_PROD: () => {
        return mysql.createConnection({
            host: '14.42.124.125',
            port: '3306',
            user: 'root',
            password: '1234',
            database: 'DB_PASSPORT',
            dateStrings: true,
        });
    },
}

module.exports = DBs;
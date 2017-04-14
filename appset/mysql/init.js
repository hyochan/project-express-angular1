/**
 * Created by hyochan on 12/11/15.
 * https://github.com/mscdex/node-mariasql
 */

var mysql = require('mysql');

var pool = mysql.createConnection({
    host : '127.0.0.1',
    // socketPath : '/opt/local/var/run/mysql56/mysqld.sock',
    user : 'root',
    port : '3306',
    password : 'your_password',
    database : 'hyochan',
    multipleStatements : true
});

pool.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};

module.exports = pool;

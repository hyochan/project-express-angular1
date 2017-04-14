/**
 * Created by hyochan on 12/12/15.
 */

// 모듈 추출
var mysql = require('./appset/mysql/init');

const
    user_table = "users",
    board_table = "boards",
    chat_table = "chats";

mysql.connect();

mysql.query('DROP TABLE IF EXISTS ' + user_table);
mysql.query('DROP TABLE IF EXISTS ' + board_table);
mysql.query('DROP TABLE IF EXISTS ' + chat_table);

mysql.query('CREATE TABLE ' + user_table+ '(' +
        'email VARCHAR(255) NOT NULL, ' +
        'pw VARCHAR(255) NOT NULL, ' +
        'name VARCHAR(255), ' + // 한글 1자당 utf8일 떄는 3바이트씩
        'photo VARCHAR(255), ' +
        'signup_from VARCHAR(255), ' + // 어떤 앱을 통해 가입했는지 확인
        'created datetime, ' +
        'updated datetime, ' +
        'primary key(email)' +
    ')'
);

mysql.query('CREATE TABLE ' + board_table + ' (' +
        'number integer NOT NULL AUTO_INCREMENT, ' +
        'email VARCHAR(255) NOT NULL, ' +
        'title VARCHAR(255), ' +
        'content text, ' +
        'upload boolean, ' +
        'created datetime, ' +
        'updated datetime, ' +
        'cnt int, ' +
        'primary key(number)' +
    ')'
);

mysql.query('CREATE TABLE ' + chat_table + ' (' +
        'number integer NOT NULL AUTO_INCREMENT, ' +
        'email VARCHAR(255) NOT NULL, ' +
        'msg text, ' +
        'created datetime, ' +
        'primary key(number)' +
    ')'
);

mysql.end();

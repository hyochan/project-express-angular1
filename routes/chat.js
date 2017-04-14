/**
 * Created by hyochan on 2016. 4. 13..
 */
var express = require('express');
var router = express.Router();

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');
var connection = require('../appset/mysql/init');
var ioChatParam = require('../appset/global/ioChatParam');

var Promise = require('bluebird'); // function에서 리턴받고 response를 보내려면 promise가 필요함.

/* GET chat page. */
router.get('/', function(req, res, next) {
    res.render('partials/chat', {

    });
});

/* APIs */
router
    .get('/get_chats', function(req, res){
        var result = {};
        var sql = "select c.number,c.email,u.photo,c.created as date,u.name,c.msg " +
            "from chats as c join users as u where c.email = u.email order by date";
        connection.query(sql, function (err, rows) {
            if(err){
                console.log(err);
                result.resCode = resCode.FAILED;
                result.err = err;
            } else {
                result.resCode = resCode.SUCCESS;
                result.chats = rows;
            }
            header.sendJSON(result, res);
        });
    })
    .get('/online_users', function(req, res){
        var result = {};
        var users = ioChatParam.getUsers();
        Promise.all(users)  // 구지 프로미스 안써도 됨. 바로 함수 리턴 받아도 이상 없음.
            .then(function () {
                result.users = users;
                result.resCode = resCode.SUCCESS;
                console.log("users - " + JSON.stringify(result.users));
                header.sendJSON(result, res);
            })
            .error(function (err) {
                result.resCode = resCode.FAILED;
                result.err = err;
                console.log("users - " + JSON.stringify(result.users));
                header.sendJSON(result, res);
            });
    });

module.exports = router;

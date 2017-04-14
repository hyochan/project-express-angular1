/**
 * Created by hyochan on 12/18/15.
 */
var express = require('express');
var router = express.Router();
var connection = require('../appset/mysql/init');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('partials/member', {

        });
    });

/* APIs */
router
    .get('/all', function(req, res){
        console.log("get members");
        var result = {};
        var sql = "select email, name, photo from users;";
        connection.query(sql, function(err, rows){
            if(err) throw err;
            else{
                result.users = [];
                for (var i in rows){
                    result.users.push({
                        _id : i,
                        email : rows[i].email,
                        name : rows[i].name,
                        photo : rows[i].photo
                    });
                }
                result.resCode = resCode.SUCCESS;
                header.sendJSON(result, res);
            }
        });

    });

module.exports = router;

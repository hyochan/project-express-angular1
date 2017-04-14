/**
 * Created by hyochan on 12/19/15.
 */
var express = require('express');
var router = express.Router();
var connection = require('../appset/mysql/init');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');
var sha256 = require('sha256');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        if(req.session.user){
            res.render('partials/home', {});
        }else{
            res.render('partials/login', {});
        }

    });

/* APIs */
// 사용자 로그인
router
    .post('/', function(req, res){
        var user = {
            email:req.body.email, pw: req.body.pw, auto : req.body.auto, autoLogin : req.body.autoLogin
        };
        if(!user.auto) user.pw = sha256(user.pw);
        var result ={};

        if(!user.email || !user.pw){
            console.log("no req param");
            result.resCode = resCode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        }else{
/*
            // 암호화
            var cipher = crypto.createCipher('aes192', nodeConst.key);
            cipher.update(user.pw, 'utf8', 'base64');
            var cipheredOutput = cipher.final('base64');
            //암호화 해제
            var decipher = crypto.createDecipher('aes192', nodeConst.key);
            decipher.update(cipheredOutput, 'base64', 'utf8');
            var decipheredOutput = decipher.final('utf8');
*/
            var sql = "select email, pw from users where email = :email and pw = :pw";
            // 자동로그인으로 로그인 되는거면 user.pw바로 보내고 아니면 encrpyted된 것 보냄.
            connection.query(
                connection.queryFormat(sql, user), function (err, rows) {
                if (err) { throw err; }
                else {
                    if(rows.length == 0){
                        result.resCode = resCode.NO_DATA;
                        header.sendJSON(result, res);
                    }else{
                        result.resCode = resCode.SUCCESS;
                        if (req.session.user) {
                            console.log("ALREADY HAVE SESSION : " + req.session.user.email);
                        } else {
                            console.log("NOT LOGGED IN");
                        }
                        req.session.regenerate(function () {
                            req.session.user = user;
                            req.session.success = 'Authenticated as ' + user.email;
                            console.log("RECREATE SESSION : " + req.session.user.email);
                            // 만약 autoLogin이 체크 상태이면 pw쿠키 내려줌.
                            if(user.autoLogin){
                                console.log("send cookie");
                                result.email = user.email;
                                result.cookie = sha256(user.pw);
                            }
                            header.sendJSON(result, res);
                        });
                        // 로그인 시간 업데이트
                        var sql = "update users set updated = now() where email = :email";
                        var email = {
                            email : user.email
                        };
                        connection.query(
                            connection.queryFormat(sql, email), function (err) {
                            if(err) { console.log(err);}
                            else { console.log("user login date updated");}
                        });
                    }
                }
            });
        }
    })
    // 사용자 로그아웃
    .get('/logout', function(req, res){
        var result ={};
        req.session.destroy(function(err){
            if(err){
                result.resCode = resCode.FAILED;
                result.errMsg = err.message;
            }
            else{
                console.log("logout success");
                result.resCode = resCode.SUCCESS;
            }
            header.sendJSON(result, res);
        });
    })
    // 사용자 로그인 여부 확인
    .get('/isLogged', function(req, res){
        var result = {};
        if(req.session.user == undefined){
            result.resCode = resCode.FAILED;
            result.errMsg = "로그인되지 않았습니다. 로그인 해주세요.";
        }else{
            result.resCode = resCode.SUCCESS;
            result.email = req.session.user.email;
        }
        header.sendJSON(result, res);
    });
module.exports = router;

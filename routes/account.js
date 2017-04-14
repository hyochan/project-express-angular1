/**
 * Created by hyochan on 12/19/15.
 */
var express = require('express');
var router = express.Router();
var connection = require('../appset/mysql/init');
var fs = require('fs');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');
var crypto = require('crypto');

var multer  = require('multer');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('partials/account', {

        });
    });

/* APIs */
router
    // 본인(로그인 된) 프로필 불러오기 (profile, profile_update, pw_update)
    .get('/profile', function(req, res){
        var result = {};
        if(req.session.user){
            var email = req.session.user.email;
            var sql = "select * from users where email = :email";
            var option = {email : email};
            connection.query(connection.queryFormat(sql, option), function (err, rows) {
                if(err) throw err;
                else{
                    var user = {
                        email : rows[0].email,
                        pw : rows[0].pw,
                        name : rows[0].name,
                        photo : rows[0].photo
                    };
                    result.resCode = resCode.SUCCESS;
                    result.user = user;
                    console.log("user : " + JSON.stringify(user));
                    header.sendJSON(result, res);
                }
            });
        }else{
            result.resCode = resCode.FAILED;
            result.errMsg = "user is not logged in";
            header.sendJSON(result, res);
        }
    })
    // 프로필 수정하기
    // 참고 : multer를 넣지 않으면 formData가 node 서버에 안올라간다.
    .post('/profile_update', multer({dest: './public/upload/profile'}).single('inputPhoto'), function(req, res){
        var result = {};

        if(!req.session.user){
            console.log("not logged in");
            result.resCode = resCode.FAILED;
            result.errMsg = "not logged in";
            console.log(result.errMsg);
            header.sendJSON(result, res);
        }
        else if(!req.body.inputName){
            console.log("no inputName");
            result.resCode = resCode.NO_REQ_PARAM;
            result.errMsg = "no req params - name";
            console.log(result.errMsg);
            header.sendJSON(result, res);
        }
        else{
            var photo;
            var user = {
                email : req.session.user.email,
                name : req.body.inputName
            };
            var mysql;
            var option;
            if(req.file){
                var user_img = user.email + ".png";
                console.log("there is a file");
                // img string should not have a white space
                user_img = user_img.replace(/ /g,'');
                user.photo = "./upload/profile/" + user_img;
                mysql = "update users set name=:name, photo =:photo where email=:email";
                option = {
                    name : user.name,
                    photo : user.photo,
                    email : req.session.user.email
                };
            }else{
                console.log("file not exists");
                mysql = "update users set name=:name where email=:email";
                option = {
                    name : user.name,
                    email : req.session.user.email
                };
            }

            connection.query(connection.queryFormat(mysql, option), function (err){
                if(err) throw err;
                else{
                    result.resCode = resCode.SUCCESS;
                    result.user = user;
                    result.fileChanged = false;
                    if(req.file){
                        result.fileChanged = true;
                        var imgPath = req.file.destination + "/" + req.file.filename;
                        console.log("imgPath : " + imgPath);
                        fs.readFile(imgPath, function (err, data) {
                            if(!req.file.filename){
                                console.log("There was an error in image file");
                                if(fs.existsSync(imgPath)) {fs.unlink(imgPath);}
                            } else {
                                var user_img = user.email + ".png";
                                user_img = user_img.replace(/ /g,'');
                                console.log("user_img : " + user_img);
                                var newPath = req.file.destination + "/" + user_img;
                                fs.writeFile(newPath, data, function (err) {
                                    if(err) throw err;
                                    else{ fs.unlink(imgPath);}
                                });
                            }
                        });
                    }
                    header.sendJSON(result, res);
                }
            });
        }
    })
    // 암호 수정하기
    .post('/pw_update', function(req, res){
        var result = {};
        var pw = {
            prev : req.body.prev,
            pw : req.body.pw
        };

        if(!pw.prev || !pw.pw){
            result.resCode = resCode.NO_REQ_PARAM;
            console.log("no req param");
            header.sendJSON(result, res);
        }else{
            if(req.session.user) {

                console.log("prev_pw : " + pw.prev);
                console.log("pw : " + pw.pw);

                var cipher = crypto.createCipher('aes192', nodeConst.key);
                cipher.update(pw.prev, 'utf8', 'base64')
                pw.prev = cipher.final('base64');
                cipher = crypto.createCipher('aes192', nodeConst.key)
                cipher.update(pw.pw, 'utf8', 'base64')
                pw.pw = cipher.final('base64');

                console.log("prev_pw : " + pw.prev);
                console.log("pw : " + pw.pw);

                var sql = "select count(*) as userCnt FROM users WHERE email = :email and pw = :pw";
                var option = {email : req.session.user.email, pw : pw.prev};
                connection.query(connection.queryFormat(sql, option), function(err, rows){
                    if(err) throw err;
                    else if(rows[0].userCnt != 0){
                        sql = "update users set pw = :pw where email = :email";
                        option = {pw : pw.pw, email : req.session.user.email};
                        connection.query(connection.queryFormat(sql, option), function(err){
                            if (err) throw err;
                            else{
                                result.resCode = resCode.SUCCESS;
                                header.sendJSON(result, res);
                            }
                        });
                    }
                    else{
                        result.errMsg = "password not match";
                        console.log(result.errMsg);
                        result.resCode = resCode.NO_DATA;
                        header.sendJSON(result, res);
                    }
                });
            }else{
                result.errMsg = "user is not logged in";
                console.log(result.errMsg);
                result.resultCode = resCode.FAILED;
                header.sendJSON(result, res);
            }
        }
    });

module.exports = router;

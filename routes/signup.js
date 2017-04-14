/**
 * Created by hyochan on 12/19/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var connection = require('../appset/mysql/init');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');
var sha256 = require('sha256');

// needs file upload
var multer  = require('multer');

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('partials/signup', {

        });
    });

/* APIs */
function saveUser(user, result,req, res){
    // used in "signup"
    // call the built-in save method to save to the database

    var sql = "insert into users " +
        "(email, pw, name, photo, signup_from, created, updated) " +
        "VALUES (:email,:pw,:name,:photo,'hyochan',now(),now())";

/*
    // 암호화
    var cipher = crypto.createCipher('aes192', nodeConst.key);
    cipher.update(user.pw, 'utf8', 'base64');
    var cipheredOutput = cipher.final('base64');
*/

    connection.query(
        connection.queryFormat(sql, user), function (err) {
            if (err) { throw err; }
            else {
                result.resCode = resCode.SUCCESS;
                result.email = user.email;
                console.log("user : " + user);
                header.sendJSON(result, res);
            }
    });
}

router
    .post('/', multer({dest: './public/upload/profile'}).single('inputPhoto'), function(req, res){
        var result ={};

        // user : email, pw, name
        if(!req.body.inputEmail || !req.body.inputPw || !req.body.inputName) {
            console.log("NO_REQ_PARAM");
            if(!req.body.inputEmail){
                console.log("NO EMAIL");
            }
            if(!req.body.inputPw){
                console.log("NO PW");
            }
            if(!req.body.inputName){
                console.log("NO NAME");
            }
            result.resCode = resCode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        } else{
            var user = {
                email : req.body.inputEmail,
                pw : sha256(req.body.inputPw),
                name : req.body.inputName,
                photo : nodeConst.emptyUsrImg
            };

            var sql = 'select count(*) as userCnt FROM users WHERE email = :email';
            var option = {
                email : user.email
            };
            connection.query(connection.queryFormat(sql, option), function(err, rows) {
                if (err) throw err;
                else if (rows[0].userCnt != 0) {
                    // 업로드 된 파일 지우기
                    if(req.file) {
                        var imgPath = req.file.destination + "/" + req.file.filename;
                        if (fs.existsSync(imgPath)) {
                            fs.unlink(imgPath);
                        }
                    }
                    result.resCode = resCode.ALREADY_INSERTED;
                    header.sendJSON(result, res);
                } else{
                    // 이미지 업로드
                    if(req.file){
                        console.log("file exists");
                        var imgPath = req.file.destination + "/" + req.file.filename;
                        console.log("imgPath : " + imgPath);
                        fs.readFile(imgPath, function (err, data) {
                            var imgName = req.file.filename;
                            /// If there's an error
                            if(!imgName){
                                console.log("There was an error in image file");
                                // failed : delete file if dummy exist
                                if(fs.existsSync(imgPath)) {
                                    fs.unlink(imgPath);
                                }
                            } else {
                                var user_img = user.email + ".png";
                                // img string should not have a white space
                                user_img = user_img.replace(/ /g,'');
                                console.log("user_img : " + user_img);
                                var newPath = req.file.destination + "/" + user_img;
                                /// write file to uploads/fullsize folder
                                fs.writeFile(newPath, data, function (err) {
                                    /// let's see it
                                    if(err){ throw err;}
                                    else{
                                        // success : delete dummy file
                                        fs.unlink(imgPath);
                                        // change user img
                                        user.photo = "./upload/profile/" + user_img;
                                        // save user
                                        saveUser(user, result, req, res);
                                    }
                                });
                            }
                        });
                    }else{
                        console.log("file not exists");
                        // save user
                        saveUser(user, result, req, res);
                    }
                }
            });
        }
    });

module.exports = router;

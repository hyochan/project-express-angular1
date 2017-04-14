/**
 * Created by hyochan on 2016. 4. 9..
 */
var express = require('express');
var router = express.Router();
var connection = require('../appset/mysql/init');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');

var shortid = require('shortid');
var sha256 = require('sha256');
var nodemailer = require('nodemailer');


/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('partials/find_pw', {});
    })
    .post('/send_mail', function(req, res, next){

        var password = shortid.generate();
        var user = {
            email : req.body.email,
            pw : sha256(password)
        };
        var result = {};
        var sql = "update users set pw = :pw where email = :email";
        connection.query(
            connection.queryFormat(sql, user), function (err, rows) {
                if(err) {
                    console.log(err);
                    result.resCode = resCode.FAILED;
                    result.msg = "database query err";
                    header.sendJSON(result, res);
                }
                else{
                    console.log("pw : " + user.pw);
                    console.log("password : " + password);
/*
                    var decipher = crypto.createDecipher('aes192', nodeConst.key);
                    decipher.update(user.pw, 'base64', 'utf8');
                    var decipheredOutput = decipher.final('utf8');
*/

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail', auth: { user: 'hyochan.org@gmail.com', pass: 'tkfkdgo87!' }
                    });

                    var mailOptions = {
                        from: '"hyochan.org" <hyochan.org@gmail.com>',
                        to: user.email,
                        subject: '계정 비밀번호 알림',
                        text: 'hyochan.org - 계정 비밀번호 알림',
                        html: 'hyochan.org 계정 비밀번호는 다음과 같습니다.<br>비밀번호 : ' + password
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error){
                            // 메일 발송 오류
                            console.log(error);
                            result.resCode = resCode.FAILED;
                        } else {
                            // 메일 발송 성공
                            console.log("Message sent : " + info.response);
                            result.resCode = resCode.SUCCESS;
                        }
                        transporter.close();
                        header.sendJSON(result, res);
                    });
                }
            }
        );
    });

module.exports = router;

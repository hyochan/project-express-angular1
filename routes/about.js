/**
 * Created by hyochan on 12/18/15.
 */
var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var resCode = require('../appset/global/ResCode');
var header = require('../appset/global/Header');
var nodeConst = require('../appset/global/NodeConst');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('partials/about', {

    });
});

/* APIs */
router.post('/send_mail', function(req, res){

    var result = {};
    var mail = {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        message : req.body.message
    };

    var transporter = nodemailer.createTransport({
        service: 'Gmail', auth: { user: 'hyochan.org@gmail.com', pass: 'tkfkdgo87!' }
    });

    var mail_msg =
        mail.name + "<" + mail.email + ">" + "님의 메일 문의입니다.\n" +
        "전화번호 : " + mail.phone +"\n\n\n" +
        "메시지 : " + mail.message;

    var mailOptions = {
        from: '"hyochan.org" <hyochan.org@gmail.com>',
        to: 'unix.zang@gmail.com',
        subject: 'hyochan.org 메일 문의',
        text: mail_msg
        // html: 'hyochan.org 계정 비밀번호는 다음과 같습니다.<br>비밀번호 : ' + decipheredOutput
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
});

module.exports = router;

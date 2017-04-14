/**
 * Created by hyochan on 12/18/15.
 */
var express = require('express');
var router = express.Router();
var connection = require('../appset/mysql/init');
var fs = require('fs');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var nodeConst = require('../appset/global/NodeConst');

var fs = require('fs');
var multer  = require('multer');

// 폴더 생성하고 파일들 저장
function copyData(dir, savPath, srcPath) {
    fs.readFile(srcPath, 'utf8', function (err, data) {
        if (err) console.log(err);
        else {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            //Do your processing, MD5, send a satellite to the moon, etc.
            fs.writeFile (savPath, data, function(err) {
                if (err) console.log(err);
                else {
                    console.log('complete');
                    fs.unlink(srcPath);
                }
            });
        }
    });
}

// 폴더 안 파일 불러오기
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var path = dir + '/' + files[i]
        var name = files[i];
        if (fs.statSync(path).isDirectory()){
            getFiles(path, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

/* GET home page. */
router
    .get('/', function(req, res, next) {res.render('partials/board', {

    })
});

/* APIs */
router
// 전체 게시판 글 불러오기
    .get('/all', function(req, res, next) {
        var result = {};
        var sql =
            "select * from boards join users where boards.email = users.email";
        connection.query(sql, function(err, rows){
            if(err) {
                result.resCode = resCode.FAILED;
                result.err = err;
                console.log("err : " + err.message);
            }
            else{
                result.resCode = resCode.SUCCESS;
                result.boards = [];
                console.log("cnt : " + rows.length);
                for(var i in rows){
                    var board = {
                        number : rows[i].number,
                        email : rows[i].email,
                        name : rows[i].name,
                        title : rows[i].title,
                        content : rows[i].content,
                        upload : rows[i].upload,
                        created : rows[i].created,
                        updated : rows[i].updated,
                        cnt : rows[i].cnt
                    };
                    result.boards.push(board);
                }
            }
            header.sendJSON(result, res);
        });
    })
    .get('/read_files/:number', function(req, res){
        var result = {};
        var number = req.params.number;
        var dir = "./public/upload/board/" + number;
        if (fs.existsSync(dir)){
            result.resCode = resCode.SUCCESS;
            result.files = getFiles(dir);
        } else{
            result.resCode = resCode.FAILED;
            result.err = "no directory exists";
        }
        header.sendJSON(result, res);
    })
    .get('/delete/:number', function(req, res){
        var result = {};
        var number  = req.params.number;
        var sql = "delete from boards where number = :number";
        var option = {number : number};
        connection.query(connection.queryFormat(sql, option), function(err){
            if(err) {
                console.log(err);
                result.resCode = resCode.FAILED;
                result.err = err;
            }
            else {
                console.log("deleted");
                result.resCode = resCode.SUCCESS;
            }
            header.sendJSON(result, res);
        });
    })
    .post('/write', multer({dest: './public/upload/board'}).array('uploads', 12), function(req, res){
        var result = {};
        if(req.session.user) {
            if(!req.body.inputTitle){
                result.resCode = resCode.NO_REQ_PARAM;
                result.errMsg = "no req params";
                console.log(result.errMsg);
                header.sendJSON(result, res);
            }else{
                var board = {
                    number: null,
                    email: req.session.user.email,
                    title: req.body.inputTitle,
                    content: req.body.inputContent,
                    upload: (req.files ? 1 : 0),
                    cnt : 0
                };
                var sql = "insert into boards  values (NULL, :email, :title, :content, :upload, now(), now(), :cnt)";
                connection.query(connection.queryFormat(sql, board), function(err, results){
                    if(err) console.log(err);
                    else{
                        // 파일 존재여부 확인
                        if(req.files){
                            console.log("req.files : " + JSON.stringify(req.files));
                            console.log("req.files.length : " + req.files.length);
                            for(var i in req.files){
                                var fileVal = {
                                    dir : req.files[i].destination + "/" + results.info.insertId,
                                    savPath : req.files[i].destination + "/" + results.info.insertId + "/" + req.files[i].originalname,
                                    srcPath : req.files[i].path

                                };
                                console.log("file[" + i + "] : " + JSON.stringify(fileVal));
                                copyData(fileVal.dir, fileVal.savPath, fileVal.srcPath);
                            }
                        }else{
                            console.log("file not exists");
                        }
                        results.resCode = resCode.SUCCESS;
                        header.sendJSON(results, res);
                    }
                });

            }
        }else{
            result.resCode = resCode.FAILED;
            result.errMsg = "user is not logged in";
            console.log(result.errMsg);
            header.sendJSON(result, res);
        }
    });
module.exports = router;

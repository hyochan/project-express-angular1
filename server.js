var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var server = express();

if (server.get('env') === 'production') {
    server.use(function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        return next();
    });
}

/*
var mysql = require('./appset/mysql/init');
function keepalive(){
  mysql.query('select 1', [], function(err, result){
    if(err) return console.log(err);
  })
}
setInterval(keepalive, 1000 * 60 * 5);
// => keep alive
*/

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//server.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
server.use(logger('dev'));

server.use(bodyParser.json({limit: '2000mb'})); // 2기가 까지 업로드 가능
server.use(bodyParser.urlencoded({limit: '2000mb', extended: true}));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(session({
  secret: ''+new Date().getTime(),
  cookie: {secure: false},
  resave: true,
  saveUninitialized: true

}));
server.use(express.static(path.join(__dirname, 'public')));
server.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
server.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
server.use('/components-font-awesome', express.static(__dirname + '/node_modules/components-font-awesome/'));
server.use('/angular', express.static(__dirname + '/node_modules/angular/'));
server.use('/angular-animate', express.static(__dirname + '/node_modules/angular-animate/'));
server.use('/angular-ui-bootstrap', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist'));
server.use('/angular-modal-service', express.static(__dirname + '/node_modules/angular-modal-service/dst'));
server.use('/angular-route', express.static(__dirname + '/node_modules/angular-route/'));
server.use('/angular-sanitize', express.static(__dirname + '/node_modules/angular-sanitize/'));
server.use('/angular-scroll', express.static(__dirname + '/node_modules/angular-scroll/'));
server.use('/angular-utils-pagination', express.static(__dirname + '/node_modules/angular-utils-pagination/'));
// below code is to auto import bower install in index.html page

server.use('/', require('./routes/index'));
server.use('/login', require('./routes/login'));
server.use('/signup', require('./routes/signup'));
server.use('/home', require('./routes/home'));
server.use('/chat', require('./routes/chat'));
server.use('/member', require('./routes/member'));
server.use('/board', require('./routes/board'));
server.use('/about', require('./routes/about'));
server.use('/account', require('./routes/account'));
server.use('/setting', require('./routes/setting'));
server.use('/find_pw', require('./routes/find_pw'));

server.get('/', function(req, res){
    res.sendFile(__dirname + './views/index.ejs');
});

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
  server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = server;

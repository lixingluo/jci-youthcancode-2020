// app.js - 启动文件/入口文件
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var users = require('./routes/users');

// 1 - 生成express的实例 - app
var app = express();

// 2 - 前面的views指的是设定视图文件保存目录，后面是路径，
// 即存放模版文件的地址是当前正在执行的脚本所在目录的views文件夹
app.set('views', path.join(__dirname, 'views'));
// 3 - 前面的views engine指的是设定视图模版引擎，后面是名字'ejs'
app.set('view engine', 'ejs');
// 4 - 加载日志中间件
app.use(logger('dev'));
// 5 - 加载解析json的中间件
app.use(bodyParser.json());
// 6 - 加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 7 - 加载解析cookie的中间件
app.use(cookieParser());
// 8 - express.static指的是存放静态文件的目录，后面是路径，
// path.join估计表示'/'的连接
app.use(express.static(path.join(__dirname, 'public')));

// 14 - app.use(flash())要放在app.user(session({}))之前
app.use(flash());

// 15 - 切记设置resave和saveUninitialized
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    // url: 'mongodb://localhost/blog'
    url: 'mongodb+srv://youthcancode:@jcidragon@jci-youthcancode-2020-gelro.mongodb.net/test?retryWrites=true&w=majority'
  }),
  resave: true,
  saveUninitialized: true
}));


// 9 - 路由控制器
// app.use('/', routes);
routes(app);
app.use('/users', users);

// 10 - catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// 11 - development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 12 - production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 13 - 导出app实例供其他模版调用
module.exports = app;
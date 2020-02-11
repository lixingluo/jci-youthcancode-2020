// var express = require('express');
// var router = express.Router();

// // 1 - .get('/')表示访问主页时，render表示渲染，调用了ejs引擎
// // 渲染的对象是index.ejs文件
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

// 1 - crypto是Node.js的一个核心模块
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');
module.exports = function(app) {
  app.get('/', function(req, res) {
    Post.get(null, function(err, posts) {
      if(err) {
        posts = [];
      }
      res.render('index', {
        title: 'Home Page',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', { 
      title: 'Registeration Page',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', { 
      title: 'Login Page',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/post', checkLogin);
  app.get('/post', function(req, res) {
    res.render('post', { 
      title: 'Post Page',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/post', checkLogin);
  app.post('/post', function(req, res) {
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.post);
    post.save(function(err) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', 'Post successfully');
      // 12 - 成功发表后跳转到主页
      res.redirect('/');
    });
  });
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', 'Logout Success');
    res.redirect('/');
  });
  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    // 2 - 检验用户两次输入的密码是否一致
    if(password_re != password) {
      req.flash('error', '两次输入的密码不一致!');
      // 3 - 返回注册页
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    User.get(newUser.name, function(err, user) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if(user) {
        req.flash('error', 'User Already Exist!');
        return res.redirect('/reg');
      }
      newUser.save(function(err, user) {
        if(err) {
          req.flash('error', err);
          // 4 - 注册失败就返回主注册页
          return res.redirect('/reg');
        }
        // 5 - 用户信息存入session ? 
        req.session.user = newUser;
        req.flash('success', 'Register Success');
        // 6 - 注册成功也返回注册主页
        res.redirect('/');
      });
    });
  });
  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function(err, user) {
      if(!user) {
        req.flash('error', 'User Not Exist!');
        return res.redirect('/login');
      }
      // 7 - 检查密码是否一致, 切记md5加密转换
      if(user.password != password) {
        req.flash('error', 'Wrong Password');
        // 8 - 密码错误则跳转到登陆页
        return res.redirect('/login');
      }
      // 9 - 都匹配则存入session
      req.session.user = user;
      req.flash('success', 'Login Success');
      // 10 - 登陆成功则回到首页
      res.redirect('/');
    });
  });
  function checkLogin(req, res, next) {
    if(!req.session.user) {
      req.flash('error', 'Not Logged');
      res.redirect('/login');
    }
    next();
  }
  function checkNotLogin(req, res, next) {
    if(req.session.user) {
      req.flash('error', 'Already Logged');
      res.redirect('back');
    }
    next();
  }
};
// 11 - 为了维护用户状态和flash的通知功能性, 每个ejs模版文件都传入了以下三个值
// user: req.session.user,
// success: req.flash('success').toString(),
// error: req.flash('error').toString()
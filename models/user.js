// var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/';
var url = 'mongodb+srv://youthcancode:@jcidragon@jci-youthcancode-2020-gelro.mongodb.net/test?retryWrites=true&w=majority'

function User(user) {
  this.email = user.email;
  this.password = user.password;
  this.university = user.university;
  this.name = user.name;
  this.phone_number = user.phone_number;
};

module.exports = User;

// 1 - 存储用户信息
User.prototype.save = function(callback) {
  // 2 - 要存入数据库的用户文档
  var user = {
    email: this.email,
    password: this.password,
    university: this.university,
    name: this.name,
    phone_number: this.phone_number
  };
  // 3 - 打开数据库
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if(err) {
      // return callback(err);
      throw err;
    }
    console.log("Save successfully");
    var dbo = db.db('test');
    // 4 - 读取users集合
    dbo.collection('users', function(err, collection) {
      if(err) {
        throw err;
      }
      // 5 - 将用户数据插入users集合
      collection.insert(user, {
        safe: true
      }, function(err, user) {
        db.close();
        if(err) {
          return callback(err);
        }
        // 6 - insert成功!err为null, 并返回存储后的用户文档
        callback(null, user[0]);
      });
    });
  });
};

// 1 - 读取用户信息
User.get = function(email, callback) {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if(err) {
      // 2 - 错误, 返回err信息
      // return callback(err);
      throw err;
    }
    console.log("Get successfully");
    var dbo = db.db('test');
    // 3 - 读取users集合
    // 4 - 查找用户名(name键)值为name的一个文档
    dbo.collection('users').findOne({
      email: email
    }, function(err, user) {
      db.close();
      if(err) {
        throw err;
      }
      // 5 - findOne成功!返回查询的用户信息
      callback(null, user);
    });
  });
};
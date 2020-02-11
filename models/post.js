var MongoClient = require('mongodb').MongoClient;
var markdown = require('markdown').markdown;
// var url = 'mongodb://localhost:27017/';
var url = 'mongodb+srv://youthcancode:@jcidragon@jci-youthcancode-2020-gelro.mongodb.net/test?retryWrites=true&w=majority'

function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback) {
  var date = new Date();
  // 1 - 存储各种时间格式，方便以后扩展
  var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear() + "-" + (date.getMonth() + 1),
    day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  // 2 - 要存入数据库的文档
  var post = {
    name: this.name,
    time: time,
    title: this.title,
    post: this.post
  };
  // 3 - 打开/连接数据库
  // MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
  const client = new MongoClient(url, {useNewUrlParser: true});
  client.connect(err => {
    if(err) {
      throw err;
    }
    console.log("Post successfully");
    // var dbo = db.db('blog');
    const dbo = client.db('test');
    // 4 - 读取posts集合
    dbo.collection('posts', function(err, collection) {
      if(err) {
        throw err;
      }
      collection.insert(post, {
        safe: true
      }, function(err) {
        // db.close();
        client.close();
        if(err){
          throw err;
        }
        callback(null);
      });
    });
  });
};

Post.get = function(name, callback) {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
    if(err) {
      throw err;
    }
    console.log("Get Post successfully");
    var dbo = db.db('test');
    dbo.collection('posts', function(err, collection) {
      if(err) {
        throw err;
      }
      var query = {};
      if(name) {
        query.name = name;
      }
      collection.find(query).sort({
        time: -1
      }).toArray(function(err, docs) {
        db.close();
        if(err) {
          throw err;
        }
        docs.forEach(function (doc) {
          doc.post = markdown.toHTML(doc.post);
        });
        callback(null, docs);
      });
    });
  });
};
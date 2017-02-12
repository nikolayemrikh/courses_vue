var User = require('../models/user');
var storage = require('./storage');
var config = require('nconf');
module.exports = {
  auth: {
    local: function (username, password, done) {
      User.findOne({
        username: username
      }).select("+hashedPassword +salt").exec(function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            incorrect: {
              username: true,
              password: false
            }
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            incorrect: {
              password: true,
              username: false
            }
          });
        }
        return done(null, user);
      });
    },
    vk: function (prof, done) {
      var userData = {
        username: prof.id,
        firstname: prof.first_name,
        lastname: prof.last_name,
        birthday: null,
        email: null,
        password: null,
        provider: config.get('auth:vk:provider') || 'vk'
      };
      User.findOne({
        username: userData.username
      }).exec(function (err, data) {
        if (err) {
          return done(err);
        }
        if (!data) {
          var user = new User(userData);
          user.save(function (err, data) {
            return done(err, data);
          });
        }
        else {
          return done(null, data);
        }
      });
    }
  },
  search: function (args, callback) {
    var query = {};
    if (args.data.role) query.role = Number(args.data.role);
    var rows = args.data.rows ? Number(args.data.rows) : 50;
    var page = args.data.page ? Number(args.data.page) - 1 : 0;
    // Query
    User.count(query, function (err, count) {
      if (err || !count) return callback(err);
      User.find(query).sort('lastname firstname middlename')
        .skip(rows * page).limit(rows).exec(function (err, data) {
        callback(err, data, count);
      });
    });
  },
  get: function (args, callback) {
    User.findById(args.userId).exec(callback);
    //Не получаем модели курсов в модель пользователя, нам нужны только айдишники пройденных курсов
    //User.findById(args.userId).populate('completedCourses').exec(callback);
  },
  update: function (args, callback) {
    var data = args.data || {};
    var attach = data.attach;
    data.attach = storage.setId(data.attach);
    User.findByIdAndUpdate(args.userId, {
      '$set': data
    }, {
      'new': true
    }, function (err, user) {
      console.log(user);
      console.log(err);
      callback(err, user);
      // save virtual field
      if (data.password) {
        user.password = data.password;
        user.save();
      }
      // store attach
      //if (!err && data) storage.update(attach);
    });
  },
  add: function (args, callback) {
    User.findOne({
      username: args.data.username
    }).exec(function(err, user) {
      if (user)
        return callback(new Error("user exists"));
      else
        var user = new User({
          username: args.data.username,
          password: args.data.password,
          firstname: args.data.firstname || "",
          lastname: args.data.lastname || "",
          birthday: args.data.birthday || null,
          email: args.data.email || null,
          role: args.data.role || 1
        });
        user.save(callback);
    });
  },
  remove: function (args, callback) {
    User.findOneAndRemove({
      _id: args.userId
    }, callback);
  }
};

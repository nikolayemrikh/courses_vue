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
    },
    github: function (ghProfile, done) {
      let fullname = (ghProfile._json.name && ghProfile._json.name.search(" ")) ? ghProfile._json.name.split(" ") : "";
      let ghUserData = {
        username: ghProfile.username,
        githubId: ghProfile.id,
        firstname: fullname[0],
        lastname: fullname[1] ? fullname[1] : '',
        password: null,
        provider: config.get('auth:github:provider') || 'github'
      };
      
      let primaryEmail = ghProfile.emails.find(function(element, index, array) {
        return !!element.primary;
      }).value;
      let emails = ghProfile.emails.filter(obj => !obj.primary);
      console.log(emails)
      emails = emails.map(obj => {
        return {
          email: obj.value
        }
      });
      console.log(emails)
      User.findOne({
        githubId: ghProfile.id
      }).exec(function(err, ghUser) {
        if (err) return done(err);
        if (!ghUser) {
          User.findOne({
            email: primaryEmail
          }).exec(function(err, localUserFromPrimaryEmail) {
            if (err) return done(err);
            
            if (!localUserFromPrimaryEmail) {
              if (!!emails.length) {
                console.log('lol')
                User.findOne({
                  $or: emails
                }).exec(function(err, localUserFromEmail) {
                  if (err) return done(err);
                  
                  if (!localUserFromEmail) {
                    var user = new User(ghUserData);
                    user.save(done);
                  }
                  
                  else {
                    localUserFromEmail.githubId = ghProfile.id;
                    localUserFromEmail.save(done);
                  }
                })
              } else {
                var user = new User(ghUserData);
                user.save(done);
              }
            }
            else {
              console.log('kek')
              localUserFromPrimaryEmail.githubId = ghProfile.id;
              localUserFromPrimaryEmail.save(done);
            }
          })
        }
        else return done(null, ghUser);
      });
    },
    bitbucket: function (bbProfile, done) {
      console.log(bbProfile)
      let fullname = (bbProfile.displayName && bbProfile.displayName.search(" ")) ? bbProfile.displayName.split(" ") : "";
      let bbUserData = {
        username: bbProfile.username,
        githubId: bbProfile.id,
        firstname: fullname[0],
        lastname: fullname[1] ? fullname[1] : '',
        password: null,
        provider: config.get('auth:github:provider') || 'github'
      };
      
      let primaryEmail = bbProfile.emails.find(function(element, index, array) {
        return !!element.primary;
      }).value;
      let emails = bbProfile.emails.filter(obj => !obj.primary);
      console.log(emails)
      emails = emails.map(obj => {
        return {
          email: obj.value
        }
      });
      console.log(emails)
      User.findOne({
        githubId: bbProfile.id
      }).exec(function(err, bbUser) {
        if (err) return done(err);
        if (!bbUser) {
          User.findOne({
            email: primaryEmail
          }).exec(function(err, localUserPrimaryEmail) {
            if (err) return done(err);
            
            if (!localUserPrimaryEmail) {
              if (!!emails.length) {
                User.findOne({
                  $or: emails
                }).exec(function(err, localUserEmail) {
                  if (err) return done(err);
                  
                  if (!localUserEmail) {
                    var user = new User(bbUserData);
                    user.save(done);
                  }
                  
                  else {
                    localUserEmail.bitbucketId = bbProfile.id;
                    localUserEmail.save(done);
                  }
                })
              } else {
                var user = new User(bbUserData);
                user.save(done);
              }
            }
            else {
              localUserPrimaryEmail.bitbucketId = bbProfile.id;
              localUserPrimaryEmail.save(done);
            }
          })
        }
        else return done(null, bbUser);
      });
    }
  },
  bindGithubId: function(args, callback) {
    
  },
  bindBitbucketId: function(args, callback) {
    
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
    // Не получаем модели курсов в модель пользователя, нам нужны только айдишники пройденных курсов
    // User.findById(args.userId).exec(callback);
    User.findById(args.userId).populate('coursesProgress').exec(callback);
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

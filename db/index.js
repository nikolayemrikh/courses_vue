var mongoose = require('mongoose');
var logger = require('../common/logger');
var config = require('nconf');
mongoose.connect(config.get('mongoose:uri'));
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var db = {
    profile: {
        auth: {
            local: function(username, password, done) {
                var User = require('./models/user');
                User.findOne({
                    username: username
                }).select("+hashedPassword +salt").exec(function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: 'Incorrect username.'
                        });
                    }
                    if (!user.isActive()) {
                        return done(null, false, {
                            message: 'User is inactive.'
                        });
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, {
                            message: 'Incorrect password.'
                        });
                    }
                    return done(null, user);
                });
            },
            vk: function(prof, done) {
                var userData = {
                    username: prof.id,
                    firstname: prof.first_name,
                    lastname: prof.last_name,
                    middlename: null,
                    genderId: null,
                    birthday: null,
                    email: null,
                    password: null,
                    provider: config.get('auth:vk:provider') || 'vk'
                };
                var User = require('./models/user');
                User.findOne({
                    username: userData.username
                }).exec(function(err, data) {
                    if (err) {
                        return done(err);
                    }
                    if (!data) {
                        var user = new User(userData);
                        user.save(function(err, data) {
                            return done(err, data);
                        });
                    }
                    else {
                        if (!data.isActive()) {
                            return done(null, false, {
                                message: 'User is inactive.'
                            });
                        }
                        return done(null, data);
                    }
                });
            }
        },
        log: function(args, callback) {
            var Logger = require('./models/logger');
            var log = new Logger({
                user: args.userId,
                ip: args.ip
            });
            log.save(callback);
        },
        info: function(args, callback) {
            var User = require('./models/user');
            User.findById(args.userId).exec(callback);
        },
        find: function(args, callback) {
            var User = require('./models/user');
            User.findOne({
                username: args.username
            }, callback);
        },
        update: function(args, callback) {
            var User = require('./models/user');
            var attach = args.data.attach || [];
            var attachAdd = [];
            var attachDel = [];
            for (var i = 0; i < attach.length; i++) {
                if (!attach[i].fileId) {
                    attach[i].fileId = mongoose.Types.ObjectId();
                    attachAdd.push(attach[i]);
                }
                else if (attach[i].removed) {
                    attachDel.push(attach[i]);
                    attach.splice(i, 1);
                    i--;
                }
            }
            User.findByIdAndUpdate(args.userId, {
                '$set': args.data
            }, {
                'new': true
            }, function(err, data) {
                callback(err, data);
                if (!err && data) {
                    if (attachAdd.length > 0) {
                        db.storage.upload(attachAdd);
                    }
                    if (attachDel.length > 0) {
                        db.storage.remove(attachDel);
                    }
                }
            });
        }
    },
    gfs: null,
    mongoose: mongoose
};

conn.on('error', function(err) {
    logger.error("MongoDB connection error: " + err.message);
});
conn.once('open', function() {
    logger.info("MongoDb is connected");
    db.gfs = Grid(conn.db, mongoose.mongo);
});

module.exports = db;
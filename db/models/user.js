/**
 * Модель пользователя
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var Attach = require('./attach').schema;
var Task = require("./task").schema;
var User = new Schema({
  // Логин
  username: {
    type: String,
    unique: true,
    required: true
  },
  githubId: {
    type: String
  },
  bitbucketId: {
    type: String
  },
  vkId: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  // Хэш пароля
  hashedPassword: {
    type: String,
    select: false,
    required: true
  },
  // Соль для пароля
  salt: {
    type: String,
    select: false,
    required: true
  },
  // Дата создания записи
  created: {
    type: Date,
    default: Date.now
  },
  // Электронная почта
  email: {
    type: String
  },
  // Роль пользователя: 1 = Студент, 2 = Преподаватель, 3 = Администратор
  role: {
    type: Number,
    default: 1
  },
  coursesProgress: [{
    courseId: String, //
    completedTasks: [Number],
    achieves: {
      halfCourse: Boolean,
      fullCourse: Boolean
    }
  }],
  bitbucketToken: {
    type: String
  },
  githubToken: {
    type: String
  },
  githubUsername: {
    type: String
  },
  bitbucketUsername: {
    type: String
  }
});
User.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};
User.virtual('password').set(function (password) {
  if (!password) password = crypto.randomBytes(8).toString('base64');
  this._plainPassword = password;
  this.salt = crypto.randomBytes(32).toString('base64');
  //more secure - this.salt = crypto.randomBytes(128).toString('base64');
  this.hashedPassword = this.encryptPassword(password);
}).get(function () {
  return this._plainPassword;
});
User.methods.validPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword;
};
User.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.hashedPassword;
    delete ret.salt;
    return ret;
  }
});
module.exports = mongoose.model('User', User);

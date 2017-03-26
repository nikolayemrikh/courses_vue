const request = require('request');
const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs-extra');
const urlify = require('urlify').create({
  // addEToUmlauts: true,
  // szToSs: true,
  spaces: "-",
  nonPrintable: "_",
  trim: true
});

const helpers = require('./helpers');
const repPath = config.get('courses:repPath');
const dirNameTemplate = new RegExp(config.get('courses:dirNameTemplate:pattern'), config.get('courses:dirNameTemplate:flags'));
const initialFilesDir = config.get('courses:initialFilesDir');
const initialHtmlFile = config.get('courses:initialHtmlFile');
const initialCssFile = config.get('courses:initialCssFile');
const initialJsFile = config.get('courses:initialJsFile');
const initialAnswersFile = config.get('courses:initialAnswersFile');
const metaFile = config.get('courses:metaFile');
const solutionFile = config.get('courses:solutionFile');
const theoryFile = config.get('courses:theoryFile');
const checkerFile = config.get('courses:checkerFile');
const goalsFile = config.get('courses:goalsFile');
const filesDirName = config.get('courses:filesDirName');
const authorUsernameDelimiter = config.get('courses:authorUsernameDelimiter');

const User = require('../db/dao/user');

// module.exports = {
//   create(meta, callback) {
//     let dirName = this._constructDirName(meta.title, meta.author.username);
//     let absDirPath = path.join(repPath, dirName);
//     this._createDirectory(absDirPath, (err, dir) => {
//       if (err) return callback(err);
//       fs.writeFile(path.join(absDirPath, metaFile), JSON.stringify(meta, null, 4), callback);
//     });
//   },
//   _constructDirName(courseName, authorUsername) {
//     return urlify(courseName) + '@' + authorUsername;
//   },
//   _createDirectory(absoluteDirName, callback) {
//     if (!fs.existsSync(absoluteDirName)){
//       fs.mkdir(absoluteDirName, callback);
//     } else {
//       callback(new Error('Course with same username and title already exists'));
//     }
//   }
// };

module.exports.Course = class Course {
  constructor(meta, tempFiles) {
    Object.assign(this, meta);
    this.tempFiles = tempFiles;
  }
  _constructDirName(title, username) {
    return urlify(title) + '@' + username;
  }
  save(callback) {
    if (this.title && this.author && this.author.username) {
      this._createCouresDirectory((err, res) => {
        if (err) return callback(err);
        let meta = {
          title: this.title,
          description: this.description,
          filesOrder: this.filesOrder ? this.filesOrder : []
        }
        fs.writeFile(path.join(this.dirName, metaFile), JSON.stringify(meta, null, 4), callback);
        this._saveFiles(callback);
      })
    }
  }
  _createCouresDirectory(callback) {
    let dirName = this._constructDirName(this.title, this.author.username);
    let absDirPath = path.join(repPath, dirName);
    if (!fs.existsSync(absDirPath)) {
      fs.mkdir(absDirPath, (err, res) => {
        if (err) return callback(err);
        this.dirName = absDirPath;
        callback(null, 'OK');
      });
    } else {
      callback(new Error('Course with same username and title already exists'));
    }
  }
  _saveFiles(callback) {
    let absFilesDirPath = path.join(this.dirName, filesDirName);
    fs.mkdir(absFilesDirPath, (err, res) => {
      if (err) callback(err)
      let promises = [];
      for (let tempFileInfo of this.tempFiles) {
        promises.push(new Promise((resolve, reject) => {
          fs.move(tempFileInfo.path, path.join(absFilesDirPath, tempFileInfo.originalname), err => {
            if (err) return reject('Something went wrong');
            return resolve('OK');
          })
        }));
      }
      Promise.all(promises).then(val => {
        callback(null, "OK");
      }).catch(err => {
        callback(err);
      })
    });
  }
  
};

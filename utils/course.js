const request = require('request');
const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs');
const urlify = require('urlify').create({
  addEToUmlauts: true,
  szToSs: true,
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


module.exports = {
  create({data}, callback) {
    let dirName = this._constructDirName(data.name, data.author.username);
    let absDirPath = path.join(repPath, dirName);
    this._createDirectory(absDirPath, (err, dir) => {
      if (err) return callback(err);
      fs.writeFile(path.join(absDirPath, metaFile), data, callback);
    });
  },
  _constructDirName(courseName, authorUsername) {
    return urlify(courseName) + '@' + authorUsername;
  },
  _createDirectory(absoluteDirName, callback) {
    if (!fs.existsSync(absoluteDirName)){
      fs.mkdir(absoluteDirName, callback);
    } else {
      callback(new Error('Course already loaded in filesystem'));
    }
  }
};

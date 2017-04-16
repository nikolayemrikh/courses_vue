const request = require('request');
const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs-extra');
const urlify = require('urlify').create({
  // addEToUmlauts: true,
  // szToSs: true,
  spaces: "_",
  nonPrintable: "_",
  trim: true
});
const simpleGit = require('simple-git');
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
const githubUserAgent = config.get('auth:github:userAgent')

const User = require('../db/dao/user');

module.exports.Course = class Course {
  constructor(meta, tempFiles) {
    Object.assign(this, meta);
    this.tempFiles = tempFiles;
  }
  _constructDirName(title, username) {
    return urlify(title).toLowerCase() + '@' + username;
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
        fs.writeFile(path.join(this.dirName, metaFile), JSON.stringify(meta, null, 4), (err, res) => {
          if (err) return callback(err);
          if (this.tempFiles.length) this._saveFiles(callback);
          else callback(null, 'meta');
        });
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
            if (err) {
              this.removeDir();
              return reject('Something went wrong');
            }
            resolve('OK');
          })
        }));
      }
      Promise.all(promises).then(val => callback(null, val)).catch(err => callback(err));
    });
  }
  createRepository(userSession, callback) {
    if (!this.service) return callback(new Error('No service attached'));
    let repoName = urlify(this.title).toLowerCase();
    let options = {
      json: true,
      headers: {}
    };
    options.method = 'POST';
    switch (this.service) {
      case 'github':
        options.url = 'https://api.github.com/user/repos';
        options.body = {
          name: repoName,
          // auto_init: true
        };
        options.headers['Authorization'] = `token ${userSession.githubToken}`;
        options.headers['user-agent'] = githubUserAgent;
        break;
      case 'bitbucket':
        options.url = `https://api.bitbucket.org/2.0/repositories/${userSession.bitbucketUsername}/${repoName}`;
        options.headers['Authorization'] = `Bearer ${userSession.bitbucketToken}`;
        options.body = {
          scm: "git",
          is_private: "true",
          fork_policy: "no_public_forks"
        };
        break;
    }
    request(options, (err, res) => {
      if (err || !res && res.statusCode !== 201) {
        this.removeDir();
        return callback(err);
      }
      this.gitUrl = res.body.git_url;
      this.id = res.body.id;
      this.remoteUrl = res.body.clone_url;
      this.updateMeta({
        repoName: repoName,
        service: this.service,
        remoteUrl: this.remoteUrl
      }, () => {
        callback(null, res.body);
      })
    });
  }
  gitInit(userSession, callback) {
    let remoteUrl;
    switch (this.service) {
      case 'github':
        remoteUrl = `https://${userSession.githubUsername}:${userSession.githubToken}@github.com/${userSession.githubUsername}/${urlify(this.title)}.git`
        break;
      case 'bitbucket':
        remoteUrl = `https://${userSession.bitbucketUsername}:${userSession.bitbucketToken}@bitbucket.org/${userSession.bitbucketUsername}/${urlify(this.title).toLowerCase()}.git`
        break;
    }
    
    simpleGit(path.join(__dirname, '..', this.dirName))
      .init()
      .add('.')
      .commit("NE LMS COMMIT")
      .addRemote('origin', this.remoteUrl)
      // .pull()
      .raw([
        'config',
        'remote.origin.url',
        remoteUrl
      ])
      .push(['-u', 'origin', 'master'], (err, res) => {
        if (err) {
          this.removeDir();
          return callback(err);
        }
        callback(null, res);
      });
      
  }
  updateMeta(props, callback) {
    let metaPath = path.join(this.dirName, metaFile);
    fs.readFile(metaPath, {
      encoding: 'utf8'
    }, (err, courseMeta) => {
      courseMeta = JSON.parse(courseMeta)
      if (err) {
        this.removeDir();
        return callback(err);
      }
      
      Object.assign(courseMeta, props);
      
      fs.writeFile(metaPath, JSON.stringify(courseMeta, null, 4), (err, res) => {
        if (err) {
          this.removeDir();
          return callback(err);
        }
        else callback(null, 'meta');
      })
    });
  }
  hookRepo(userSession, callback) {
    if (!this.service) return callback(new Error('No service attached'));
    let repoName = urlify(this.title).toLowerCase();
    let options = {
      json: true,
      headers: {}
    };
    options.method = 'POST';
    switch (this.service) {
      case 'github':
        options.url = `https://api.github.com/repos/${userSession.githubUsername}/${repoName}/hooks`;
        options.body = {
          name: "web",
          active: true,
          events: ["push"],
          config: {
            url: config.get('systemUrl') + 'api/githubHooks',
            content_type: 'json'
          }
          // auto_init: true
        };
        options.headers['Authorization'] = `token ${userSession.githubToken}`;
        options.headers['user-agent'] = githubUserAgent;
        break;
      case 'bitbucket':
        options.url = `https://api.bitbucket.org/2.0/repositories/${userSession.bitbucketUsername}/${repoName}/hooks`;
        options.headers['Authorization'] = `Bearer ${userSession.bitbucketToken}`;
        options.body = {
          events: ["repo:push"],
          description: "NE LMS webhook",
          url: config.get('systemUrl') + 'api/githubHooks',
          active: true
        };
        break;
    }
    request(options, (err, res) => {
      if (err || !res && res.statusCode !== 201) {
        this.removeDir();
        return callback(err);
      }
      callback(null, res.body);
    });
  }
  static createFromName(fullCourseName) {
    let course = new Course;
    let absDirPath = path.join(repPath, fullCourseName.toLowerCase());
    course.dirName = absDirPath;
    let metaPath = path.join(absDirPath, config.get('courses:metaFile'));
    let meta = JSON.parse(fs.readFileSync(metaPath), {
      encoding: 'utf8'
    });
    Object.assign(course, meta);
    return course;
  }
  remove(userSession, cb) {
    this.removeDir();
    this.removeRepo(userSession, cb);
  }
  removeDir() {
    this.deleteFolderRecursive(this.dirName);
  }
  deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach((file, index) => {
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
  removeRepo(userSession, callback) {
    if (!this.service) return callback(new Error('No service attached'));
    let repoName = urlify(this.title).toLowerCase();
    let options = {
      json: true,
      headers: {}
    };
    options.method = 'DELETE';
    switch (this.service) {
      case 'github':
        options.url = `https://api.github.com/repos/${userSession.githubUsername}/${repoName}`;
        options.headers['Authorization'] = `token ${userSession.githubToken}`;
        options.headers['user-agent'] = githubUserAgent;
        break;
      case 'bitbucket':
        options.url = `https://api.bitbucket.org/2.0/repositories/${userSession.bitbucketUsername}/${repoName}`;
        options.headers['Authorization'] = `Bearer ${userSession.bitbucketToken}`;
        options.body = {
          scm: "git",
          is_private: "true",
          fork_policy: "no_public_forks"
        };
        break;
    }
    request(options, (err, res) => {
      if (err || !res && res.statusCode !== 204) return callback(err);
      callback(null, res);
    });
  }
};
// bb create repo
// curl -X POST -v -H "Authorization: Bearer UF3BlzCkByByMdpTsAIjtIbOWYCjQ-_N4xogNZZ7Aa6hStE2St90VAPUvM_fqIng-0QqH7qoDutW_O2HOpg=" -H "Content-Type: application/json" https://api.bitbucket.org/2.0/repositories/nikolayemrikh/test_create -d '{"scm": "git", "is_private": "true", "fork_policy": "no_public_forks" }'
// gh create repo
// curl -i -u neproctor -d '{"name": "create-repo-test", "auto_init": true}' https://api.github.com/user/repos

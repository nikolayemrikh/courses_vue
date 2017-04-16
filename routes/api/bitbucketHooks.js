var express = require('express');
var router = express.Router();
var request = require('request');
var simpleGit = require('simple-git');
var childProcess = require('child_process');
var path = require('path');
var utils = require('../../utils');
var config = require('nconf');

router.post('/', function(req, res) {
  let body = req.body;
  console.log('bitbucket', body.repository.owner)
  let courseDirName = `${body.repository.name}@${body.repository.owner.username}`;
  let coursePath = path.join(config.get('courses:repPath'), courseDirName);
  console.log(coursePath)
  simpleGit(coursePath).pull(function(err, update) {
    
  });
  res.status(200).end();
});

module.exports = router;

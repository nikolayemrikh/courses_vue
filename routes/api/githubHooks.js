var express = require('express');
var router = express.Router();
var request = require('request');
var simpleGit = require('simple-git');
var childProcess = require('child_process');
var path = require('path');
var utils = require('../../utils');
var config = require('nconf');

router.post('/', function(req, res) {
  simpleGit(config.get('repPath')).pull(function(err, update) {
    // if (err || !update)
    //   console.error(err)
    // else if (update && update.summary.changes) {
    //   childProcess.exec('git -C ~/courses-rep pull',  (error, stdout, stderr) => {
    //     utils.handlePull();
    //   })
    // }
    utils.list()
  });
  res.status(200).end();
});

module.exports = router;

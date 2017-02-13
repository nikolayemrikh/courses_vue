var express = require('express');
var router = express.Router();
var request = require('request');
var childProcess = require('child_process');
var path = require('path');
var config = require('nconf');
var fs = require('fs');

var repPath = config.get('repPath')

function pullHandle() {
  fs.readdir(repPath, function(err, names) {
   if (err || names) console.error(err)
    
  });
}

module.exports = pullHandle;
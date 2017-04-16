var express = require('express');
var router = express.Router();

var course = require("./course");
var task = require("./task");
var user = require("./user");
var githubHooks = require("./githubHooks");
var bitbucketHooks = require("./bitbucketHooks");
var local = require("./local");

// router.use('/task', profile.isAuth, task);
router.use('/course', course);
router.use('/task', task);
router.use('/user', user);
router.use('/githubHooks', githubHooks);
router.use('/bitbucketHooks', bitbucketHooks);
router.use('/local', local);

module.exports = router;

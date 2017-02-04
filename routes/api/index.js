var express = require('express');
var router = express.Router();

var course = require("./course");
var task = require("./task");
var user = require("./user");

// router.use('/task', profile.isAuth, task);
router.use('/course', course);
router.use('/task', task);
router.use('/user', user);

module.exports = router;
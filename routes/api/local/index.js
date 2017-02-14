var express = require('express');
var router = express.Router();

var course = require("./course");
var task = require("./task");

// router.use('/task', profile.isAuth, task);
router.use('/course', course);
router.use('/task', task);

module.exports = router;

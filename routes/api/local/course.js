var express = require('express');
var router = express.Router();
var taskRouter = require('./task');
router.use('/:courseId/task', taskRouter);
// List all course in course
var shortid = require('shortid');
var utils = require('../../../utils');

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, shortid.generate() + file.originalname);
  }
});
var upload = multer({ storage: storage });

router.get('/', function (req, res, next) {
  var args = {
    author: req.query.author
  };
  utils.loader.course.listCourses(args, function (err, courses) {
    if (!err && courses) {
      res.json(courses);
    }
    else {
      res.status(400).send(err);
    }
  });
});
// Get course by number
router.get('/:courseId', function (req, res) {
  var args = {
    courseId: req.params.courseId
  };
  utils.loader.course.listTasksInCourse(args, function(err, tasks) {
    if (!err && tasks) {
      res.json(tasks);
    }
    else {
      res.status(400).end();
    }
  });
});
// Create new course
router.post('/', upload.any(), function (req, res, next) {
  var args = {
    meta: JSON.parse(req.body.meta)
  };
  let course = new utils.course.Course(args.meta, req.files);
  course.save((err, stat) => {
    if (err) return res.status(400).send(err.message);
    course.createRepository(req.user, (err, body) => {
      if (err) return res.status(400).send(err.message);
      course.gitInit(req.user, (err, gitAnswer) => {
        if (err) return res.status(400).send(err.message);
        course.hookRepo(req.user, (err, webHookResp) => {
          if (err) return res.status(400).send(err.message);
          res.json(course.remoteUrl);
        });
      })
    });
  });
});
// Update course
router.put('/:_id', function (req, res, next) {
  var args = {
    _id: req.params._id,
    data: req.body
  };
  course.update(args, function (err, data) {
    if (!err && data) {
      //data._id = data.number;
      res.json(data);
    }
    else {
      //res.status(400).end();
      res.status(400).send(err.message);
    }
  });
});
// Remove course
router.delete('/:courseId', function (req, res, next) {
  console.log('tyt')
  var args = {
    courseId: req.params.courseId
  };
  course.delete(args, function (err, data) {
    if (!err && data) {
      res.json(data);
    }
    else {
      res.status(400).end();
    }
  });
});
module.exports = router;

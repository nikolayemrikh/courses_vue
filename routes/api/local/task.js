let express = require('express');
let router = express.Router({
    mergeParams: true
});
let utils = require('../../../utils');
// List all task in course
router.get('/', function(req, res) {
    console.log(req.params.courseId, "test1")
    let args = {
        courseId: req.params.courseId
    };
    task.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Get task by id
router.get('/:taskId', function(req, res, next) {
    let args = {
        courseId: req.params.courseId,
        taskId: req.params.taskId
    };
    console.log('teste')
    utils.loader.course.getTask(args, function(err, task) {
        if (!err && task) {
            res.json(task);
        }
        else {
            res.status(400).end();
        }
    });
});
// Create new task
router.post('/', function(req, res, next) {
    let args = req.body;
    var course = utils.course.Course.createFromName(args.courseId);
    try {
        course.addTask(args);
        course.commitAndPush(req.user);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err.message);
    }
});
// Update task
router.put('/:taskNumber', function(req, res, next) {
    let taskId = req.params.taskNumber;
    console.log(taskId, req.body)
    var course = utils.course.Course.createFromName(req.body.courseId);
    try {
        course.editTask(taskId, req.body);
        course.commitAndPush(req.user);
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/remove', function(req, res, next) {
    console.log(req.body)
    let taskNumber = req.body.taskNumber;
    var course = utils.course.Course.createFromName(req.body.courseId);
    try {
        let isAdmin = false;
        if (router.isAuth && router.isAdministrator) {
            isAdmin = true;
        }
        course.removeTask(taskNumber);
        if (isAdmin) {
            course.commitAndPush(req.user);
        }
        res.status(200).end();
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Remove task
// router.delete('/:taskId', function(req, res, next) {
//   let args = {
//         courseId: req.params.courseId,
//         taskId: req.params.taskId
//     };
//     console.log(args)
//     task.delete(args, function(err, data) {
//         if (!err && data) {
//             res.json(data);
//         }
//         else {
//             res.status(400).end();
//         }
//     });
// });
module.exports = router;

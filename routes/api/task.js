var express = require('express');
var router = express.Router({
    mergeParams: true
});
// List all task in course
router.get('/', function(req, res) {
    console.log(req.params.courseId, "test1")
    var args = {
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
    var args = {
        courseId: req.params.courseId,
        taskId: req.params.taskId
    };
    task.getTask(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Create new task
router.post('/', function(req, res, next) {
    var args = req.body;
    task.add(args, function(err, data) {
        if (!err && data) {
            console.log(err, data, "kek")
                //res.status(200).end();
            res.json(data);
            //res.status(200).end();
        }
        else {
            console.log(err, data)
                //res.status(400).end();
            res.status(400).end();
        }
    });
});
// Update task
router.put('/:_id', function(req, res, next) {
    var args = {
        _id: req.params._id,
        data: req.body
    };
    task.update(args, function(err, data) {
        if (!err && data) {
            /*req.login(data, function(error) {
                if (error) res.status(400).end();
                else res.json(data);
            });*/
            res.json(data);
        }
        else {
            //res.status(400).end();
            res.status(400).send(err.message);
        }
    });
});
// Remove task
router.delete('/:taskId', function(req, res, next) {
    var args = {
        courseId: req.params.courseId,
        taskId: req.params.taskId
    };
    console.log(args)
    task.delete(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
module.exports = router;
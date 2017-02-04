var Course = require('../models/course');
var Task = require("../models/task");
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            name: args.data.name,
            description: args.data.description,
            courseId: args.data.courseId,
            tasks: args.data.tasks,
            files: args.data.files
        });
        course.save(function(err) {
            if (err) return callback(err);
            callback(null, course);
        });
    },
    list: function(args, callback) {
        Course.find({}).populate('tasks', 'taskDescription taskName taskId').sort({
            "courseId": 1
        }).exec(callback);
    },
    getCourse: function(args, callback) {
        Course.findOne({
            courseId: args.courseId
        }).populate({
            path: "tasks",
            select: "taskDescription taskName taskId courseId",
            options: {
                sort: {
                    "taskId": 1
                }
            }
        }).exec(function(err, course) {
            if (err) return callback(err);
            callback(null, course)
        });
    },
    delete: function(args, callback) {
        Course.findOneAndRemove({
            courseId: args.courseId
        }, function(err, course) {
            if (err) return callback(err);
            Task.remove({
                courseId: args.courseId
            }).exec(function(err) {
                if (err) return callback(err);
                callback(null, course);
            });
        });
    },
    update: function(args, callback) {
        var data = args.data || {};
        Course.findById(args._id, function(err, course) {
            if (err) return callback(err);
            console.log(args._id)
            // Если новый courseId не равен старому, значит его поменяли. Надо проверить есть ли уже курс с courseId, на который хотят поменять
            // Запросим все курсы
            if (data.courseId != course.courseId) {
                Course.find().where({courseId: data.courseId}).exec(function(err, courses) {
                    if (err) return callback(err);
                    //Теперь если такого курса с courseId, на который хотят поменять, нет, то можно всем заданиям этого курса обновить courseId
                    if (courses.length > 0) return callback(new Error("Курс с таким номером уже существует в курсе"));
                    Task.update({
                        courseId: course.courseId
                    }, {
                        courseId: data.courseId
                    }, {
                        'multi': true
                    }, function(err, tasks) {
                        console.log(tasks)
                        if (err) return callback(err);
                        Course.findByIdAndUpdate(args._id, {
                            '$set': data
                        }, {
                            'new': true
                        }, function(err, course) {
                            if (err) return callback(err);
                            callback(null, course);
                        });
                    });
                });
            }
        });
    }
}
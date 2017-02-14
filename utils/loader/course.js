const express = require('express');
const router = express.Router();
const request = require('request');
const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs');

const repPath = config.get('repPath')
console.log(repPath)
module.exports = {
  list(callback) {
    // Читаем директорию, в которой хранятся папки с курсами
    fs.readdir(repPath, (err, courseDirs) => {
      if (err) return callback(err, null);

      // Фильтруем выбранные файлы, нам нужны только папки с курсами (вдруг что-то лишнее попало)
      courseDirs = courseDirs.filter(file => {
        return file[0] != '.' && fs.statSync(path.join(repPath, file)).isDirectory();
      });

      let courses = [];

      // Идем по папкам курсов
      for (let i in courseDirs) {
        let courseDir = courseDirs[i];
        let courseFiles = fs.readdirSync(path.join(repPath, courseDir));
        if (courseFiles.indexOf('meta.json') == -1) break;

        // Забираем мету курса
        let courseMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, 'meta.json'), {
          encoding: 'utf8'
        }));

        // Добавляем к мете номер курса (courseId) - число в названии папки
        let matchedCourseId = courseDir.match(/^(\d+)/gm)
        if (matchedCourseId.length != 1) break;
        courseMeta.courseId = Number.parseInt(matchedCourseId[0]);
        courseMeta.tasks = [];

        // Фильтруем файлы в папке курса, нам нужны папки заданий
        let taskDirs = courseFiles.filter(file => {
          return file[0] != '.'
            && file.indexOf('files') == -1
            && fs.statSync(path.join(repPath, courseDir, file)).isDirectory();
        });

        // Идем по папкам заданий в папке курсов
        for (let j in taskDirs) {
          let taskDir = taskDirs[j];

          // Забираем мету задания
          let taskMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, taskDir, 'meta.json'), {
            encoding: 'utf8'
          }));
          let matchedTaskId = taskDir.match(/^(\d+)/gm);
          if (matchedTaskId.length != 1) break;
          taskMeta.taskId = Number.parseInt(matchedTaskId[0]);

          courseMeta.tasks.push(taskMeta);

          // let file = fs.readFileSync(path.join(repPath, courseFile), {
          //   encoding: 'utf8'
          // });
        }
        courses.push(courseMeta);

      }

      callback(null, courses)
    })
  },
  get(courseNumber, callback) {

  },
  add(courseNumber, callback) {

  },
  delete(courseNumber, callback) {

  },
  modify(courseNumber, callback) {

  }
};

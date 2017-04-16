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
  list(courseId, callback) {
    // Преобразуем номер курса в название папки с файлами курса
    let repDirs = fs.readdirSync(path.join(repPath));
    repDirs = repDirs.filter(filename => {
      return fs.statSync(path.join(repPath, filename)).isDirectory();
    });
    let courseDir = repDirs.filter(filename => {
      return filename.match(/^(\d+)/gm) == courseId;
    })
    // Читаем директорию курса, в которой хранятся папки с заданиями
    fs.readdir(path.join(repPath, courseDir), (err, taskDirs) => {
      if (err) return callback(err, null);

      // Фильтруем выбранные файлы, нам нужны только папки с заданиями (вдруг что-то лишнее попало)
      taskDirs = taskDirs.filter(file => {
        return file[0] != '.'
          && file.indexOf('files') == -1
          && fs.statSync(path.join(repPath, file)).isDirectory();
      });

      let tasks = [];

      // Идем по папкам заданий
      for (let i in taskDirs) {
        let taskDir = taskDirs[i];
        let taskFiles = fs.readdirSync(path.join(repPath, courseDir, taskDir));
        if (taskFiles.indexOf('meta.json') == -1) break;

        // Забираем мету задания
        let taskMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, 'meta.json'), {
          encoding: 'utf8'
        }));

        // Добавляем к мете номер задания (taskId) - число в названии папки
        let matchedTaskId= taskDir.match(/^(\d+)/gm)
        if (matchedTaskId.length != 1) break;
        taskMeta.taskId = Number.parseInt(matchedTaskId[0]);
        taskMeta.tasks = [];

        tasks.push(taskMeta);

      }

      callback(null, tasks)
    })
  },
  get(courseId, taskNumber, callback) {

  },
  add(courseId, taskNumber, callback) {

  },
  delete(courseId, taskNumber, callback) {

  },
  modify(courseId, taskNumber, callback) {

  }
};

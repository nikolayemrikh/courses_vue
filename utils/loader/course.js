const request = require('request');
const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs');

const helpers = require('../helpers');
const repPath = config.get('courses:repPath');
const dirNameTemplate = new RegExp(config.get('courses:dirNameTemplate:pattern'), config.get('courses:dirNameTemplate:flags'));
const initialFilesDir = config.get('courses:initialFilesDir');
const initialHtmlFile = config.get('courses:initialHtmlFile');
const initialCssFile = config.get('courses:initialCssFile');
const initialJsFile = config.get('courses:initialJsFile');
const initialAnswersFile = config.get('courses:initialAnswersFile');
const metaFile = config.get('courses:metaFile');
const solutionFile = config.get('courses:solutionFile');
const theoryFile = config.get('courses:theoryFile');
const checkerFile = config.get('courses:checkerFile');
const goalsFile = config.get('courses:goalsFile');
const filesDirName = config.get('courses:filesDirName');


module.exports = {
  listCourses(args, callback) {
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
        if (courseFiles.indexOf(metaFile) == -1) break;

        // Забираем мету курса
        let courseMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, metaFile), {
          encoding: 'utf8'
        }));

        // Добавляем к мете номер курса (courseId) - число в названии папки
        let matchedCourseId = courseDir.match(dirNameTemplate)
        if (matchedCourseId.length != 1) break;
        courseMeta.courseId = Number.parseInt(matchedCourseId[0]);
        courseMeta.tasks = [];

        // Фильтруем файлы в папке курса, нам нужны папки заданий
        let taskDirs = courseFiles.filter(file => {
          return file[0] != '.'
            && file.indexOf(filesDirName) == -1
            && fs.statSync(path.join(repPath, courseDir, file)).isDirectory();
        });

        // Идем по папкам заданий в папке курсов
        for (let j in taskDirs) {
          let taskDir = taskDirs[j];

          // Забираем мету задания
          let taskMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, taskDir, metaFile), {
            encoding: 'utf8'
          }));
          let matchedTaskId = taskDir.match(dirNameTemplate);
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
  get(args, callback) {
    let courseId = args.courseId;
  },
  add(args, callback) {
    let courseId = args.courseId;
  },
  delete(args, callback) {
    let courseId = args.courseId;
  },
  modify(args, callback) {
    let courseId = args.courseId;
  },
  listTasksInCourse(args, callback) {
    let courseId = args.courseId;
    // Преобразуем номер курса в название папки с файлами курса
    let repDirs = fs.readdirSync(path.join(repPath));
    repDirs = repDirs.filter(filename => {
      return filename[0] != '.'
        && fs.statSync(path.join(repPath, filename)).isDirectory();
    });

    let courseDir;
    for (const i in repDirs) {
      const repDir = repDirs[i];
      if (repDir.match(dirNameTemplate).length == 1 && repDir.match(dirNameTemplate)[0] == courseId)
        courseDir = repDir;
    }

    // Забираем мету курса
    let courseMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, metaFile), {
      encoding: 'utf8'
    }));

    // Добавляем к мете номер курса (courseId) - число в названии папки
    let matchedCourseId = courseDir.match(dirNameTemplate);
    if (matchedCourseId.length != 1) callback('multiple directories with same number');
    courseMeta.courseId = Number.parseInt(matchedCourseId[0]);
    courseMeta.tasks = [];

    console.log(repPath, courseDir)
    // Читаем директорию курса, в которой хранятся папки с заданиями
    fs.readdir(path.join(repPath, courseDir), (err, taskDirs) => {
      if (err) return callback(err, null);

      // Фильтруем выбранные файлы, нам нужны только папки с заданиями (вдруг что-то лишнее попало)
      taskDirs = taskDirs.filter(file => {
        return file[0] != '.'
          && file.indexOf(filesDirName) == -1
          && fs.statSync(path.join(repPath, courseDir, file)).isDirectory();
      });

      let tasks = [];

      // Идем по папкам заданий
      for (let i in taskDirs) {
        let taskDir = taskDirs[i];
        let taskFiles = fs.readdirSync(path.join(repPath, courseDir, taskDir));
        if (taskFiles.indexOf(metaFile) == -1) break;

        // Забираем мету задания
        let taskMeta = JSON.parse(fs.readFileSync(path.join(repPath, courseDir, taskDir, metaFile), {
          encoding: 'utf8'
        }));

        // Добавляем к мете номер задания (taskId) - число в названии папки
        let matchedTaskId= taskDir.match(dirNameTemplate)
        if (matchedTaskId.length != 1) break;
        taskMeta.taskId = Number.parseInt(matchedTaskId[0]);
        taskMeta.tasks = [];

        tasks.push(taskMeta);

      }
      courseMeta.tasks = tasks;

      callback(null, courseMeta)
    })
  },
  getCourseFiles(args, callback) {
    let courseId = args.courseId;
    let filesDirPath = path.join(helpers.resolveDirName(repPath, courseId), filesDirName);
    let files = {};
    let fileNames = fs.readdirSync(filesDirPath).filter(file => {
      return file[0] != '.';
    });
    for (i in fileNames) {
      let fileName = fileNames[i];
      files[fileName] = fs.readFileSync(path.join(filesDirPath, fileName), {
        encoding: 'utf8'
      });
    }
    console.log(files)
    callback(null, files);

  },
  getTask(args, callback) {
    let courseId = args.courseId;
    let taskId = args.taskId;

    let fullTaskPath = helpers.resolveDirName(repPath, courseId, taskId);

    let task = {};
    task.taskMeta = JSON.parse(fs.readFileSync(path.join(fullTaskPath, metaFile), {
      encoding: 'utf8'
    }));

    let taskFiles = fs.readdirSync(fullTaskPath);
    taskFiles = taskFiles.filter(file => {
      return file[0] != '.';
    });
    // Сначала заберем все initial файлы
    task.initial = {};
    let initialFiles = fs.readdirSync(path.join(repPath, fullTaskPath, initialFilesDir));

    if (initialFiles.includes(initialHtmlFile))
      task.initial.html = fs.readFileSync(path.join(fullTaskPath, initialFilesDir, initialHtmlFile), {
        encoding: 'utf8'
      });

    if (initialFiles.includes(initialCssFile))
      task.initial.css = fs.readFileSync(path.join(fullTaskPath, initialFilesDir, initialCssFile), {
        encoding: 'utf8'
      });

    if (initialFiles.includes(initialJsFile))
      task.initial.js = fs.readFileSync(path.join(fullTaskPath, initialFilesDir, initialJsFile), {
        encoding: 'utf8'
      });

    if (initialFiles.includes(initialAnswersFile))
      task.initial.answers = JSON.parse(fs.readFileSync(path.join(fullTaskPath, initialFilesDir, initialAnswersFile), {
        encoding: 'utf8'
      }));

    // Потом все остальные
    if (taskFiles.includes(solutionFile))
      task.initial.solution = fs.readFileSync(path.join(fullTaskPath, solutionFile), {
        encoding: 'utf8'
      });

    if (taskFiles.includes(checkerFile))
      task.initial.checker = fs.readFileSync(path.join(fullTaskPath, checkerFile), {
        encoding: 'utf8'
      });

    if (taskFiles.includes(goalsFile))
      task.initial.goals = fs.readFileSync(path.join(fullTaskPath, goalsFile), {
        encoding: 'utf8'
      });

    this.getCourseFiles({courseId}, (err, files) => {
      task.files = files;
      callback(null, task);
    });
  }
};

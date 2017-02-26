const childProcess = require('child_process');
const path = require('path');
const config = require('nconf');
const fs = require('fs');

module.exports = {
  resolveDirName(repPath, ...otherIds) {
    if (!otherIds[0]) return repPath;

    let courseId = otherIds[0];

    let coursesDirs = fs.readdirSync(path.join(repPath));
    coursesDirs  = coursesDirs .filter(filename => {
      return filename[0] != '.'
        && filename.indexOf('files') == -1
        && fs.statSync(path.join(repPath, filename)).isDirectory();
    });
    let courseDir;
    for (const i in coursesDirs ) {
      const dir = coursesDirs[i];
      // if (dir.match(/^(\d+)/gm).length == 1 && dir.match(/^(\d+)/gm)[0] == courseId)
      if (dir == courseId)
        courseDir = dir;
    }
    if (!otherIds[1]) return {
      path: path.join(repPath, courseDir),
      courseDirName: courseDir
    };
    // if (!otherIds[1]) return path.join(repPath, courseDir);

    let taskId = otherIds[1];

    let taskDirs = fs.readdirSync(path.join(repPath, courseDir));
    taskDirs = taskDirs.filter(filename => {
      return filename[0] != '.'
        && filename.indexOf('files') == -1
        && fs.statSync(path.join(repPath, courseDir, filename)).isDirectory();
    });
    let taskDir;
    for (const i in taskDirs) {
      const dir = taskDirs[i];
      if (dir.match(/^(\d+)/gm).length == 1 && dir.match(/^(\d+)/gm)[0] == taskId)
        taskDir = dir;
    }
    console.log(repPath, courseDir, taskDir)
    return {
      path: path.join(repPath, courseDir, taskDir),
      courseDirName: courseDir,
      taskDirName: taskDir
    }
    // return path.join(repPath, courseDir, taskDir)
  }
}

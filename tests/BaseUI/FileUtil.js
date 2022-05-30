const fs = require('fs');
const path = require('path');
const StringUtil = require('./StringUtil');

class FileUtil {
  static fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  static getCurrentDirectory() {
    return process.cwd();
  }

  // Create an entire directory path
  static createDirectory(directory) {
    if (!fs.existsSync(directory)) {
      const parentDirectory = this.getParentDirectory(directory);

      if (!fs.existsSync(parentDirectory)) {
        this.createDirectory(parentDirectory);
      }
      fs.mkdirSync(directory);
    }
  }

  // Gets the parent directory by the seperator
  // This works even if the directory does not exist
  static getParentDirectory(directory) {
    directory = StringUtil.trimEnd(directory, path.sep);
    const lastDirectory = directory.split(path.sep).pop();

    if (lastDirectory) {
      directory = StringUtil.trimEnd(directory, lastDirectory);
      directory = StringUtil.trimEnd(directory, path.sep);
    }
    return directory;
  }

  static pathCombine(...paths) {
    return path.join(...paths);
  }

  static readJsonFile(filePath) {
    const buffer = fs.readFileSync(filePath);
    return JSON.parse(buffer.toString());
  }

  static createFile(filePath, fileContent) {
    fs.writeFileSync(filePath, fileContent, function(err) {
      if (err) throw err;
      console.log(`File created: ${filePath} and page source saved!`);
    });
  }
}

module.exports = FileUtil;

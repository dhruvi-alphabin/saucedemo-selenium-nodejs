const FileUtil = require('./../BaseUI/FileUtil');
const TestConfig = require('./../BaseUI/TestConfig');

class ConfigFactory {
  static config;

  static getConfig() {
    if (this.config) {
      return this.config;
    }

    const filePath = FileUtil.pathCombine(FileUtil.getCurrentDirectory(), 'testconfig.json');

    if (FileUtil.fileExists(filePath)) {
      console.log(`Config file found at ${filePath}`);
      this.config = FileUtil.readJSONFile(filePath);
    } else {
      this.config = new TestConfig();
    }
    return this.config;
  }
}

module.exports = ConfigFactory;

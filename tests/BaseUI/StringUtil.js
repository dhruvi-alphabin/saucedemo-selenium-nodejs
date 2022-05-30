class StringUtil {
  static regExEscape(text) {
    return text.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
  }

  static trimEnd(text, textToTrim) {
    textToTrim = this.regExEscape(textToTrim);
    return text.replace(new RegExp('[' + textToTrim + ']+$'), '');
  }

  static getUniqueString() {
    let dateStr = new Date().toISOString();
    dateStr = dateStr.replace(/:/g, '-');
    const randomString = Math.round(Math.random() * 100000).toString();
    const result = `${dateStr}-${randomString}`;
    return result;
  }
}

module.exports = StringUtil;

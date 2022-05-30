class ProcessUtil {
  static async returnPromiseError(errorMessage) {
    console.log(errorMessage);

    return new Promise(function(resolve, reject) {
      reject(new Error(errorMessage));
    });
  }

  static async errorToPromiseError(error) {
    console.log(error.toString());

    return new Promise(function(resolve, reject) {
      reject(error);
    });
  }
}

module.exports = ProcessUtil;

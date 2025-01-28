import constants from '../constants.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Auth Failed",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });

    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stackTrace,
      });

    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });
    default:
      console.log("No error, all good.");
      break;
  }
};

export default errorHandler;

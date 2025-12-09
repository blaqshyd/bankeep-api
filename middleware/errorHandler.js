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
      break;

    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        code: res.statusCode,
        success: false,
        message: err.message,
        stackTrace: err.stackTrace,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        code: res.statusCode,
        success: false,
        message: err.message,
        error: {
        code: err.code || constants.SERVER_ERROR,
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
        stackTrace: err.stackTrace,
      });
      break;
    default:
      console.log("No error, all good.");
      next();
      break;
  }
};

export default errorHandler;

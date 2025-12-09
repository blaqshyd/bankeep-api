import pkg from 'apitoolkit-express';
import asyncHandler from 'express-async-handler';
import constants from "../constants.js";
const { ReportError } = pkg;

export const getHealthStatus = asyncHandler(async (req, res) => {
  try {
    res.status(constants.OK).json({
      code: res.statusCode,
      success: true,
      message: res.statusMessage,
      data: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Manually report errors to APItoolkit
    ReportError(error);
    // Let the error handler middleware handle the error
    throw error;
  }
}); 
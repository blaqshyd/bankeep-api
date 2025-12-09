import jwt from 'jsonwebtoken';
import constants from '../constants.js';

const BEARER_PREFIX = 'Bearer ';
const BEARER_LENGTH = BEARER_PREFIX.length;

const tokenValidator = async (req, res, next) => {
  try {
    // More explicit token extraction with better error handling
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(constants.UNAUTHORIZED).json({
        code: constants.UNAUTHORIZED,
        success: false,
        message: 'Authorization header is missing'
      });
    }

    const token = authHeader.startsWith(BEARER_PREFIX) 
      ? authHeader.slice(BEARER_LENGTH) 
      : authHeader;

    if (!token) {
      return res.status(constants.UNAUTHORIZED).json({
        code: constants.UNAUTHORIZED,
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Add token expiration check
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.exp && Date.now() >= verified.exp * 1000) {
      return res.status(constants.UNAUTHORIZED).json({
        code: constants.UNAUTHORIZED,
        success: false,
        message: 'Token has expired'
      });
    }

    req.user = verified;
    next();
  } catch (err) {
    // More specific error handling
    const message = err instanceof jwt.JsonWebTokenError 
      ? 'Invalid token format'
      : 'Token verification failed';

    res.status(constants.UNAUTHORIZED).json({
      code: constants.UNAUTHORIZED,
      success: false,
      message
    });
  }
};

export default tokenValidator; 
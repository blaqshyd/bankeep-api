import jwt from 'jsonwebtoken';
import constants from '../constants.js';

const tokenValidator = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(constants.UNAUTHORIZED).json({
        code: res.statusCode,
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(constants.UNAUTHORIZED).json({
      code: res.statusCode,
      success: false,
      message: 'Token verification failed, authorization denied'
    });
  }
};

export default tokenValidator; 
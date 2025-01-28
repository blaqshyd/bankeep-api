import express from 'express';
import tokenValidator from '../middleware/tokenValidator.js';

const router = express.Router();

// Protected route example
router.get('/', tokenValidator, async (req, res) => {
  try {
    // req.user contains the decoded token payload
    // Your protected route logic here
    res.json({ message: 'This is a protected route', userId: req.user.id });
  } catch (err) {
    res.status(constants.SERVER_ERROR).json({ error: err.message });
  }
}); 


export default router;
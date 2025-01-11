/*import express from 'express';
import { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile 
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile', getUserProfile);  // Changed to POST method
router.put('/profile/:userId', updateUserProfile);

export default router;*/

import express from 'express';
import { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  blockUser,
  unblockUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/profile', getUserProfile);
router.put('/profile/:userId', updateUserProfile);

// New admin routes
router.get('/all', getAllUsers);
router.delete('/:userId', deleteUser);
router.put('/:userId/block', blockUser);
router.put('/:userId/unblock', unblockUser);

export default router;
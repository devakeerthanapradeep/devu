import express from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  getUserRecipes,
  getUserFavorites
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/:id/recipes', protect, getUserRecipes);
router.get('/:id/favorites', protect, getUserFavorites);

export default router;

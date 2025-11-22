import express from 'express';
import { 
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  createRecipeReview,
  toggleFavoriteRecipe,
  getTopRecipes,
  getFavoriteRecipes
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Public routes
router.get('/', getRecipes);
router.get('/top', getTopRecipes);

// Protected routes
router.get('/favorites', protect, getFavoriteRecipes);

// Public route with param (must come after specific routes)
router.get('/:id', getRecipeById);
router.post('/', protect, upload.single('image'), createRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/reviews', protect, createRecipeReview);
router.post('/:id/favorite', protect, toggleFavoriteRecipe);

export default router;

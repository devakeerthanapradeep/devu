import express from 'express';
import { getMealPlans, addMealPlan, deleteMealPlan } from '../controllers/mealPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMealPlans)
  .post(protect, addMealPlan);

router.route('/:id')
  .delete(protect, deleteMealPlan);

export default router;

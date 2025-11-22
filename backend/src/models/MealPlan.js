import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  mealDate: {
    type: Date,
    required: true,
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    default: 'Dinner',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;

import MealPlan from '../models/MealPlan.js';

// @desc    Get current user's meal plans
// @route   GET /api/meal-plans
// @access  Private
export const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id })
      .sort({ mealDate: 1 })
      .populate('recipe', 'title imageUrl prepTime cookTime servings difficulty');

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal plans', error: error.message });
  }
};

// @desc    Add a recipe to meal plan
// @route   POST /api/meal-plans
// @access  Private
export const addMealPlan = async (req, res) => {
  try {
    const { recipeId, mealDate, mealType } = req.body;

    const plan = await MealPlan.create({
      user: req.user._id,
      recipe: recipeId,
      mealDate,
      mealType,
    });

    const populated = await plan.populate('recipe', 'title imageUrl prepTime cookTime servings difficulty');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Error adding to meal plan', error: error.message });
  }
};

// @desc    Remove a meal plan entry
// @route   DELETE /api/meal-plans/:id
// @access  Private
export const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Meal plan entry not found' });
    }

    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this meal plan entry' });
    }

    await plan.remove();
    res.json({ message: 'Meal plan entry removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal plan entry', error: error.message });
  }
};

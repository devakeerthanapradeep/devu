import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prepTime, cookTime, servings, difficulty, categories, imageUrl } = req.body;
    
    // Parse ingredients and categories if they're strings (from FormData or JSON)
    let parsedIngredients = ingredients;
    let parsedCategories = categories;
    
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        parsedIngredients = [];
      }
    }
    
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (e) {
        parsedCategories = [];
      }
    }
    
    const recipe = new Recipe({
      user: req.user._id,
      title,
      description,
      ingredients: parsedIngredients,
      instructions,
      prepTime: parseInt(prepTime) || 0,
      cookTime: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 1,
      difficulty,
      categories: parsedCategories,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : imageUrl || '',
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error: error.message });
  }
};

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const query = {};

    if (category) {
      query.categories = category.toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'rating') {
      sortOptions.averageRating = -1;
    }

    const recipes = await Recipe.find(query).sort(sortOptions).populate('user', 'fullName');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('ratings.user', 'fullName');

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, prepTime, cookTime, servings, difficulty, categories, imageUrl } = req.body;
    
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      if (recipe.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this recipe' });
      }

      // Parse ingredients and categories if they're strings
      let parsedIngredients = ingredients;
      let parsedCategories = categories;
      
      if (typeof ingredients === 'string') {
        try {
          parsedIngredients = JSON.parse(ingredients);
        } catch (e) {
          parsedIngredients = recipe.ingredients;
        }
      }
      
      if (typeof categories === 'string') {
        try {
          parsedCategories = JSON.parse(categories);
        } catch (e) {
          parsedCategories = recipe.categories;
        }
      }

      recipe.title = title || recipe.title;
      recipe.description = description || recipe.description;
      recipe.ingredients = parsedIngredients || recipe.ingredients;
      recipe.instructions = instructions || recipe.instructions;
      recipe.prepTime = prepTime ? parseInt(prepTime) : recipe.prepTime;
      recipe.cookTime = cookTime ? parseInt(cookTime) : recipe.cookTime;
      recipe.servings = servings ? parseInt(servings) : recipe.servings;
      recipe.difficulty = difficulty || recipe.difficulty;
      recipe.categories = parsedCategories || recipe.categories;
      
      if (req.file) {
        recipe.imageUrl = `/uploads/${req.file.filename}`;
      } else if (imageUrl !== undefined) {
        recipe.imageUrl = imageUrl;
      }

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error: error.message });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      if (recipe.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this recipe' });
      }

      await recipe.remove();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

// @desc    Add a recipe review
// @route   POST /api/recipes/:id/reviews
// @access  Private
export const createRecipeReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      const alreadyReviewed = recipe.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Recipe already reviewed' });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };

      recipe.ratings.push(review);
      recipe.numReviews = recipe.ratings.length;

      // Calculate average rating
      const total = recipe.ratings.reduce((acc, item) => item.rating + acc, 0);
      recipe.averageRating = total / recipe.ratings.length;

      await recipe.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding review', error: error.message });
  }
};

// @desc    Toggle favorite status for a recipe
// @route   POST /api/recipes/:id/favorite
// @access  Private
export const toggleFavoriteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (recipe && user) {
      // Initialize favorites array if it doesn't exist
      if (!user.favorites) {
        user.favorites = [];
      }
      
      const recipeIndex = user.favorites.findIndex(
        fav => fav && fav.toString() === recipe._id.toString()
      );
      
      if (recipeIndex === -1) {
        // Add to favorites
        user.favorites.push(recipe._id);
        await user.save();
        res.json({ isFavorited: true, favoritesCount: user.favorites.length });
      } else {
        // Remove from favorites
        user.favorites.splice(recipeIndex, 1);
        await user.save();
        res.json({ isFavorited: false, favoritesCount: user.favorites.length });
      }
    } else {
      res.status(404).json({ message: 'Recipe or user not found' });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(400).json({ message: 'Error toggling favorite', error: error.message });
  }
};

// @desc    Get top rated recipes
// @route   GET /api/recipes/top
// @access  Public
export const getTopRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .sort({ averageRating: -1 })
      .limit(3)
      .populate('user', 'fullName');
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top recipes', error: error.message });
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/recipes/favorites
// @access  Private
export const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'user',
        select: 'fullName'
      }
    });
    
    if (user) {
      // Ensure favorites is an array
      const favorites = user.favorites || [];
      res.json(favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorite recipes', error: error.message });
  }
};

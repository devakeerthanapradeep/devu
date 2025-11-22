import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// @desc    Get user's recipes
// @route   GET /api/users/:id/recipes
// @access  Private
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'fullName');
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};

// @desc    Get user's favorite recipes
// @route   GET /api/users/:id/favorites
// @access  Private
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'favorites',
      populate: {
        path: 'user',
        select: 'fullName'
      }
    });
    
    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

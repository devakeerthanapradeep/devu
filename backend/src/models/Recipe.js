import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
    },
    quantity: String,
    unit: String,
  }],
  instructions: {
    type: String,
    required: true,
  },
  prepTime: {
    type: Number, // in minutes
    default: 0,
  },
  cookTime: {
    type: Number, // in minutes
    default: 0,
  },
  servings: {
    type: Number,
    default: 1,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  categories: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  imageUrl: {
    type: String,
    default: '',
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the average rating when a new rating is added
recipeSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  this.updatedAt = new Date();
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;

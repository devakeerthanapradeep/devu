import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';
import { FormCard } from '@/components/ui/card-hover-effect';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

interface Rating {
  _id?: string;
  user: { fullName: string };
  rating: number;
  comment: string;
}

interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  imageUrl?: string;
  averageRating?: number;
  ratings?: Rating[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  user?: { _id: string; fullName: string };
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [mealDate, setMealDate] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [reviewError, setReviewError] = useState('');

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/api/recipes/${id}`);
      setRecipe(res.data);
      
      // Check if recipe is in favorites
      if (user) {
        try {
          const favRes = await api.get('/api/recipes/favorites');
          const favoriteIds = favRes.data.map((r: any) => r._id);
          setIsFavorite(favoriteIds.includes(id));
        } catch (err) {
          console.log('Could not fetch favorites');
        }
      }
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
      setError(err?.response?.data?.message || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.delete(`/api/recipes/${id}`);
      navigate('/recipes');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to favorite recipes');
      return;
    }
    try {
      const res = await api.post(`/api/recipes/${id}/favorite`);
      setIsFavorite(res.data.isFavorited);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to toggle favorite');
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please login to review');
      return;
    }
    setReviewError('');
    try {
      await api.post(`/api/recipes/${id}/reviews`, { rating, comment });
      setComment('');
      fetchRecipe();
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || 'Failed to add review');
    }
  };

  const addToMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add to meal plan');
      return;
    }
    if (!mealDate) {
      alert('Select a date');
      return;
    }
    try {
      await api.post('/api/meal-plans', {
        recipeId: id,
        mealDate,
        mealType,
      });
      setMealDate('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add to meal plan');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading">Loading recipe...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="error mb-4">{error}</div>
          <button className="primary" onClick={() => navigate('/recipes')}>
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="error mb-4">Recipe not found</div>
          <button className="primary" onClick={() => navigate('/recipes')}>
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const avgRating =
    recipe.ratings && recipe.ratings.length > 0
      ? (
          recipe.ratings.reduce((sum, r) => sum + r.rating, 0) /
          recipe.ratings.length
        ).toFixed(1)
      : 'N/A';

  const isOwner = user && recipe.user && recipe.user._id === user._id;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 overflow-y-auto">
      <div className="mb-4 flex justify-between items-center">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <span>&larr;</span> Back
        </button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Link 
              to={`/recipes/${recipe._id}/edit`} 
              className="icon-btn bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#2d6a4f] border-[#52b788]" 
              style={{ textDecoration: 'none' }}
            >
              ✏️ Edit Recipe
            </Link>
            <button 
              className="icon-btn bg-red-50 hover:bg-red-100 text-red-600 border-red-300" 
              onClick={handleDelete}
            >
              🗑️ Delete Recipe
            </button>
          </div>
        )}
      </div>
      
      <div className="detail-header">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="page-title">{recipe.title}</h1>
            <p className="page-subtitle mt-2">{recipe.description}</p>
            
            <div className="flex items-center gap-4 mt-4 text-[#40916c]">
              {recipe.prepTime && (
                <span>⏱️ Prep: {recipe.prepTime} min</span>
              )}
              {recipe.cookTime && (
                <span>🔥 Cook: {recipe.cookTime} min</span>
              )}
              {recipe.servings && (
                <span>🍽️ Servings: {recipe.servings}</span>
              )}
            </div>
          </div>
        </div>
        
        {recipe.imageUrl && (
          <img
            src={getImageUrl(recipe.imageUrl)}
            alt={recipe.title}
            className="w-full rounded-xl shadow-lg"
            style={{ maxHeight: '400px', objectFit: 'cover', marginBottom: '1.5rem' }}
            onError={handleImageError}
          />
        )}
        
        <div className="flex flex-wrap gap-3 items-center">
          <button 
            className={isFavorite ? "primary" : "secondary"} 
            onClick={toggleFavorite}
          >
            {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-[#d8f3dc] rounded-lg">
            <span className="text-yellow-500">⭐</span>
            <span className="text-[#2d6a4f] font-medium">
              {avgRating} ({recipe.ratings?.length || 0} reviews)
            </span>
          </div>
          
          {recipe.user && (
            <div className="text-[#40916c] text-sm">
              By: <span className="font-medium">{recipe.user.fullName}</span>
            </div>
          )}
        </div>
      </div>

      <FormCard className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b4332] mb-4">📝 Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients?.map((ing, idx) => (
            <li key={`${ing.name}-${idx}`} className="flex items-center gap-2 text-[#2d6a4f]">
              <span className="text-[#52b788]">•</span>
              <span className="font-medium">{ing.quantity} {ing.unit}</span>
              <span>{ing.name}</span>
            </li>
          ))}
        </ul>
      </FormCard>

      <FormCard className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b4332] mb-4">👨‍🍳 Instructions</h2>
        <p className="whitespace-pre-wrap text-[#40916c] leading-relaxed">
          {recipe.instructions}
        </p>
      </FormCard>

      <FormCard className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b4332] mb-4">⭐ Reviews & Ratings</h2>
        {user && (
          <form onSubmit={submitReview} className="form" style={{ marginBottom: '1.5rem' }}>
            {reviewError && <p className="error">{reviewError}</p>}
            <label>
              Rating
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ cursor: 'pointer' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </label>
            <label>
              Comment
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                placeholder="Share your thoughts about this recipe..."
              />
            </label>
            <button type="submit">Submit Review</button>
          </form>
        )}
        
        {recipe.ratings && recipe.ratings.length > 0 ? (
          <div>
            {recipe.ratings.map((r, idx) => (
              <div key={r._id || idx} className="review-item">
                <div className="review-header">
                  <span className="review-author">{r.user.fullName}</span>
                  <span className="review-rating">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#64748b]">No reviews yet. Be the first to review!</p>
        )}
      </FormCard>

      <FormCard className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b4332] mb-4">📅 Add to Meal Plan</h2>
        <form onSubmit={addToMealPlan} className="form">
          <label>
            Date
            <input
              type="date"
              value={mealDate}
              onChange={(e) => setMealDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </label>
          <label>
            Meal Type
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="Breakfast">🌅 Breakfast</option>
              <option value="Lunch">☀️ Lunch</option>
              <option value="Dinner">🌙 Dinner</option>
              <option value="Snack">🍿 Snack</option>
            </select>
          </label>
          <button type="submit" className="primary">
            📅 Add to Meal Plan
          </button>
        </form>
      </FormCard>
    </div>
  );
};

export default RecipeDetailPage;

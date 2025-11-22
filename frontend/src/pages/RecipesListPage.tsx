import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { getImageUrl } from '../utils/imageHelper';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  averageRating?: number;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

const RecipesListPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/api/recipes');
        setRecipes(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="w-full">
      <div className="page-header">
        <h1 className="page-title">All Recipes</h1>
        <p className="page-subtitle">Discover delicious recipes from our community</p>
      </div>
      
      {recipes.length === 0 && (
        <div className="card">
          <p>No recipes found. Be the first to share a recipe!</p>
        </div>
      )}
      
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card recipe-card group">
            {recipe.imageUrl && (
              <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                <img
                  src={getImageUrl(recipe.imageUrl)}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h3>{recipe.title}</h3>
            <p className="text-sm mb-3">{recipe.description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#d8f3dc]">
              {recipe.averageRating != null && (
                <div className="rating flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm">{recipe.averageRating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-xs text-[#40916c]">
                {recipe.prepTime && (
                  <span>⏱️ {recipe.prepTime}m</span>
                )}
                {recipe.servings && (
                  <span>🍽️ {recipe.servings}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipesListPage;

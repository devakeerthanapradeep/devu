import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';
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
  difficulty?: string;
}

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/api/recipes/favorites');
        setRecipes(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (!user) return (
    <div className="card">
      <p style={{ color: '#64748b' }}>Please login to view favorites.</p>
    </div>
  );
  if (loading) return <div className="loading">Loading favorites...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="w-full">
      <div className="page-header">
        <h1 className="page-title">My Favorites</h1>
        <p className="page-subtitle">
          {recipes.length > 0
            ? `You have ${recipes.length} favorite recipe${recipes.length !== 1 ? 's' : ''}`
            : 'Save your favorite recipes for quick access'}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💔</p>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>No favorites yet.</p>
          <Link to="/recipes" className="primary" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block' }}>
            Explore Recipes
          </Link>
        </div>
      ) : (
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
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❤️</span>
                  <span className="text-sm text-[#40916c]">Favorited</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-[#40916c]">
                  {recipe.prepTime && (
                    <span>⏱️ {recipe.prepTime}m</span>
                  )}
                  {recipe.difficulty && (
                    <span className="px-2 py-1 bg-[#d8f3dc] rounded-full">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
              </div>
              
              {recipe.averageRating != null && recipe.averageRating > 0 && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-[#40916c]">{recipe.averageRating.toFixed(1)}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}    </div>
  );
};

export default FavoritesPage;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';
import { FormCard } from '@/components/ui/card-hover-effect';

interface RecipeFormPageProps {
  mode: 'create' | 'edit';
}

const RecipeFormPage: React.FC<RecipeFormPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('30');
  const [cookTime, setCookTime] = useState('30');
  const [servings, setServings] = useState('4');
  const [difficulty, setDifficulty] = useState('Easy');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchRecipe = async () => {
        try {
          const res = await api.get(`/api/recipes/${id}`);
          const r = res.data;
          setTitle(r.title);
          setDescription(r.description || '');
          setInstructions(r.instructions || '');
          setPrepTime(r.prepTime?.toString() || '30');
          setCookTime(r.cookTime?.toString() || '30');
          setServings(r.servings?.toString() || '4');
          setDifficulty(r.difficulty || 'Easy');
          setImageUrl(r.imageUrl || '');
          setIngredientsText(
            (r.ingredients || [])
              .map((ing: any) => `${ing.quantity || ''} ${ing.unit || ''} ${ing.name || ''}`.trim())
              .join('\n'),
          );
        } catch (err: any) {
          setError(err?.response?.data?.message || 'Failed to load recipe');
        }
      };
      fetchRecipe();
    }
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(' ');
        const quantity = parts.shift() || '';
        const unit = parts.shift() || '';
        const name = parts.join(' ') || line;
        return { name: name || line, quantity, unit };
      });

    try {
      let response;
      
      // Use FormData if there's an image file, otherwise use JSON
      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('instructions', instructions);
        formData.append('prepTime', prepTime);
        formData.append('cookTime', cookTime);
        formData.append('servings', servings);
        formData.append('difficulty', difficulty);
        formData.append('categories', JSON.stringify([]));
        formData.append('image', imageFile);
        
        if (mode === 'create') {
          response = await api.post('/api/recipes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else if (mode === 'edit' && id) {
          response = await api.put(`/api/recipes/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Use JSON if no image file (for URL-based images)
        const recipeData = {
          title,
          description,
          ingredients: JSON.stringify(ingredients),
          instructions,
          prepTime: parseInt(prepTime) || 0,
          cookTime: parseInt(cookTime) || 0,
          servings: parseInt(servings) || 1,
          difficulty,
          categories: JSON.stringify([]),
          imageUrl
        };
        
        if (mode === 'create') {
          response = await api.post('/api/recipes', recipeData);
        } else if (mode === 'edit' && id) {
          response = await api.put(`/api/recipes/${id}`, recipeData);
        }
      }
      
      navigate('/recipes');
    } catch (err: any) {
      console.error('Recipe save error:', err?.response?.data);
      setError(err?.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">{mode === 'create' ? 'Create Recipe' : 'Edit Recipe'}</h1>
        <p className="page-subtitle">
          {mode === 'create' ? 'Share your delicious recipe with the community' : 'Update your recipe details'}
        </p>
      </div>
      
      <FormCard>
        <h2 className="text-2xl font-bold text-[#1b4332] mb-6">Recipe Details</h2>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Ingredients
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Enter one ingredient per line&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 large eggs"
            rows={5}
          />
          <small className="text-[#40916c] text-xs mt-1 block">
            Format: [quantity] [unit] [ingredient name] - one per line
          </small>
        </label>
        <label>
          Instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows={6}
          />
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label>
            Prep Time (minutes)
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              min="0"
            />
          </label>
          
          <label>
            Cook Time (minutes)
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              min="0"
            />
          </label>
          
          <label>
            Servings
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
            />
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Difficulty
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
          
          <div>
            <label>
              Recipe Image
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                <p className="text-xs text-[#40916c]">Upload an image file</p>
              </div>
            </label>
            
            {!imageFile && (
              <label className="mt-2 block">
                Or Image URL
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!imageFile}
                />
              </label>
            )}
          </div>
        </div>
        
        {(imagePreview || imageUrl) && (
          <div className="mt-4">
            <label>Image Preview</label>
            <img
              src={imagePreview || imageUrl}
              alt="Recipe preview"
              className="w-full max-h-64 object-cover rounded-lg border border-[#b7e4c7]"
            />
            {imageFile && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove image
              </button>
            )}
          </div>
        )}
        
        <button type="submit" disabled={loading} className="primary">
          {loading ? 'Saving...' : mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
        </button>
      </form>
      </FormCard>
    </div>
  );
};

export default RecipeFormPage;

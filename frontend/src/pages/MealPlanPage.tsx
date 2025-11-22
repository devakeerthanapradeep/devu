import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';

interface MealPlanEntry {
  _id: string;
  mealDate: string;
  mealType: string;
  recipe: {
    _id: string;
    title: string;
    imageUrl?: string;
  };
}

const MealPlanPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MealPlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/meal-plans');
        setEntries(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load meal plan');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [user]);

  const removeEntry = async (id: string) => {
    try {
      await api.delete(`/api/meal-plans/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to remove meal');
    }
  };

  if (!user) return (
    <div className="card">
      <p style={{ color: '#64748b' }}>Please login to view your meal plan.</p>
    </div>
  );
  if (loading) return <div className="loading">Loading meal plan...</div>;
  if (error) return <div className="error">{error}</div>;

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.mealDate).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, MealPlanEntry[]>);

  const mealTypeIcons: Record<string, string> = {
    Breakfast: '🌅',
    Lunch: '☀️',
    Dinner: '🌙',
    Snack: '🍿'
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Meal Plan</h1>
        <p className="page-subtitle">
          {entries.length > 0
            ? `You have ${entries.length} meal${entries.length !== 1 ? 's' : ''} planned`
            : 'Plan your meals for the week ahead'}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>No meals planned yet.</p>
          <Link to="/recipes" className="primary" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', display: 'inline-block' }}>
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div>
          {Object.entries(groupedEntries).sort().map(([date, dayEntries]) => (
            <div key={date} className="detail-section" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '1rem' }}>
                📆 {date}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dayEntries.map((e) => (
                  <div
                    key={e._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'rgba(15, 23, 42, 0.3)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(51, 65, 85, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {mealTypeIcons[e.mealType] || '🍴'}
                      </span>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {e.mealType}
                        </div>
                        <Link
                          to={`/recipes/${e.recipe._id}`}
                          style={{ color: '#f1f5f9', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {e.recipe.title}
                        </Link>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEntry(e._id)}
                      className="icon-btn"
                      style={{ padding: '0.4rem 0.8rem' }}
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlanPage;

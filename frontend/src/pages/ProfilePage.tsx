import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';
import { FormCard } from '@/components/ui/card-hover-effect';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/profile');
        setFullName(res.data.fullName || '');
        setBio(res.data.bio || '');
        setAvatar(res.data.avatar || '');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/api/users/profile', {
        fullName,
        bio,
        avatar,
      });
      setSuccess('Profile updated');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <FormCard>
        {avatar && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src={avatar}
              alt="Avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px solid rgba(34, 197, 94, 0.3)',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          
          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </label>
          
          <label>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </label>
          
          <label>
            Avatar URL
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
          
          <button type="submit" className="primary">
            💾 Save Changes
          </button>
        </form>
        
        <div className="btn-group" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(51, 65, 85, 0.3)' }}>
          <button type="button" onClick={logout} className="secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
            🚪 Logout
          </button>
        </div>
      </FormCard>
    </div>
  );
};

export default ProfilePage;

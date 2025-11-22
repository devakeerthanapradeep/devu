import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './styles.css';
import { useAuth } from './state/AuthContext';
import { FloatingNavbar } from './components/FloatingNavbar';
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation';
import SplashScreen from './components/SplashScreen';
import FloatingFoodElements from './components/FloatingFoodElements';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RecipeFormPage from './pages/RecipeFormPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import MealPlanPage from './pages/MealPlanPage';
import NavbarDemoPage from './pages/NavbarDemoPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-main">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const App: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false);
  const [previousUser, setPreviousUser] = useState(user);
  
  const hideNavbarPaths = ['/login', '/register'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  // Show splash screen when user logs in
  useEffect(() => {
    if (!previousUser && user) {
      // User just logged in
      setShowSplash(true);
    }
    setPreviousUser(user);
  }, [user, previousUser]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {/* Show splash screen when needed */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(240, 253, 244)"
        gradientBackgroundEnd="rgb(187, 247, 208)"
        firstColor="82, 183, 136"
        secondColor="64, 145, 108"
        thirdColor="45, 106, 79"
        fourthColor="116, 198, 157"
        fifthColor="149, 213, 178"
        pointerColor="82, 183, 136"
        size="80%"
        blendingValue="overlay"
        interactive={true}
        containerClassName="fixed"
      >
        {/* Add floating food elements to the background */}
        {!showSplash && <FloatingFoodElements />}
        
        <div className="app-shell relative z-10">
          {/* Floating Navbar - shows on all pages except login/register */}
          {!shouldHideNavbar && !showSplash && <FloatingNavbar />}
        
        <main className="app-main" style={{ paddingTop: shouldHideNavbar ? '0' : '5rem' }}>
          <Routes>
          <Route path="/" element={<Navigate to="/recipes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipes" element={<RecipesListPage />} />
          <Route
            path="/recipes/new"
            element={(
              <ProtectedRoute>
                <RecipeFormPage mode="create" />
              </ProtectedRoute>
            )}
          />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route
            path="/recipes/:id/edit"
            element={(
              <ProtectedRoute>
                <RecipeFormPage mode="edit" />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/favorites"
            element={(
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/meal-plan"
            element={(
              <ProtectedRoute>
                <MealPlanPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/navbar-demo" element={<NavbarDemoPage />} />
          <Route path="*" element={<Navigate to="/recipes" replace />} />
        </Routes>
      </main>
    </div>
    </BackgroundGradientAnimation>
    </>
  );
};

export default App;

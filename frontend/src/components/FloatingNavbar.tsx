import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/state/AuthContext";

export function FloatingNavbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={cn(
        "fixed top-4 inset-x-0 max-w-fit mx-auto z-50",
        className
      )}
    >
      <Menu setActive={setActive}>
        <Link to="/recipes" className="text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-2 font-semibold transition-colors">
          <span>🍴</span> Recipe Share
        </Link>
        
        <MenuItem setActive={setActive} active={active} item="Recipes">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/recipes">📚 All Recipes</HoveredLink>
            {user && (
              <>
                <HoveredLink href="/recipes/new">➕ Create Recipe</HoveredLink>
                <HoveredLink href="/favorites">❤️ My Favorites</HoveredLink>
              </>
            )}
          </div>
        </MenuItem>

        {user && (
          <MenuItem setActive={setActive} active={active} item="Planning">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/meal-plan">📅 Meal Plan</HoveredLink>
              <HoveredLink href="/favorites">❤️ Saved Recipes</HoveredLink>
            </div>
          </MenuItem>
        )}

        {user ? (
          <MenuItem setActive={setActive} active={active} item="Account">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/profile">👤 My Profile</HoveredLink>
              <button
                onClick={handleLogout}
                className="text-left text-gray-600 hover:text-[#40916c] transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </MenuItem>
        ) : (
          <MenuItem setActive={setActive} active={active} item="Account">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/login">🔒 Login</HoveredLink>
              <HoveredLink href="/register">✍️ Register</HoveredLink>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

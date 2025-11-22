import React from 'react';
import NavbarDemo from '@/components/navbar-menu-demo';

const NavbarDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <NavbarDemo />
      <div className="container mx-auto px-4 py-20 mt-20">
        <h1 className="text-4xl font-bold text-center mb-8 text-neutral-900 dark:text-neutral-100">
          Advanced Navbar Component Demo
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          This navbar features hover-activated dropdowns with smooth animations powered by Framer Motion.
          Try hovering over the menu items to see the interactive dropdown menus.
        </p>
      </div>
    </div>
  );
};

export default NavbarDemoPage;

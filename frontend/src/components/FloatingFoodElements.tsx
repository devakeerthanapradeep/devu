import React from 'react';

const FloatingFoodElements: React.FC = () => {
  // Static food icons placed around the background
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Corners */}
      <div className="absolute top-8 left-8 text-6xl opacity-30 select-none">
        🍕
      </div>
      <div className="absolute top-10 right-10 text-6xl opacity-30 select-none">
        🍜
      </div>
      <div className="absolute bottom-10 left-12 text-6xl opacity-30 select-none">
        🥗
      </div>
      <div className="absolute bottom-8 right-8 text-6xl opacity-30 select-none">
        �
      </div>

      {/* Mid background elements */}
      <div className="absolute top-1/3 left-1/4 text-7xl opacity-20 select-none">
        🍔
      </div>
      <div className="absolute top-1/2 right-1/4 text-7xl opacity-20 select-none">
        🌮
      </div>
      <div className="absolute bottom-1/3 left-1/3 text-7xl opacity-20 select-none">
        🍳
      </div>
      <div className="absolute bottom-1/2 right-1/3 text-7xl opacity-20 select-none">
        🍣
      </div>
    </div>
  );
};

export default FloatingFoodElements;

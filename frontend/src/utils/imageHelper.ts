// Helper function to get the full image URL
export const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the backend URL
  // Using a fixed URL for now, can be made configurable later
  const backendUrl = 'http://localhost:5000';
  return `${backendUrl}${imageUrl}`;
};

// Helper function to handle image loading errors
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  // Hide the image if it fails to load
  img.style.display = 'none';
  // Or you could set a default image
  // img.src = '/default-recipe-image.jpg';
};

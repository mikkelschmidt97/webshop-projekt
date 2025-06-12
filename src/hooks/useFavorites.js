import useLocalStorage from "./useLocalStorage";

export default function useFavorites() {
  // Use the same useLocalStorage hook that Header uses
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  // Function to add a product to favorites
  const addToFavorites = (product) => {
    setFavorites(prevFavorites => {
      // Check if product is already in favorites
      const isAlreadyFavorite = prevFavorites.some(fav => fav.id === product.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites; // Don't add duplicates
      }
      
      return [...prevFavorites, product];
    });
  };

  // Function to remove a product from favorites
  const removeFromFavorites = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => fav.id !== productId)
    );
  };

  // Function to toggle favorite status
  const toggleFavorite = (product) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.id === product.id);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Function to check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length
  };
}
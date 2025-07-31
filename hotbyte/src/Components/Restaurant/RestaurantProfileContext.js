import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantProfileContext = createContext();

export const RestaurantProfileProvider = ({ children }) => {
  const [restaurantProfile, setRestaurantProfile] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    openingHours: '',
    address: '',
    description: '',
    deliveryRadius: '',
    minOrderAmount: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('restaurantProfile');
    if (savedData) {
      setRestaurantProfile(JSON.parse(savedData));
    }
  }, []);

  // ✅ Updated update function with validation
  const updateRestaurantProfile = (updatedProfile) => {
    if (!updatedProfile.restaurantName || !updatedProfile.email) {
      console.warn("Incomplete profile data");
      return;
    }
    setRestaurantProfile(updatedProfile);
    localStorage.setItem('restaurantProfile', JSON.stringify(updatedProfile));
  };

  // ✅ Reset function
  const resetRestaurantProfile = () => {
    const emptyProfile = {
      restaurantName: '',
      email: '',
      phone: '',
      openingHours: '',
      address: '',
      description: '',
      deliveryRadius: '',
      minOrderAmount: ''
    };
    setRestaurantProfile(emptyProfile);
    localStorage.removeItem('restaurantProfile');
  };

  return (
    <RestaurantProfileContext.Provider value={{
      restaurantProfile,
      setRestaurantProfile: updateRestaurantProfile,
      resetRestaurantProfile // ✅ Expose reset function to components
    }}>
      {children}
    </RestaurantProfileContext.Provider>
  );
};

// Hook to use in components
export const useRestaurantProfile = () => useContext(RestaurantProfileContext);

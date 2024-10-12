// useImageAnimation.js
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useImageAnimation = () => {
  // Create animated value references
  const leftImageScale = useRef(new Animated.Value(0)).current;
  const centeredImageScale = useRef(new Animated.Value(0)).current;

  // Function to start the animation
  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(leftImageScale, {
        toValue: 1, // Target scale
        duration: 1500, // Animation duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(centeredImageScale, {
        toValue: 1, // Target scale
        duration: 1500, // Animation duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();
  };

  // Start the animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startAnimation();
    }, 700); // Delay before starting the animation

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  // Return the animated values for use in the component
  return { leftImageScale, centeredImageScale };
};

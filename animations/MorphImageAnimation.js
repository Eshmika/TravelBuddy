import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function MorphImageAnimation({
  imageSource,
  initialPosition,
  targetPosition,
  initialScale,
  targetScale,
  initialRotation,
  targetRotation,
  style,
  duration = 2000, // Default duration for the animation
}) {
  // Animated values for position, scale, and rotation
  const imagePosition = useRef(new Animated.ValueXY(initialPosition)).current;
  const imageScale = useRef(new Animated.Value(initialScale)).current;
  const imageRotation = useRef(new Animated.Value(initialRotation)).current;

  // Function to start the morphing animation
  const startMorphAnimation = () => {
    Animated.parallel([
      // Animate the image position
      Animated.timing(imagePosition, {
        toValue: targetPosition,
        duration,
        useNativeDriver: true,
      }),
      // Animate the image scale
      Animated.timing(imageScale, {
        toValue: targetScale,
        duration,
        useNativeDriver: true,
      }),
      // Animate the image rotation
      Animated.timing(imageRotation, {
        toValue: targetRotation,
        duration,
        easing: Easing.linear, // Linear easing for smooth rotation
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Start the animation on component mount
  useEffect(() => {
    startMorphAnimation();
  }, []);

  // Interpolating the rotation value to degrees
  const rotationInterpolation = imageRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Change rotation range as per need
  });

  return (
    <Animated.Image
      source={imageSource}
      style={[
        style,
        {
          transform: [
            { translateX: imagePosition.x },
            { translateY: imagePosition.y },
            { scale: imageScale },
            { rotate: rotationInterpolation },
          ],
        },
      ]}
    />
  );
}

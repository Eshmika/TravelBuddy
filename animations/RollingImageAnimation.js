import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function RollingImageAnimation({ imageSource, initialPosition, targetPosition, style }) {
  // Animated values for position and rotation
  const leftImagePosition = useRef(new Animated.ValueXY(initialPosition)).current;
  const leftImageRotation = useRef(new Animated.Value(0)).current;

  // Function to start the animation
  const startRollingAnimation = () => {
    Animated.parallel([
      // Move the image to the target position
      Animated.timing(leftImagePosition, {
        toValue: targetPosition, // Target position for the image
        duration: 2000,
        useNativeDriver: true,
      }),
      // Rotate the image while moving
      Animated.timing(leftImageRotation, {
        toValue: 1, // Rotate 360 degrees
        duration: 2000,
        easing: Easing.linear, // Linear easing for continuous rotation
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Start animation when the component mounts
  useEffect(() => {
    startRollingAnimation();
  }, []);

  // Interpolating the rotation value from 0 to 1 to degrees
  const rotationInterpolation = leftImageRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={imageSource}
      style={[
        style,
        {
          transform: [
            { translateX: leftImagePosition.x },
            { translateY: leftImagePosition.y },
            { rotate: rotationInterpolation },
          ],
        },
      ]}
    />
  );
}

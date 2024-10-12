// src/components/AnimatedText.js

import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Animated } from "react-native";

const AnimatedText = ({ title, description }) => {
  const translateY = useRef(new Animated.Value(250)).current; // Start below the screen
  const scale = useRef(new Animated.Value(0)).current; // Start from scale 0

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0, // Move to its original position
        duration: 2000, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(scale, {
        toValue: 1, // Scale to original size
        duration: 2000, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();
  }, [translateY, scale]);

  return (
    <Animated.View style={[styles.titleContainer, { transform: [{ translateY }, { scale }] }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginVertical: 20, // Add some spacing around the container
    paddingHorizontal: 10, // Add horizontal padding
    marginTop: 200, // Space above the title
  },
  title: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: "bold", // Make title bold
    color: "black", // Title color
    marginTop: 10, // Space above the title
    marginBottom: 15, // Space below the title
    textAlign: "center", // Center align the description
  },
  description: {
    fontSize: 16, // Adjust font size as needed
    color: "#666", // Description color
    textAlign: "center", // Center align the description
    fontFamily: "Roboto", // Use custom font for the description
  },
});

export default AnimatedText;

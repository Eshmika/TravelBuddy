import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";

import { useImageAnimation } from "../../animations/useImageAnimation"; // Import the custom hook
import AnimatedText from "../../animations/OnBoard01Text"; // Import the AnimatedText component
import AnimatedButton from "../../animations/OnBoardButton"; // Import the AnimatedButton component

export default function OnBoard01({ navigation }) {
  // Get the animated values from the custom hook
  const { leftImageScale, centeredImageScale } = useImageAnimation();

  return (
    <View style={styles.container}>
      {/* Left Image with animation */}
      <Animated.Image
        source={require("../../assets/images/OnBoard02.png")}
        style={[styles.leftImage, { transform: [{ scale: leftImageScale }] }]}
      />
      {/* Centered Image with animation */}
      <Animated.Image
        source={require("../../assets/images/OnBoard01.png")}
        style={[
          styles.centeredImage,
          { transform: [{ scale: centeredImageScale }] },
        ]}
      />

      <AnimatedText
        title="Find Trusted Advisor"
        description="A Health Advisor is a professional who provides personalized guidance and maintaining and improving overall health and wellness."
      />

      <AnimatedButton navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Keep content at the top
    alignItems: "center", // Center items horizontally
    backgroundColor: "#ffffff", // Example background color
    position: "relative", // Position relative for absolute positioning of images
  },
  centeredImage: {
    width: 350,
    height: 350,
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -177,
    marginTop: 140,
    borderRadius: 175, // Rounded corners (half of the width for a circle)
    borderWidth: 3, // Border thickness
    borderColor: "#eee", // Border color matching your preferred color
    shadowColor: "black", // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset (to give depth)
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 10, // Blur radius for shadow
    elevation: 10, // Shadow effect on Android (uses elevation)
    // Gradient overlay using backgroundColor
    backgroundColor: "#eee",
    // Adding transformation for hover or interactive effects
    transform: [{ scale: 1 }, { rotate: "5deg" }], // Slight rotation for a dynamic effect
    // Add some text or content inside the image (like an icon or label)
    justifyContent: "center",
    alignItems: "center",
  },
  leftImage: {
    width: 370, // Set width for the left image
    height: 370, // Set height for the left image
    marginLeft: -70, // Adjust this value as needed to position it
    marginTop: -30, // Adjust this value as needed to position it
    alignSelf: "flex-start", // Align this image to the start (left side)
    borderRadius: 175, // Rounded corners (half of the width for a circle)
    borderWidth: 3, // Border thickness
    borderColor: "#eee", // Border color matching your preferred color
    shadowColor: "black", // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset (to give depth)
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 10, // Blur radius for shadow
    elevation: 10, // Shadow effect on Android (uses elevation)
  },
  
});

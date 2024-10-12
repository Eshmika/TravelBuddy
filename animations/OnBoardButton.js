import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity, Text, View } from "react-native";

const OnBoardButton = ({ navigation }) => {
  const translateYGetStarted = useRef(new Animated.Value(300)).current; // Start below the screen
  const translateYSkip = useRef(new Animated.Value(300)).current; // Start below the screen
  const buttonScale = useRef(new Animated.Value(1)).current; // Scale for the Get Started button

  useEffect(() => {
    // Animate buttons into view
    Animated.parallel([
      Animated.timing(translateYGetStarted, {
        toValue: 0, // Move to its original position
        duration: 2000, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(translateYSkip, {
        toValue: 0, // Move to its original position
        duration: 2000, // Duration of the animation
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();

    // Start pulsing animation for the Get Started button
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true, // Using native driver for scaling
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true, // Using native driver for scaling
        }),
      ])
    );
    scaleAnimation.start();

    return () => scaleAnimation.stop(); // Cleanup animation on unmount
  }, [translateYGetStarted, translateYSkip]);

  return (
    <View>
      <Animated.View style={{ transform: [{ translateY: translateYGetStarted }, { scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate("Travel Guide Onboard")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: translateYSkip }] }}>
        <TouchableOpacity onPress={() => navigation.navigate("LogIn")}>
          <Text style={styles.SkipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: "#39170C", // Button background color
    paddingVertical: 18, // Vertical padding for the button
    paddingHorizontal: 90, // Horizontal padding for the button
    borderRadius: 10, // Rounded corners
    elevation: 5, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow blur radius for iOS
    alignItems: "center", // Center the text inside the button
    marginTop: 30, // Space above the button
  },
  buttonText: {
    fontSize: 18, // Font size of the button text
    fontWeight: "bold", // Bold text
    color: "#ffffff", // Text color
    textAlign: "center", // Center align the text
  },
  SkipText: {
    fontSize: 15, // Font size of the skip text
    fontWeight: "bold", // Bold text
    color: "#666", // Text color
    textAlign: "center", // Center align the text
    marginTop: 20, // Space above the skip text
  },
});

export default OnBoardButton;

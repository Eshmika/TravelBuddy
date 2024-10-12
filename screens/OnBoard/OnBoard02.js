import React from "react";
import { StyleSheet, View } from "react-native";
import MorphImageAnimation from "../../animations/MorphImageAnimation";

export default function OnBoard02() {
  return (
    <View style={styles.container}>
      <MorphImageAnimation
        imageSource={require("../../assets/images/OnBoard02.png")}
        initialPosition={{ x: -270, y: -350 }}  // Initial position (from OnBoard01)
        targetPosition={{ x: 100, y: 500 }}   // Final position (right-down corner)
        initialScale={0}  // Initial scale (smaller)
        targetScale={1}     // Target scale (normal size)
        initialRotation={0} // Start with no rotation
        targetRotation={1}  // Rotate once (360 degrees)
        style={styles.leftImage}
        duration={2000} // Animation duration
      />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  leftImage: {
    width: 370,
    height: 370,
    position: 'absolute',
    left  : 50,
    top   : 50,
  },
});

import { StyleSheet, ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const GoalHomeScreen = ({ navigation }) => {
  return (
    <>
      <ImageBackground
        source={require('../../assets/Goal/Goal/bg1.jpeg')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <Text style={styles.heading}>Explore The World By Setting a Goal</Text>

          <Text style={styles.description}>
            Set, track, and complete your travel goals with our app. 
            Whether it's visiting iconic landmarks, exploring hidden gems, 
            or achieving personal milestones, this feature helps you stay 
            motivated and celebrate your journey.
          </Text>
        </View>

        {/* Custom Button to Set a Goal */}
        <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('Map')}
    activeOpacity={0.8} // Gives feedback on press
>
    <Text style={styles.buttonText}>Completing a Goal</Text>
</TouchableOpacity>

      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns content to the top of the screen
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay
    padding: 10,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    width: '100%', // Full width
    height: '40%', // Adjust height as needed
    justifyContent: 'center', // Center content vertically in the box
    alignItems: 'center',
    marginTop: 0, // No margin on top
  },
  heading: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20, // Space between heading and description
  },
  description: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 26, // Improves readability
    padding: 20,
  },
  button: {
    backgroundColor: '#5e4f34', // Base color
    padding: 15,
    borderRadius: 20, // Increased border radius for a rounder appearance
    width: '80%', // Keep the width to give some space on the sides
    alignItems: 'center', // Center text inside the button
    marginTop: 50, // Adjust margin to your preference
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur
    elevation: 5, // For Android shadow
    borderWidth: 2, // Optional border for added detail
    borderColor: '#4a3b28', // Slightly darker border color
},

  buttonText: {
    color: '#fff', // White text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalHomeScreen;

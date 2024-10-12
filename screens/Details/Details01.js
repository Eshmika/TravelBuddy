import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Details01({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Card View for the back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.card}>
        <Icon name="arrow-circle-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Doctor Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Background color
  },
  card: {
    backgroundColor: '#fff', // Card background color
    width: 50, // Increased card width
    height: 50, // Increased card height
    borderRadius: 10, // Rounded corners for the card
    marginTop: 68, // Positioning the card
    marginLeft: 20, // Adjust positioning horizontally
    elevation: 5, // Shadow effect for the card (Android)
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center', // Center the icon inside the card
    alignItems: 'center', // Align the icon in the center
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: -20,
    paddingLeft: 120,
  },
});

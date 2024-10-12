import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, FlatList } from 'react-native';
import { db } from '../firebaseConfig'; // Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

const Home = ({ navigation }) => {
  const [places, setPlaces] = useState([]); // State to store fetched places

  // Fetch places data from Firestore
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesCollection = collection(db, 'Places');
        const placesSnapshot = await getDocs(placesCollection);
        const placesList = placesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaces(placesList);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/bg.jpeg')} // Background image
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* App Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>TRAVEL BUDDY</Text>
          <Text style={styles.subtitle}>See the world, Seamlessly</Text>
        </View>

        {/* Horizontal Button Container */}
        <View style={styles.buttonContainer}>
          {/* Button 1: My Journals */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Goal')}
          >
            <Image
              source={require('../assets/goal.jpeg')} // Journal icon
              style={styles.icon}
            />
            <Text style={styles.cardText}>Travel Goals</Text>
          </TouchableOpacity>

          {/* Button 2: Add New Journal */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HealthAdvisorHomeScreen')}
          >
            <Image
              source={require('../assets/health.jpeg')} // Add journal icon
              style={styles.icon}
            />
            <Text style={styles.cardText}>Health Advisor</Text>
          </TouchableOpacity>

          {/* Button 3: Templates */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('JournalHome')}
          >
            <Image
              source={require('../assets/journal.jpeg')} // Templates icon
              style={styles.icon}
            />
            <Text style={styles.cardText}>Travel Journal</Text>
          </TouchableOpacity>

          {/* Button 4: Profile */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Travel Guide Home')}
          >
            <Image
              source={require('../assets/guide.jpeg')} // Profile icon
              style={styles.icon}
            />
            <Text style={styles.cardText}>Travel Guide</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle1}> Discover </Text>

        {/* Places List */}
        <FlatList
          data={places}
          renderItem={({ item }) => (
            <View style={styles.placeCard}>
              <Image
                source={{ uri: item.image }} // Assuming imageUrl is a field in the places collection
                style={styles.placeImage}
              />
              <Text style={styles.placeTitle}>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.placesList}
        />
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 30, // Reduced margin for better spacing
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#d1d1d1',
  },
  subtitle1: {
    fontSize: 28,
    color: '#ffffff',
    marginTop: 50,
    alignSelf: 'flex-start', // Align text to the left
    width: '100%', // Ensure it takes the full width
  },
  buttonContainer: {
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-around', // Space buttons evenly
    width: '100%', // Full width
    marginTop: 20, // Add space from the header
  },
  card: {
    width: '22%', // Adjusted width for four buttons in a row
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5, // Add some space below the icon
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  placesList: {
    paddingVertical: 20, // Padding around the places list
  },
  placeCard: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  placeImage: {
    width: '100%',
    height: 150, // Fixed height for images
  },
  placeTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  ScrollView, 
  Linking 
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebaseConfig'; // Adjust the path as needed
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons

const { width, height } = Dimensions.get('window'); // Get window dimensions

export default function Map({ navigation }) {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the selected place

  const fadeAnim = useRef(new Animated.Value(0)).current; // For smooth fade-in transition
  const translateAnim = useRef(new Animated.Value(100)).current; // For move-in animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesCollection = collection(db, 'Places');
        const placesSnapshot = await getDocs(placesCollection);

        const placesList = placesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          latitude: parseFloat(doc.data().latitude), // Convert to float
          longitude: parseFloat(doc.data().longitude), // Convert to float
        }));

        console.log(placesList); // Debug: Print fetched places to the console

        setPlaces(placesList);
        setFilteredPlaces(placesList);
        setSelectedPlace(placesList[0]); // Set initial selected place
      } catch (error) {
        console.error("Error fetching places: ", error);
      } finally {
        setLoading(false);
        runAnimations(); // Start animations when data is ready
      }
    };

    fetchData();
  }, []);

  const runAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredData = places.filter(place =>
        place.title?.toLowerCase().includes(text.toLowerCase().trim())
      );
      setFilteredPlaces(filteredData);
      console.log("Filtered Places: ", filteredData); // Debug: Check filtered results
    } else {
      setFilteredPlaces(places); // Reset to full list when search is empty
    }
  };

  const handlePlaceSelect = (place) => {
    fadeAnim.setValue(0); // Reset animations before changing the place
    translateAnim.setValue(100); // Reset for move-in animation

    setSelectedPlace(place);
    console.log("Selected Place: ", place); // Debug selected place
    runAnimations(); // Trigger animations after selecting a new place
  };

  const handleAddToGoal = async (place) => {
    try {
      await addDoc(collection(db, 'GoalList'), {
        title: place.title,
        image: place.image,
        description: place.description,
      });
      alert('Place added to your Goal List!');
    } catch (error) {
      console.error("Error adding to goal list: ", error);
      alert('Failed to add the place. Please try again.');
    }
  };

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error("Failed to open Google Maps: ", err));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Place By the Title"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Large image section */}
      {selectedPlace && (
        <Animated.View style={{ ...styles.imageContainer, opacity: fadeAnim }}>
          <Image source={{ uri: selectedPlace.image }} style={styles.largeImage} />
          <View style={styles.overlay}>
            <Animated.Text style={{ ...styles.overlayTitle, transform: [{ translateY: translateAnim }] }}>
              {selectedPlace.title}
            </Animated.Text>
            {/* Scrollable small images */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
              {filteredPlaces.map((place) => (
                <TouchableOpacity key={place.id} onPress={() => handlePlaceSelect(place)}>
                  <Image source={{ uri: place.image }} style={styles.smallImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      )}

      {/* Card view for additional description */}
      {selectedPlace && (
        <Animated.View style={{ ...styles.card, opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
          {/* Add ScrollView to the description */}
          <ScrollView style={styles.descriptionScroll} contentContainerStyle={styles.descriptionContent}>
            <Text style={styles.description}>{selectedPlace.description}</Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={() => handleAddToGoal(selectedPlace)}>
            <Text style={styles.buttonText}>Add to Goal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('list') }}>
            <Text style={styles.buttonText}>View My Travel List</Text>
          </TouchableOpacity>

          {/* Button to open Google Maps */}
          {selectedPlace.latitude && selectedPlace.longitude && (
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => openGoogleMaps(selectedPlace.latitude, selectedPlace.longitude)}>
              <MaterialIcons name="map" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Open in Google Maps</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    color: '#333',
    fontSize: 16,
  },
  
  imageContainer: {
    height: height * 0.5,
    position: 'relative',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  overlayTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    marginTop: -10,
  },
  descriptionScroll: {
    maxHeight: 100,
    marginBottom: 10,
  },
  descriptionContent: {
    flexGrow: 1,
  },
  description: {
    color: '#666',
    fontSize: 14,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: '#5e4f34',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
  scrollView: {
    marginVertical: 10,
  },
  smallImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});

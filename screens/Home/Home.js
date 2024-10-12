import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { db } from "../../firebaseConfig"; // Firebase config
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({navigation}) {
  const [products, setProducts] = useState([]); // State to store the fetched products
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state\

  // Function to fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products")); // 'products' is the collection name in Firestore
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // The rest of the data
      }));
      setProducts(productList); // Store the full products array
    } catch (error) {
      console.error("Error fetching products: ", error);
      setError("Failed to load products."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component is mounted
  }, []);

  

  const categoriesData = [
    {
      id: "1",
      imageUrl: require("../../assets/images/Dental.png"), // Local image path
      title: "Card 1",
    },
    {
      id: "2",
      imageUrl: require("../../assets/images/Heart.png"), // Replace with your image URL
      title: "Card 2",
    },
    {
      id: "3",
      imageUrl: require("../../assets/images/Eye.png"), // Replace with your image URL
      title: "Card 3",
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <ImageBackground
      source={item.imageUrl} // Use image URL from the data
      style={styles.categoriesCard}
      imageStyle={{ borderRadius: 10 }} // Rounded corners for the image
    ></ImageBackground>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      key={item.id} // Use the product ID as the key
      onPress={() => navigation.navigate('Details01', { item })} // Navigate to Details screen with the product item
      activeOpacity={0.7} // Controls the opacity when touched
    >
      <ImageBackground
        source={{ uri: item.imageUrl }} // Use the image URL from Firestore
        style={styles.liveCard}
        imageStyle={styles.imageStyle} // Apply new imageStyle here
      >
        
        <View style={styles.overlay}>
        <Text style={styles.productName}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  


  

  return (
    
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent
      />

      <View style={styles.card}></View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.liveContainer}>
        <Text style={styles.liveTitle}>Live Doctors</Text>
      </View>

      {loading ? ( // Show loading indicator while fetching
        <ActivityIndicator size="large" color="#39170C" />
      ) : error ? ( // Show error message if there's an error
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products} // Pass the products array to FlatList
          renderItem={renderProduct} // Function to render each product
          keyExtractor={(item) => item.id} // Unique key for each item
          horizontal // Make the FlatList horizontal
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
          snapToInterval={130} // Set this to the width of your items plus margin
          decelerationRate="fast" // Fast deceleration for smoother stopping
        />
      )}

      <View style={styles.categoryContainer}>
        <FlatList
          data={categoriesData} // Data for the FlatList
          renderItem={renderCategoryItem} // Function to render each category
          keyExtractor={(item) => item.id} // Unique key for each item
          horizontal // Set FlatList to horizontal
          showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the full screen
    backgroundColor: "#f5f5f5", // Light background color
  },
  card: {
    backgroundColor: "#39170C", // Card background color
    borderTopLeftRadius: 0, // Top left corner radius
    borderTopRightRadius: 1, // Top right corner radius
    borderBottomRightRadius: 25, // Bottom right corner radius
    borderBottomLeftRadius: 25, // Bottom left corner radius
    elevation: 3, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur radius for iOS
    padding: 100, // Inner padding for the card
  },
  searchBarContainer: {
    alignItems: "center", // Center the search bar horizontally
    width: "100%", // Full width of the screen
    position: "absolute", // Position the search bar at the top
    marginTop: 170, // Space above the search bar
  },
  searchBar: {
    height: 50, // Height of the search bar
    width: "85%", // 90% of the screen width
    borderColor: "#ccc", // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Rounded corners
    paddingHorizontal: 15, // Padding inside the search bar
    backgroundColor: "#fff", // Background color of the search bar
  },
  liveContainer: {
    marginVertical: 20, // Add some spacing around the container
    paddingHorizontal: 10, // Add horizontal padding
  },
  liveTitle: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: "bold", // Make title bold
    color: "black", // Title color
    marginTop: 10, // Space above the title
    marginLeft: 20,
  },
  liveCard: {
    backgroundColor: "#666", // Card background color
    borderRadius: 15, // Rounded corners
    elevation: 3, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur radius for iOS
    marginTop: 1, // Space above the card
    marginHorizontal: 10, // Add some margin around the card
    width: 130, // Adjust the width of the card
    height: 180, // Adjust the height of the card
    overflow: "hidden", // Ensure image does not overflow the card
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Optional: dark overlay over the image for text readability
    padding: 10, // Add padding inside the overlay
  },
  productName: {
    color: "#fff", // Color for product name
    fontWeight: "bold", // Bold text for better visibility
  },
  errorText: {
    color: "red", // Color for error message
    textAlign: "center", // Center the error text
    marginTop: 20, // Space above the error message
  },
  imageStyle: {
    borderRadius: 5, // Rounded corners for the images
  },
  categoriesCard: {
    backgroundColor: "#666", // Card background color
    borderRadius: 15, // Rounded corners
    elevation: 3, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur radius for iOS
    margin: 10, // Add some margin around the card
    width: 80, // Adjust the width of the card
    height: 100, // Adjust the height of the card
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    marginBottom: 245, // Space below the card
  },
  cardText: {
    color: "#fff", // Color for card text
    fontWeight: "bold", // Make the card text bold
  },
  categoryContainer: {
    padding: 10, // Padding for the category container
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  title: {
    fontSize: 24, // Font size for the title
    fontWeight: "bold", // Make the title bold
    marginBottom: 10, // Space below the title
  },
  DoctorsCard: {
    backgroundColor: "#666", // Card background color
    borderRadius: 15, // Rounded corners
    elevation: 3, // Shadow effect on Android
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur radius for iOS
    margin: 10, // Add some margin around the card
    width: 80, // Adjust the width of the card
    height: 100, // Adjust the height of the card
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
    marginBottom: 245, // Space below the card
  },
});

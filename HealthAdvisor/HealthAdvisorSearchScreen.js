import { collection, getDocs } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Rating } from "react-native-ratings";
import { db } from "../firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";


const HealthAdvisorHomeScreen = ({ navigation }) => {
  const [advisors, setAdvisors] = useState([]);
  const [searchAdvisors, setSearchAdvisors] = useState("");
  const [loading, setLoading] = useState(true);

  const getAdvisorsDetails = async () => {
    try {
      const response = await getDocs(collection(db, "healthadvisors"));
      const advisorsList = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdvisors(advisorsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advisors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdvisorsDetails();
  }, []);

  return (
    <View style={styles.container}>

<View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backcard}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.detailstitle}>Find Doctors</Text>
      </View>
      
          <View style={{alignItems: 'center',}}>
            <View style={styles.searchbar}>  
              <Icon name="search" size={20} color="#677294" />
              <TextInput
                style={styles.input}
                placeholder="Search...."
                onChangeText={setSearchAdvisors}               
              />
              <Icon name="close" size={20} color="#677294" />
            </View>     
          </View>
        <View style={styles.Container2}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#39170C" />
              <Text>Loading advisors...</Text>
            </View>
          ) : (
            <ScrollView
            contentContainerStyle={{ paddingVertical: 0 }} // Optional: Add vertical padding
            showsVerticalScrollIndicator={false} // Hide scroll indicator
          >
            <View>
              {advisors
                .filter((advisor) =>
                  advisor.name.toLowerCase().includes(searchAdvisors.toLowerCase())
                )
                .map((advisor) => (
                  <View style={styles.cards} key={advisor.id}>
                    <Image
                      style={styles.images}
                      source={{ uri: advisor.imageUrl }}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardname}>{advisor.name}</Text>
                      <Text style={styles.cardlanguage}>{advisor.Category}</Text>
                      <Text style={styles.cardexp}>{advisor.Expricence} Experience</Text>
                      <Text style={styles.cardstatus}>{advisor.Status}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() =>
                          navigation.navigate("HealthAdvisorDetailsScreen", {
                            advisorId: advisor.id,
                          })
                        }
                      >
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    
                  </View>
                ))}
            </View>
          </ScrollView>          
          )}
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 20,
    backgroundColor: "#fff",
  },
  Container2: {
    paddingTop: 20,

  },
  bookButton: {
    backgroundColor: "#39170C",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    width:100,
    height:40,
    marginTop:85,
    marginLeft:-55,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    
  },
  headerContainer: {
    flexDirection: "row", // Aligns items horizontally
    alignItems: "center", // Aligns items vertically in the center
    marginTop: 60, // Adjust top margin for the entire row
    marginBottom: 20, // Adjust bottom margin for the entire row
  },
  backcard: {
    backgroundColor: "#fff", // Card background color
    width: 50, // Card width
    height: 50, // Card height
    borderRadius: 10, // Rounded corners for the card
    elevation: 5, // Shadow effect for the card (Android)
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: "center", // Center the icon inside the card
    alignItems: "center", // Align the icon in the center
    marginLeft: 1, // Adjust positioning horizontally
  },
  detailstitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 60, // Space between back button and title
    color: "#000", // Title color
  },
  circlecontainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#14B82E", // Green for "Available"
    padding: 5,
    borderRadius: 5,
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 5,
    paddingLeft: 20,
    color: "#fff",
  },
  titlename: {
    fontSize: 15,
    textAlign: "left",
    marginBottom: 3,
    paddingLeft: 20,
    color: "#fff",
  },
  searchbar: {
    backgroundColor: "#fff",
    marginTop: 25,
    width: 350,
    height: 50,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  input: {
    paddingLeft: 15,
    width: 280,
    fontSize: 20,
  },
  title2: {
    fontSize: 24,
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 5,
    paddingLeft: 10,
    color: "#333333",
  },
  title3: {
    fontSize: 24,
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    paddingLeft: 10,
    color: "#333333",
  },
  card3:{
    backgroundColor: "#fff",
    margin: 10,
    width: 170,
    height: 260,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  cards: {
    backgroundColor: "#fff",
    margin: 10,
    width: 350,
    height: 130,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row", // To align image and text horizontally
  },

  images: {
    marginLeft  : 10,
    marginTop: 10,
    width: 85,
    height: 80,
    borderRadius: 8,
  },
  cardname: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333333",
    marginTop : 20,
    marginLeft : 20,
  },
  cardlanguage: {
    fontSize: 13,
    color: "#14B82E",
    marginTop:0 ,
    marginLeft: 20,
  },
  cardexp: {
    fontSize: 13,
    marginBottom: 5,
    color: "#666",
    marginTop:0 ,
    marginLeft: 20,
  },
  cardstatus: {
    fontWeight:"bold",
    fontSize: 15,
    marginBottom: 5,
    color: "#14B82E",
    marginLeft : -80,
    marginTop: 10,
    
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 130,
    width: 300,
    margin: 10,
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  patientcontainer: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "center", // Center the card horizontally
    marginTop: 10, // Add margin to the top if needed
  },
  
  detailcard: {
    backgroundColor: "#eee", // Card background color
    width: 80, // Width of the card
    height: 80, // Height of the card
    borderRadius: 10, // Rounded corners
    alignItems: "center", // Align the text in the center
    margin: 10, // Space between the icon and text
    justifyContent: "center", // Center the text vertically
  },
  cardTitle: {
    fontSize: 18, // Text size
    fontWeight: "bold", // Bold text
    color: "#ffffff", // Text color
    marginTop: 80, // Space above the text
  },
  carddetails: {
    fontSize: 20, // Text size
    fontWeight: "bold", // Bold text
    color: "#333", //
  },
  imageBackground: {
    width: 90, // Adjust size as per your requirement
    height: 110,
    margin: 10,
    alignItems: "center",
  },
});

export default HealthAdvisorHomeScreen;

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
      <View style={styles.circlecontainer}>
        <View
          style={{
            width: 420,
            height: 280,
            borderRadius: 25,
            backgroundColor: "#39170C",
            marginTop: -120,
          }}
        >
          <View style={{ marginTop: 150 }} />
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={styles.titlename}>Hi Ashan!</Text>
              <Text style={styles.title}>Find Your Health Advisor</Text>
            </View>
            <Image
              style={{ width: 70, height: 70, marginLeft: 70 }}
              source={require("../assets/profile.png")}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.searchbar}>
              <Icon name="search" size={20} color="#677294" />
              <TouchableOpacity onPress={() => navigation.navigate('HealthAdvisorSearchScreen', { advisors })}>
              <TextInput
          style={styles.input}
          placeholder="Search...."
          editable={false}  // Makes the search bar not editable, just clickable
        />
        </TouchableOpacity>
              <Icon name="close" size={20} color="#677294" />
            </View>
          </View>
        </View>
      </View>

     
     
      


      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
         <Text style={styles.title2}>Available Advisors</Text>
{/* Show loading spinner while fetching data */}
{loading ? (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#39170C" />
    <Text>Loading advisors...</Text>
  </View>
) : (
  <ScrollView
    horizontal
    contentContainerStyle={{ paddingVertical: 0 }} // Optional: Add vertical padding
    showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
  >
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {advisors
        .filter(
          (advisor) =>
            advisor.Status &&
            typeof advisor.Status === "string" &&
            advisor.Status.trim().toLowerCase() === "available" &&
            advisor.name.toLowerCase().includes(searchAdvisors.toLowerCase()) // Optional: If you still want search functionality
        )
        .map((advisor) => (
          <TouchableOpacity
            key={advisor.id}
            onPress={() =>
              navigation.navigate("HealthAdvisorDetailsScreen", {
                advisorId: advisor.id,
              })
            }
          >
            <View style={styles.card3}>
              <Image
                style={{
                  width: 170,
                  height: 260,
                  borderRadius: 8,
                  marginBottom: 5,
                }}
                source={{ uri: advisor.imageUrl }}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Available</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  </ScrollView>
)}


          <View style={styles.patientcontainer}>
            {/* Booked Card with Background */}
            <ImageBackground
              source={require("../assets/images/Dental.png")} // Path to your image
              style={styles.imageBackground} // Define styles for the image background
              imageStyle={{ borderRadius: 10 }} // Apply border radius to the image
            >
              <Text style={styles.cardTitle}>Dental</Text>
            </ImageBackground>

            {/* OnGoing Card with Background */}
            <ImageBackground
              source={require("../assets/images/Heart.png")} // Path to your image
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>Heart</Text>
            </ImageBackground>

            {/* Patient Card with Background */}
            <ImageBackground
              source={require("../assets/images/Eye.png")} // Path to your image
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>Eye</Text>
            </ImageBackground>
          </View>

          <Text style={styles.title3}>Health Advisors</Text>
          {/* Show loading spinner while fetching data */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#39170C" />
              <Text>Loading advisors...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingVertical: 0 }} // Optional: Add vertical padding
              showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {advisors
                  .filter((advisor) =>
                    advisor.name
                      .toLowerCase()
                      .includes(searchAdvisors.toLowerCase())
                  )
                  .map((advisor) => (
                    <TouchableOpacity
                      key={advisor.id}
                      onPress={() =>
                        navigation.navigate("HealthAdvisorDetailsScreen", {
                          advisorId: advisor.id,
                        })
                      }
                    >
                      <View style={styles.cards}>
                        <Image
                          style={{
                            width: 175,
                            height: 150,
                            borderRadius: 8,
                            marginBottom: 5,
                          }}
                          source={{ uri: advisor.imageUrl }}
                        />
                        <Text style={styles.cardname}>{advisor.name}</Text>
                        <Text style={styles.cardlanguage}>
                          {advisor.Category}
                        </Text>
                        <Rating
                          ratingCount={5}
                          imageSize={14}
                          readonly={true}
                          startingValue={advisor.Ratings}
                          style={{ marginTop: 3 }}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          )}
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
    backgroundColor: "#fff",
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
    width: 175,
    height: 260,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  cardname: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333333",
  },
  cardlanguage: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 5,
    color: "#677294",
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

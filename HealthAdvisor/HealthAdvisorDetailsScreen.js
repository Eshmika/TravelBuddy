import { doc, getDoc } from "@firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Rating } from "react-native-ratings";
import { db } from "../firebaseConfig";
import Icon from "react-native-vector-icons/Feather";

const HealthAdvisorDetailsScreen = ({ route, navigation }) => {
  const { advisorId } = route.params;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [rate, setRate] = useState("");
  const [booked, setBooked] = useState("");
  const [ongoing, setOngoing] = useState("");
  const [patients, setPatients] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");

  const getAdvisorsdetails = useCallback(async () => {
    try {
      const response = await getDoc(doc(db, "healthadvisors", advisorId));
      if (response.exists()) {
        const data = response.data();
        setName(data.name);
        setCategory(data.Category);
        setRating(data.Ratings);
        setRate(data.Rate);
        setBooked(data.Booked);
        setOngoing(data.OnGoing);
        setPatients(data.Patients);
        setimageUrl(data.imageUrl);
        setDescription(data.Descrpiton);
        setServices(data.Services || []);
      } else {
        console.log("No such data found!");
      }
    } catch (error) {
      console.error(error);
    }
  }, [advisorId]);

  useEffect(() => {
    getAdvisorsdetails();
  }, [advisorId, getAdvisorsdetails]);

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

        <Text style={styles.detailstitle}>Doctor Details</Text>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Image
            style={{ width: 110, height: 100, borderRadius: 9 }}
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../assets/Personloading.gif")
            }
          />
          <View style={{ marginLeft: 15, marginTop: 13 }}>
            <Text style={styles.cardname}>{name}</Text>
            <Text style={styles.carddescription}>Specialist {category}</Text>
            <View style={{ flexDirection: "row" }}>
              <Rating
                ratingCount={5}
                imageSize={16}
                readonly={true}
                startingValue={rating}
                style={{ marginTop: 3 }}
              />
              <Text style={styles.cardprice1}>RS</Text>
              <Text style={styles.cardprice2}>{rate}</Text>
              <Text style={styles.cardprice2}>/hr</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.typebtn}
          onPress={() =>
            navigation.navigate("HealthAdvisorDateTimeScreen", {
              advisorId: advisorId,
            })
          }
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.patientcontainer}>
        <View style={styles.pateintcard}>
          <View style={styles.detailcard}>
            <Text style={styles.cardTitle}>Booked</Text>
            <Text style={styles.carddetails}>{booked}</Text>
          </View>
          <View style={styles.detailcard}>
            <Text style={styles.cardTitle}>OnGoing</Text>
            <Text style={styles.carddetails}>{ongoing}</Text>
          </View>
          <View style={styles.detailcard}>
            <Text style={styles.cardTitle}>Patient</Text>
            <Text style={styles.carddetails}>{patients}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{description}</Text>

      {/* Display Services */}
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesTitle}>Services</Text>
        {services.length > 0 ? (
          services.map((service, index) => (
            <Text key={index} style={styles.serviceItem}>
              <Text style={styles.serviceNumber}>{index + 1}. </Text>
              {service}
            </Text>
          ))
        ) : (
          <Text style={styles.serviceItem}>No services available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 1,
    padding: 20,
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
  card: {
    backgroundColor: "#fff",
    marginTop: 15,
    width: 375,
    height: 200,
    borderRadius: 8,
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 8,
    alignItems: "center",
  },
  cardname: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  carddescription: {
    fontSize: 12,
    marginBottom: 5,
    color: "#677294",
    flexWrap: "wrap",
  },
  cardprice1: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0EBE7F",
    marginRight: 5,
    marginLeft: 5,
  },
  cardprice2: {
    fontSize: 17,
    marginBottom: 5,
    color: "#677294",
  },
  typebtn: {
    backgroundColor: "#39170C",
    color: "#fff",
    padding: 8,
    borderRadius: 5,
    width: 180,
    alignItems: "center",
    marginTop: 20,
  },
  patientcontainer: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "center", // Center the card horizontally
    marginTop: 20, // Add margin to the top if needed
  },
  pateintcard: {
    backgroundColor: "#fff", // Card background color
    width: 320, // Width of the card
    height: 100, // Height of the card
    borderRadius: 10, // Rounded corners
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "row", // Arrange the Text components horizontally inside the card
    justifyContent: "space-between", // Space between the texts
    alignItems: "center", // Align the texts vertically centered
    paddingHorizontal: 10, // Add padding inside the card for spacing
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
    fontSize: 16, // Text size
    fontWeight: "bold", // Bold text
    color: "#666", // Text color
  },
  carddetails: {
    fontSize: 20, // Text size
    fontWeight: "bold", // Bold text
    color: "#333", //
  },
  description: {
    fontSize: 16,
    padding: 10,
    marginTop: 10,
    color: "#677294",
    textAlign: "justify",
  },
  servicesContainer: {
    marginTop: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#677294",
    marginBottom: 10,
    marginLeft: 5,
  },
  serviceItem: {
    padding: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  serviceNumber: {
    fontSize: 16,
    color: '#0EBE7F', // Green color for the numbers
    paddingLeft: 5, // Space between the number and the text
  },
});

export default HealthAdvisorDetailsScreen;

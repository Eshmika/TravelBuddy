import { addDoc, collection, doc, getDoc } from "@firebase/firestore";
import React, { useCallback, useEffect, useState , } from "react";
import { ImageBackground } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Rating } from "react-native-ratings";
import { db } from "../firebaseConfig";
import Icon from "react-native-vector-icons/Feather";
import { Alert } from "react-native"; // Import Alert from React Native
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HealthAdvisorAppointmentScreen = ({ route, navigation }) => {
  const [value, setValue] = useState(1);
  const { advisorId } = route.params;
  const { Date } = route.params;
  const { Time } = route.params;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");
  const [rate, setRate] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const submitappointmentdetails = async (e) => {
    e.preventDefault();

    // Check if the username or phonenumber fields are empty
    if (!username || !phonenumber || !age || !reason || !selectedGender) {
      Alert.alert("Missing Information", "Please fill all the details"); // Show alert
      return; // Exit the function if validation fails
    }

    try {
      await addDoc(collection(db, "healthadvisor_appointment"), {
        HealthAdvisorName: name,
        Date: Date,
        Time: Time,
        CustomerName: username,
        PhoneNumber: phonenumber,
        Age: age,
        reason: reason,
        gender: selectedGender,
      });
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };
  const getadvisordetails = useCallback(async () => {
    try {
      const response = await getDoc(doc(db, "healthadvisors", advisorId));
      if (response.exists()) {
        const data = response.data();
        setName(data.name);
        setCategory(data.Category);
        setRating(data.Ratings);
        setRate(data.Rate);
        setimageUrl(data.imageUrl);
      } else {
        console.log("No such data found!");
      }
    } catch (error) {
      console.error(error);
    }
  }, [advisorId]);

  useEffect(() => {
    getadvisordetails();
  }, [advisorId, getadvisordetails]);

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

        <Text style={styles.detailstitle}>Appointment</Text>
      </View>

      <View style={{ alignItems: "center" }}>
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
              <Text style={styles.carddescription}>Specialist{category}</Text>
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
        </View>
      </View>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 20 }}>
            <Text style={styles.cardname}>Appointment For</Text>
          </View>

          <View style={{ marginTop: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={username}
            onChangeText={setUsername}
            required
          />

          <TextInput
            style={styles.input}
            placeholder="Patient Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={2}
            required
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={phonenumber}
            onChangeText={setPhonenumber}
            keyboardType="numeric"
            maxLength={10}
            required
          />

          <TextInput
            style={styles.input}
            placeholder="Reason for Appointment"
            value={reason}
            onChangeText={setReason}
            required
          />

          <View>
            <Text style={styles.cardname}>Who is the Patient ?</Text>
          </View>

          <View style={styles.container2}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={[
                  styles.genderCard,
                  selectedGender === "Male" ? styles.selectedCard : null,
                ]}
                onPress={() => handleGenderSelect("Male")}
              >
                <ImageBackground
                  source={require("../assets/Male.jpeg")} // Path to your image
                  style={styles.imageBackground}
                  imageStyle={{ borderRadius: 10 }} // To apply border-radius to the image
                >
                  <Text style={styles.cardText}>Male</Text>
                </ImageBackground>
              </TouchableOpacity>

              {/* Female Card with Background Image */}
              <TouchableOpacity
                style={[
                  styles.genderCard,
                  selectedGender === "Female" ? styles.selectedCard : null,
                ]}
                onPress={() => handleGenderSelect("Female")}
              >
                <ImageBackground
                  source={require("../assets/Female.jpeg")} // Path to your image
                  style={styles.imageBackground}
                  imageStyle={{ borderRadius: 10 }} // To apply border-radius to the image
                >
                  <Text style={styles.cardText}>Female</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <Text style={styles.selectedGenderText}>
              Selected Gender: {selectedGender ? selectedGender : "None"}
            </Text>
          </View>
        </ScrollView>
      </GestureHandlerRootView>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.typebtn}
          onPress={submitappointmentdetails}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 19 }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image
              source={require("../assets/Thankyoualerticon.png")}
              style={styles.modalIcon}
            />
            <Text style={styles.modalText}>Thank You!</Text>
            <Text style={styles.modalSubText}>Your Appointment Successful</Text>
            <Text style={styles.modalSubText2}>
              You booked an appointment with {name} on {Date}, at {Time}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("BottomTabs"); // Replace with desired screen
              }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
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
    marginTop: -10,
    width: 370,
    height: 140,
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
    marginTop: 10,
  },
  carddescription: {
    fontSize: 12,
    marginBottom: 5,
    color: "#677294",
  },
  cardprice1: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0EBE7F",
    marginRight: 5,
    marginLeft: 20,
  },
  cardprice2: {
    fontSize: 17,
    marginBottom: 5,
    color: "#677294",
  },

  inputbox: {
    marginTop: 10,
    backgroundColor: "#666",
  },
  input: {
    height: 60,
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0", // Change this to your desired background color
    borderRadius: 5,
  },
  typebtn: {
    backgroundColor: "#39170C",
    color: "#fff",
    padding: 14,
    borderRadius: 7,
    width: 300,
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#39170C",
    padding: 10,
    width: 60,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
  },
  valueText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    borderColor: "#000",
    borderWidth: 1,
    padding: 10,
    width: 80,
    borderRadius: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalIcon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#39170C",
  },
  modalSubText: {
    fontSize: 17,
    color: "#677294",
    marginBottom: 20,
  },
  modalSubText2: {
    fontSize: 15,
    color: "#677294",
    marginBottom: 40,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#39170C",
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  container2: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  genderCard: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3D3D3",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  selectedCard: {
    borderColor: '#FFC107', // Highlight border color when selected
    backgroundColor: '#FFE082', // Highlight background color when selected
    transform: [{ scale: 1.2 }], // Slightly increase the size
  },
  cardText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  selectedGenderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 20,
  },
});

export default HealthAdvisorAppointmentScreen;

import { addDoc, collection, doc, getDoc } from '@firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Rating } from 'react-native-ratings';
import { db } from '../firebaseConfig';

const TravelGuideAppointmentScreen = ({ route, navigation }) => {
  const [value, setValue] = useState(1); 
  const { guideId } = route.params;
  const { Date } = route.params;
  const { Time } = route.params;
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [username, setUsername] = useState('');
  const [phonenumber, setPhonenumber] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const handleIncrement = () => {
    setValue(value + 1); 
  };

  const handleDecrement = () => {
    if (value > 1) { 
      setValue(value - 1); 
    }
  };

  const submitappointmentdetails = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "travelguide_appointment"), {
        TravelGuideName: name,
        Date: Date,  
        Time: Time, 
        CustomerName: username,
        PhoneNumber: phonenumber,
        GroupSize: value,
      });
      setModalVisible(true);
    } catch (error) {
        console.error(error);
    }
  };

  const getGuidedetails = useCallback(async () => {
    try {
        const response = await getDoc(doc(db, "travelguides", guideId));
        if (response.exists()) {
            const data = response.data();
            setName(data.name);
            setLanguage(data.Language);
            setRating(data.Rating);
            setPrice(data.Price);
            setimageUrl(data.imageUrl);
        } else {
            console.log("No such data found!");
        }
    } catch (error) {
        console.error(error);
    }
  }, [guideId]);

  useEffect(() => {
    getGuidedetails();
  }, [guideId, getGuidedetails]);

  return (
    <View style={styles.container}>

      <View style={{ alignItems: 'center',}}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', marginTop: 15,}}>
            <Image 
                style={{ width: 110, height: 100, borderRadius: 9,}} 
                source={imageUrl ? { uri: imageUrl } : require('../assets/Personloading.gif')} 
            />
            <View style={{ marginLeft:15, marginTop: 13,}}>
              <Text style={styles.cardname}>{name}</Text>
              <Text style={styles.carddescription}>I speak {language}</Text>
              <View style={{ flexDirection: 'row',}}>
                <Rating              
                  ratingCount={5}
                  imageSize={16}
                  readonly={true}
                  startingValue={rating}
                  style={{ marginTop: 3, }}
                />
                <Text style={styles.cardprice1}>RS</Text>
                <Text style={styles.cardprice2}>{price}</Text>
                <Text style={styles.cardprice2}>/hr</Text>
              </View>                
            </View>
          </View>  
        </View>
      </View>      

      <View style={{ marginTop: 20,}}>
        <Text style={styles.cardname}>Appointment For</Text> 
      </View>

      <View style={{ marginTop: 20,}}/>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={username}
        onChangeText={setUsername} 
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

      <View style={{ marginTop: 20,}}>
        <Text style={styles.cardname}>Tell me your group size</Text> 
      </View>

      <View style={{ marginTop: 20,}}/>   
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 40, paddingLeft: 40, marginTop: 25,}}>
        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <Text style={styles.valueText}>{value}</Text>

        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 50,}}>
        <TouchableOpacity style={styles.typebtn} onPress={submitappointmentdetails}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19,}}>Confirm</Text>
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
            <Image source={require('../assets/Thankyoualerticon.png')} style={styles.modalIcon} />
            <Text style={styles.modalText}>Thank You!</Text>
            <Text style={styles.modalSubText}>Your Appointment Successful</Text>
            <Text style={styles.modalSubText2}>You booked an appointment with {name} on {Date}, at {Time}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('BottomTabs');  // Replace with desired screen
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
    paddingTop: 40,
    padding: 20,
    alignItems: 'left',    
  },
  card:{
    backgroundColor: '#fff', 
    marginTop: 15,
    width: 350,
    height: 135,
    borderRadius: 8,
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 8, 
    alignItems: 'center',   
  },
  cardname: {
    fontSize: 20,    
    fontWeight: 'bold',
    marginBottom: 5, 
    color: '#333333',      
  },
  carddescription: {
    fontSize: 12,    
    marginBottom: 5, 
    color: '#677294',      
  },
  cardprice1: {
    fontSize: 17,   
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#0EBE7F',      
    marginRight: 5,
    marginLeft: 5,
  },
  cardprice2: {
    fontSize: 17,   
    marginBottom: 5, 
    color: '#677294', 
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff', 
    borderRadius: 8, 
  },
  typebtn: {
    backgroundColor: '#39170C',
    color: '#fff',
    padding: 14,
    borderRadius: 7,
    width: 300,
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#39170C', 
    padding: 10,
    width: 60,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  valueText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    width: 80,
    borderRadius: 5,
  },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIcon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#39170C',
  },
  modalSubText: {
    fontSize: 17,
    color: '#677294',
    marginBottom: 20,
  },
  modalSubText2: {
    fontSize: 15,
    color: '#677294',
    marginBottom: 40,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#39170C',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TravelGuideAppointmentScreen;

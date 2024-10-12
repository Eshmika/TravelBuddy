import { collection, deleteDoc, doc, getDocs } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const TravelGuideBookedListScreen = ({ navigation }) => {
  const [guides, setGuides] = useState([]);   
  const [doctors, setDoctors] = useState([]);   
  const [searchguides, setSearchGuides] = useState('');
  const [searchdoctor, setSearchDoctor] = useState('');
  const [loading, setLoading] = useState(true);

  const getGuidedetails = async () => {
    setLoading(true); // Set loading state to true before fetching
    try {
      const response = await getDocs(collection(db, "travelguide_appointment")); 
      const guideList = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuides(guideList);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };  

  const getDoctordetails = async () => {
    setLoading(true); // Set loading state to true before fetching
    try {
      const response = await getDocs(collection(db, "healthadvisor_appointment")); 
      const doctorList = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };  
  
  const handleDelete = async (id) => {
    try {     
      await deleteDoc(doc(db, "travelguide_appointment", id));
      getGuidedetails(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);        
    }
  };   

  const handleDoctorDelete = async (id) => {
    try {     
      await deleteDoc(doc(db, "healthadvisor_appointment", id));
      getDoctordetails(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);        
    }
  };   

  const confirmDelete = (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel the appointment?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => handleDelete(id),
        }
      ],
      { cancelable: true }
    );
  };

  const confirmDoctorDelete = (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel the appointment?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => handleDoctorDelete(id),
        }
      ],
      { cancelable: true }
    );
  };

  // Fetch details every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getGuidedetails();
      getDoctordetails();
    }, [])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#39170C" />
          <Text>Loading List...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Booked Travel Guide List</Text>
          <View style={{alignItems:'center', }}>
            {guides.filter(guide => guide.CustomerName.toLowerCase().includes(searchguides.toLowerCase())).map(guide => (
              <View key={guide.id} >
                <View style={styles.cards}>                  
                  <Text style={styles.cardname}>Travel Guide Name: {guide.TravelGuideName}</Text>
                  <Text style={styles.cardlanguage}>Date: {guide.Date}</Text>                  
                  <Text style={styles.cardlanguage}>Time: {guide.Time}</Text>                  
                  <Text style={styles.cardlanguage}>Group Size: {guide.GroupSize}</Text>                  
                  <Text style={styles.cardlanguage}>Phone number: {guide.PhoneNumber}</Text> 

                  <View style={{ alignItems: 'center', marginTop: 20,}}>
                    <TouchableOpacity style={styles.typebtn} onPress={() => confirmDelete(guide.id)} >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19,}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>                 
                </View>                
              </View>
            ))}
          </View>

          <View style={{ marginTop: 30 }} />
          <Text style={styles.title}>Booked Health Advisor List</Text>
          <View style={{alignItems:'center', }}>
            {doctors.filter(doctor => doctor.CustomerName.toLowerCase().includes(searchdoctor.toLowerCase())).map(doctor => (
              <View key={doctor.id} >
                <View style={styles.cards2}>                  
                  <Text style={styles.cardname}>Doctor Name: {doctor.HealthAdvisorName}</Text>
                  <Text style={styles.cardlanguage}>Patient name: {doctor.CustomerName}</Text>                  
                  <Text style={styles.cardlanguage}>Age: {doctor.Age}</Text>                  
                  <Text style={styles.cardlanguage}>Gender: {doctor.gender}</Text>                  
                  <Text style={styles.cardlanguage}>Date: {doctor.Date}</Text>                  
                  <Text style={styles.cardlanguage}>Time: {doctor.Time}</Text>                  
                  <Text style={styles.cardlanguage}>Reason: {doctor.reason}</Text>

                  <View style={{ alignItems: 'center', marginTop: 20,}}>
                    <TouchableOpacity style={styles.typebtn} onPress={() => confirmDoctorDelete(doctor.id)} >
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19,}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>                 
                </View>                
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    padding: 20,
    backgroundColor: '#fff', 
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 20,   
    color: '#333333',      
    flexDirection: 'row',
  },
  cards:{
    backgroundColor: '#fff', 
    marginTop: 5,
    width: 350,
    height: 270,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
  },
  cards2:{
    backgroundColor: '#fff', 
    marginTop: 5,
    width: 350,
    height: 360,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardname: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,      
  },
  cardlanguage: {
    fontSize: 18,
    marginBottom: 5, 
    color: '#677294',      
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typebtn: {
    backgroundColor: '#39170C',
    color: '#fff',
    padding: 14,
    borderRadius: 7,
    width: 300,
    alignItems: 'center',
  },  
});

export default TravelGuideBookedListScreen;

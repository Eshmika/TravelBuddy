import { collection, deleteDoc, doc, getDocs } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { db } from '../firebaseConfig';

const TravelGuideBookedListScreen = ({ navigation }) => {
  const [guides, setGuides] = useState([]);   
  const [searchguides, setSearchGuides] = useState('');
  const [loading, setLoading] = useState(true);

  const getGuidedetails = async () => {
    try {
      const response = await getDocs(collection(db, "travelguide_appointment")); 
      const guideList = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuides(guideList);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching guides:', error);
      setLoading(false);
    }
  };  
  
  const handleDelete = async (id) => {
    try {     
        await deleteDoc(doc(db, "travelguide_appointment", id))
        .then(() => {
          getGuidedetails();
        });
    } catch (error) {
        console.error(error);        
    }
  }   

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

  useEffect(() => {
    getGuidedetails();
  }, []);

  return (
    <View style={styles.container}>
      {/* Show loading spinner while fetching data */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#39170C" />
          <Text>Loading List...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#fff', 
    // alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 5,
    paddingLeft: 20,    
    color: '#333333',      
    flexDirection: 'row',
  },
  cards:{
    backgroundColor: '#fff', 
    marginTop: 5,
    width: 350,
    height: 260,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardname: {
    fontSize: 23,
    // textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,      
  },
  cardlanguage: {
    fontSize: 18,
    // textAlign: 'center',
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

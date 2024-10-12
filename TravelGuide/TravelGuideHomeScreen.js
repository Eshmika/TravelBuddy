import { collection, doc, getDocs } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';
import { db } from '../firebaseConfig';

const TravelGuideHomeScreen = ({ navigation }) => {
  const [guides, setGuides] = useState([]);   
  const [searchguides, setSearchGuides] = useState('');
  const [loading, setLoading] = useState(true);

  const getGuidedetails = async () => {
    try {
      const response = await getDocs(collection(db, "travelguides")); 
      const guideList = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuides(guideList);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching guides:', error);
      setLoading(false);
    }
  };  

  useEffect(() => {
    getGuidedetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circlecontainer}>
        <View style={{ width: 420, height: 280, borderRadius: 60, backgroundColor: '#39170C', marginTop:-120,}}>
          <View style={{ marginTop: 150 }} />

          <View style={{flexDirection: 'row',}}>
            <View>
              <Text style={styles.titlename}>Hi Eshmika!</Text>
              <Text style={styles.title}>Find Your Travel Guide</Text>
            </View>   
                     
            <Image 
              style={{ width: 70, height: 70, marginLeft:20,}} 
              source={require('../assets/OnboardScreenTravelGuide.png')} 
            />
          </View>
          
          <View style={{alignItems: 'center',}}>
            <View style={styles.searchbar}>  
              <Icon name="search" size={20} color="#677294" />
              <TextInput
                style={styles.input}
                placeholder="Search...."
                onChangeText={setSearchGuides}               
              />
              <Icon name="close" size={20} color="#677294" />
            </View>
          </View>          
        </View>
      </View>

      <Text style={styles.title2}>Travel Guide</Text>
      {/* Show loading spinner while fetching data */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#39170C" />
          <Text>Loading guides...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {guides.filter(guide => guide.name.toLowerCase().includes(searchguides.toLowerCase())).map(guide => (
              <TouchableOpacity key={guide.id} onPress={() => navigation.navigate('Travel Guide Details', { guideId: guide.id })}>
                <View style={styles.cards}>
                  <Image 
                    style={{ width: 170, height: 150, borderRadius: 8, marginBottom: 5 }} 
                    source={{ uri: guide.imageUrl }} 
                  />
                  <Text style={styles.cardname}>{guide.name}</Text>
                  <Text style={styles.cardlanguage}>{guide.Language}</Text>
                  <Rating               
                    ratingCount={5}
                    imageSize={14}
                    readonly={true}
                    startingValue={guide.Rating}
                    style={{ marginTop: 3, }}
                  />
                </View>
              </TouchableOpacity>
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
  circlecontainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 20,    
    color: '#fff',     
  },
  titlename: {
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 3,
    paddingLeft: 20,    
    color: '#fff',     
  },
  searchbar:{
    backgroundColor: '#fff', 
    marginTop: 25,
    width: 350,
    height: 50,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15, 
  },
  input:{
    paddingLeft: 15,
    width: 280,
    fontSize: 20,
  },
  title2: {
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
    marginTop: 15,
    width: 175,
    height: 240,
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  cardname: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333333',      
  },
  cardlanguage: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 5, 
    color: '#677294',      
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default TravelGuideHomeScreen;

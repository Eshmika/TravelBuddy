import { doc, getDoc } from '@firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings';
import { db } from '../firebaseConfig';

const TravelGuideDetailsScreen = ({ route, navigation }) => {
  const { guideId } = route.params;
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [description, setDescription] = useState('');

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
            setDescription(data.Description);
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

        <TouchableOpacity style={styles.typebtn} onPress={() => navigation.navigate('Select Time', { guideId: guideId })}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18,}}>Book Now</Text>
        </TouchableOpacity>              
      </View>

      <Text style={styles.description}>{description}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingTop: 40,
    padding: 20,
    // backgroundColor: '#fff', 
    alignItems: 'center',
  },
  card:{
    backgroundColor: '#fff', 
    marginTop: 15,
    width: 350,
    height: 195,
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
    flexWrap: 'wrap',
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
  typebtn: {
    backgroundColor: '#39170C',
    color: '#fff',
    padding: 8,
    borderRadius: 5,
    width: 180,
    alignItems: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 16, 
    padding: 10,  
    marginTop: 25, 
    color: '#677294',
    textAlign: "justify", 
  },
});

export default TravelGuideDetailsScreen;

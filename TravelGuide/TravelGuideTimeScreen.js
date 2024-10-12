import { doc, getDoc } from '@firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {Calendar} from 'react-native-calendars';
import { Rating } from 'react-native-ratings';
import { db } from '../firebaseConfig';

const TravelGuideTimeScreen = ({ route, navigation }) => {
  const INITIAL_DATE = new Date();

  const { guideId } = route.params;
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [rating, setRating] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); 

  const cardTimes = ['10:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];  
  
  const handleCardPress = (time) => {
    setSelectedCard(time); 
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#39170C', 
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

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', marginTop: 12,}}>
          <Image 
              style={{ width: 85, height: 85, marginLeft: 13, borderRadius: 9,}} 
              source={imageUrl ? { uri: imageUrl } : require('../assets/Personloading.gif')}
          />
          <View style={{ marginLeft:15, marginTop: 8,}}>
            <Text style={styles.cardname}>{name}</Text>
            <Text style={styles.carddescription}>I speak {language}</Text>   
            <View style={{ alignItems:'flex-start'}}>
              <Rating               
                ratingCount={5}
                imageSize={16}
                readonly={true}
                startingValue={rating}
                style={{ marginTop: 3, backgroundColor: '#39170C',}}
              />  
            </View>                            
          </View>
        </View>              
      </View>

      <Calendar
        enableSwipeMonths
        current={INITIAL_DATE.toISOString().split('T')[0]}
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)} 
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#000000', // Header week text color
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontSize: 16,
          monthTextColor: '#ffffff', // Month text color
          arrowColor: '#39170C', // Arrow color
          todayTextColor: '#FF4500',
          selectedDayBackgroundColor: '#FFE2D9',
        }}
        renderHeader={(date) => {
          const header = date.toString('MMMM yyyy');
          return (
            <View style={styles.header}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          );
        }}
      />

      <View style={styles.bottomcard}>

        <View style={{ marginBottom: 30 }} /> 
        <Text style={styles.timecardname}>Available Time</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, paddingLeft: 20, marginTop: 10,}}>
          {cardTimes.map((time, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.timecard, 
                selectedCard === time && styles.timeselectedCard 
              ]}
              onPress={() => handleCardPress(time)} 
            >
              <Text 
                style={[
                  styles.timecardText, 
                  selectedCard === time && styles.timeselectedcardText 
                ]}
              >{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginTop: 5,}}>
          <TouchableOpacity style={styles.typebtn} onPress={() => navigation.navigate('Appointment', { Date: selectedDate, Time: selectedCard, guideId: guideId })}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19,}}>Confirm</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingTop: 40,
    padding: 20,    
    alignItems: 'center',
  },
  card:{
    backgroundColor: '#fff', 
    width: 350,
    height: 111,
    borderRadius: 8,
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 8, 
    alignItems: 'right',      
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
  calendar: {
    marginTop: 20,
    width: 350,
    height: 320,
    borderRadius: 10,
  },
  header: {
    backgroundColor: '#39170C', 
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: 200,
  },
  headerText: {
    color: '#ffffff', 
    fontSize: 18,
    fontWeight: 'bold',    
  },
  bottomcard:{
    backgroundColor: '#fff', 
    marginTop: 20,
    width: 410,
    height: 400,
    borderRadius: 30,
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 13,
  },
  timecardname: {
    fontSize: 20,    
    fontWeight: 'bold',
    marginBottom: 5, 
    color: '#333333',
    paddingLeft: 25,        
  },
  timecard: {
    backgroundColor: '#EBCFC6',
    color: '#39170C',
    padding: 10,
    width: 60,
    height: 60,
    alignItems: 'center',   
    justifyContent: 'center',
    borderRadius: 60/2,
  },
  timeselectedCard: {
    backgroundColor: '#39170C',
    color: '#FFFFFF',
  },
  timecardText: {
    color: '#39170C',
    textAlign: 'center',
  },
  timeselectedcardText: {
    color: '#FFFFFF',
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
});

export default TravelGuideTimeScreen;

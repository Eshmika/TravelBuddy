import { doc, getDoc } from '@firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,FlatList } from 'react-native';
import { Rating } from 'react-native-ratings';
import { db } from '../firebaseConfig';
import Icon from "react-native-vector-icons/Feather";
import { Alert } from 'react-native'; // Import Alert from React Native

const HealthAdvisorDateTimeScreen = ({ route, navigation }) => {
  const INITIAL_DATE = new Date();

  const { advisorId } = route.params;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [rate, setRate] = useState('');
  const [imageUrl, setimageUrl] = useState('');
  const[availablity, setAvailablity] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null); // State for selected slot
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); 

  const cardTimes = ['11:00 AM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];  
  
  const handleCardPress = (time) => {
    setSelectedCard(time); 
  };


  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to tomorrow's date

    // Check if the date is today or tomorrow
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleString('default', { day: '2-digit', month: 'short' })}`; // For today's date
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow, ${date.toLocaleString('default', { day: '2-digit', month: 'short' })}`; // For tomorrow's date
    } else {
        // For other days, return the weekday
        const options = { weekday: 'long', day: '2-digit', month: 'short' }; 
        return date.toLocaleDateString(undefined, options); // e.g., "Sunday, 13, Oct"
    }
};


  const getAdvisorsetails = useCallback(async () => {
    try {
        const response = await getDoc(doc(db, "healthadvisors", advisorId));
        if (response.exists()) {
            const data = response.data();
            setName(data.name);
            setCategory(data.Category);
            setRating(data.Ratings);
            setRate(data.Rate);
            setAvailablity(data.availability);
            setimageUrl(data.imageUrl);
        }
        
        else {
            console.log("No such data found!");
        }
    } catch (error) {
        console.error(error);
    }
  }, [advisorId]);

  useEffect(() => {
    getAdvisorsetails();
  }, [advisorId, getAdvisorsetails]);

  const getAvailableSlots = () => {
    const today = new Date().setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
    return Object.entries(availablity)
        .filter(([date]) => new Date(date).setHours(0, 0, 0, 0) >= today) // Filter slots from today onward
        .map(([date, slots]) => ({ date, slots })) // Convert object to array
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
};

const renderSlotCard = ({ item }) => {
    const isSelected = selectedSlot === item.date; // Check if the card is selected
    const isToday = new Date(item.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
    const isAvailable = item.slots.availableSlots > 0; // Check if there are available slots

    return (
        <TouchableOpacity 
            style={[
                styles.slotCard,
                isSelected ? styles.selectedCard : styles.defaultCard,
                isToday && !isAvailable && styles.disabledCard // Apply disabled style if today has no slots
            ]}
            onPress={() => {
                if (isAvailable || !isToday) { // Allow selection only if there are available slots or not today
                    setSelectedSlot(item.date); // Update the selected slot
                    setSelectedDate(item.date); // Store the selected date for display
                }
            }}
            disabled={isToday && !isAvailable} // Disable touch if today has no available slots
        >
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            <Text style={styles.slotsText}>
                {isAvailable 
                    ? `${item.slots.availableSlots} available slots` 
                    : 'No available slots'}
            </Text>
        </TouchableOpacity>
    );
};


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

        <Text style={styles.detailstitle}>Select Time</Text>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', marginTop: 12,}}>
          <Image 
              style={{ width: 85, height: 85, marginLeft: 13, borderRadius: 9,}} 
              source={imageUrl ? { uri: imageUrl } : require('../assets/Personloading.gif')}
          />
          <View style={{ marginLeft:15, marginTop: 8,}}>
            <Text style={styles.cardname}>{name}</Text>
            <Text style={styles.carddescription}>Specialist {category}</Text>   
            <View style={{ flexDirection:'row'}}>
              <Rating               
                ratingCount={5}
                imageSize={16}
                readonly={true}
                startingValue={rating}
                style={{ marginTop: 3}}
              /> 
              <Text style={styles.cardprice1}>RS</Text>
              <Text style={styles.cardprice2}>{rate}</Text>
              <Text style={styles.cardprice2}>/hr</Text> 
            </View>                            
          </View>
        </View>              
      </View>

     
         <View style={styles.slotscard}>
        <Text style={styles.timecardname}>Available Dates and Slots</Text>
        <FlatList
          data={getAvailableSlots()} // Get filtered and sorted available slots
          renderItem={renderSlotCard}
          keyExtractor={item => item.date}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardContainer}
        />
      </View>

      
        <View style={{ marginBottom: 30 }} />
        <Text style={styles.timecardname}>Available Time</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, paddingLeft: 20, marginTop: 10 }}>
          {cardTimes.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.timecard, selectedCard === time && styles.timeselectedCard]}
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

        {selectedSlot && (
    <View style={styles.selectedSlotCard}>
        {/* Row for Selected Date */}
        <View style={styles.row}>
            <Text style={styles.selectedSlotText}>Selected Date:</Text>
            <Text style={styles.selectedSlotTime}>Selected Time:</Text>
            
        </View>
        
        {/* Row for Selected Time */}
        <View style={styles.rowdate}>
        <Text style={styles.selectedDate}>{selectedSlot}</Text>
            <Text style={styles.selectedTime}>{selectedCard}</Text>
        </View>
    </View>
)}


        <View style={{ alignItems: 'center', marginTop: 5,}}>
        <TouchableOpacity 
                style={styles.typebtn} 
                onPress={() => {
                    // Check if both selectedDate and selectedCard are set
                    if (!selectedDate || !selectedCard) {
                        // Show an alert if not
                        Alert.alert('Selection Error', 'Please select both date and time before confirming.');
                    } else {
                        // Navigate to the next screen if both are selected
                        navigation.navigate('HealthAdvisorAppointmentScreen', {
                            Date: selectedDate,
                            Time: selectedCard,
                            advisorId: advisorId
                        });
                    }
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 19 }}>Confirm</Text>
            </TouchableOpacity>
        </View>


      </View>



      

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingTop: 10,
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
  card:{
    backgroundColor: '#fff', 
    width: 370,
    height: 130,
    borderRadius: 8,
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 8, 
    alignItems: 'right',      
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
    marginTop: 10,
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
    backgroundColor: '#D3D3D3',
    color: '#39170C',
    width: 60,
    height: 60,
    alignItems: 'center',   
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 1,
    marginLeft: -20,
    marginRight :-10,
  },
  timeselectedCard: {
    backgroundColor: '#39170C',
    color: '#FFFFFF',
  },
  timecardText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight  : 'bold',
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
    marginTop: 30,
  },
  slotscard: {
    marginTop: 30,
  },
  timecardname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContainer: {
    marginTop: 15,
    
  },
  slotCard: {
    backgroundColor: '#39170C',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 120, // Set a fixed width for the slot card
    marginRight: 10, // Space between cards
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  slotsText: {
    fontSize: 14,
    color: '#ffffff',
  },
  selectedCard: {
    backgroundColor: '#ffffff', // Highlight color for selected card
  },
  
  selectedSlotCard: {
    borderWidth: 2,
    borfercolor: '#39170C',
    padding: 10,
    borderRadius: 8,
    marginTop: 30,
    flexDirection: 'row', // Added to align text in a row
},
selectedSlotText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666', // Change to your preferred text color
    marginLeft: 20,
},
selectedSlotTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666', // Change to your preferred text color
    marginLeft: 20,
},
selectedDate: {
    fontSize: 16,
    color: '#39170C',
    fontWeight: 'bold',
    marginLeft: 20,
    
},
rowdate:{
    marginTop: 2,
},

selectedTime: {
    fontSize: 16,
    color: '#39170C',
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 4,
},

// Add styles for the default and selected slot cards
defaultCard: {
    backgroundColor: '#D3D3D3', // Default background
    width: 180, // Set a fixed width for the slot card
},
selectedCard: {
    backgroundColor: '#39170C', // Change to red when selected
    borderWidth: 1,
    borderColor: '#39170C',
    width: 180, // Set a fixed width for the slot card
},

});

export default HealthAdvisorDateTimeScreen;

import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React from 'react'

const JournalHome = ({ navigation }) => {

  const image1 = require('../assets/publicJournal.jpg');
  const image2 = require('../assets/soloTravel.jpg'); 
  const image3 = require('../assets/plane.png');

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ImageBackground
            source={require('../assets/journalBG.jpeg')} 
            style={styles.background}
        >
    <View style={styles.container}>

      <View style={styles.textContainer}>
        <Text style={styles.heading}>TRAVEL JOURNAL</Text>
        <Text style={styles.tagline}>"Capture Your Adventures, Share Your Stories"</Text>
      </View>
      <View style={styles.imagecontainer}>
        <TouchableOpacity style={styles.box} onPress={() => handlePress('PublicJournals')}>
          <Image source={image1} style={styles.image} />
          <Text style={styles.topic}>Explore Journals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box} onPress={() => handlePress('MyJournals')}>
          <Image source={image2} style={styles.image} />
          <Text style={styles.topic}>My Travel Stories</Text>
        </TouchableOpacity>
      </View>
      <Image source={image3} style={styles.image3} />
    </View>
    </ImageBackground>
  )
}

export default JournalHome

const styles = StyleSheet.create({
  background: {
    flex: 1,
},

  container: {
    flex: 1,
    paddingVertical: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2b2b2b',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 20,
    color: '#7a7a7a',
    fontStyle: 'italic',
    padding: 10,
    margin: 10,
    textAlign: 'center',
  },
  imagecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  box: {
    width: '40%',
    height: 300, 
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 10,
  },
  topic: {
    fontSize: 20,
    color: '#7a7a7a',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  image3: {
    width: 200,
    height: 200,
    marginTop: 100,
    marginLeft: 100,

  }
});

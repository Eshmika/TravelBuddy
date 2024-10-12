import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const TravelGuideOnboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <View style={styles.circlecontainer}>
        <View style={{ width: 400, height: 400, borderRadius: 400/2, backgroundColor: '#39170C', marginLeft:-250, marginTop:-90,}}></View> 
        <Image 
              style={{ width: 350, height: 350, marginTop:-270, }} 
              source={require('../assets/OnboardScreenTravelGuide.png')} 
            />
      </View>

      {/* <View style={styles.circleshadowcontainer}></View>  */}

      <Text style={styles.title}>Book a Personal Travel Guide</Text>
      <Text style={styles.captiontxt}>Find experienced local guides to show you the hidden gems and must-see sights.</Text>

      <TouchableOpacity style={styles.typebtn} onPress={() => navigation.navigate('LogIn')}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20,}}>Find a Guide</Text>
      </TouchableOpacity>

      <View style={{ marginBottom: 20 }} />

      <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
        <Text style={{ fontSize: 15,}}>Skip</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#fff', 
    alignItems: 'center',
  },
  circlecontainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 50,
    color: '#333333',     
  },
  captiontxt: {
    fontSize: 16,
    textAlign: 'center',    
    marginBottom: 10,    
    color: '#677294',   
    padding: 20,  
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 50,
    padding: 10,    
  },
  typebtn: {
    backgroundColor: '#39170C',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    width: 350,
    alignItems: 'center',
    marginTop: 20,
  },
  circleshadowcontainer:{
    width: 400,
    height: 400,
    borderRadius: 400/2,
    backgroundColor: '#39170C',
    opacity: 0.2, 
    marginTop: 600,
    left:  200,
    position: 'absolute',    
  },
});

export default TravelGuideOnboardScreen;

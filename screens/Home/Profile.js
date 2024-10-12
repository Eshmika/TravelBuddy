// Screens/SignUpScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';



const SignUpScreen = ({ navigation }) => {
  const [userdetails, setUserdetails] = useState(null);
  const toast = useToast();

  

  const getUserdetails = async () => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const docRef = doc(db, "user_details", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserdetails(docSnap.data());
            } else {             
              toast.show('Admin details not found', { type: 'danger' }); 
            }
        } else {           
          console.log('User not logged in');
        }
    });
  };

  useEffect(() => {
      getUserdetails();
  }, []);

  async function logout(){
    try{
        await auth.signOut();
        toast.show('Logged out successfully', { type: 'success' });
        navigation.navigate('SignIn');
    }catch(error){
        console.log(error);
        toast.show('Error logging out', { type: 'danger' });
    }
  } 

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={{ marginBottom: 20 }} />

      <Text style={styles.label1}>Full Name</Text>
      <Text style={styles.label2}>{userdetails?.name}</Text>
      <View style={{ marginBottom: 20 }} />

      <Text style={styles.label1}>Email</Text>
      <Text style={styles.label2}>{userdetails?.email}</Text>
      <View style={{ marginBottom: 20 }} />

      <Text style={styles.label1}>Phone Number</Text>
      <Text style={styles.label2}>{userdetails?.phonenumber}</Text>
      <View style={{ marginBottom: 20 }} />      

      <View style={{ marginBottom: 20 }} />
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} />
      </View>      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    padding: 20,
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE', 
  },
  label1: {
    fontSize: 20,
    color: '#333', 
    marginBottom: 5,
    fontWeight: 'bold',
  },  
  label2: {
    fontSize: 18,
    color: '#333', 
    marginBottom: 5,
    marginLeft: 15,
  },  
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default SignUpScreen;

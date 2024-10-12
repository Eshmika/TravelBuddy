// Screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Make sure this path is correct
// import { useToast } from 'react-native-toast-notifications';
import { doc, setDoc } from '@firebase/firestore';


const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [reenterpassword, setReenterpassword] = useState('');
  //   const toast = useToast();

  const signUp = async () => {
    try {
      if (password !== reenterpassword) {
        // toast.show('Passwords do not match', { type: 'danger' });                
        return;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userdetails = auth.currentUser;
        const user = userCredential.user;
        if (userdetails) {
          await setDoc(doc(db, "user_details", userdetails.uid), {
            name: name,
            email: email,
            phonenumber: phonenumber
          });
        }
        // toast.show(`User signed up with email: ${user.email}`, { type: 'success' });        
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error);
      //   toast.show(`${error.message}`, { type: 'danger' });      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.journalTitle}>Sign Up</Text>
      <View style={{ marginBottom: 20 }} />

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phonenumber}
        onChangeText={setPhonenumber}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Re-enter Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        value={reenterpassword}
        onChangeText={setReenterpassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={signUp} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LogIn')} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#74512D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  journalTitle: {
    fontSize: 32,
    color: '#6e4a32',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignUpScreen;

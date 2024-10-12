import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert, Image, ImageBackground
} from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PublicJournals = ({ navigation }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicJournals = async () => {
    try {
      const journalCollection = collection(db, 'journals');
      const q = query(journalCollection, where('privacy', '==', 'Public'));
      const querySnapshot = await getDocs(q);

      const fetchedJournals = [];
      querySnapshot.forEach((doc) => {
        fetchedJournals.push({ id: doc.id, ...doc.data() });
      });

      setJournals(fetchedJournals);
    } catch (error) {
      Alert.alert('Error', 'Failed to load journals. Please try again.');
      console.log('Firestore fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicJournals();
  }, []);

  const renderJournalItem = ({ item }) => (

    <TouchableOpacity
      style={styles.journalItem}
      onPress={() => navigation.navigate('JournalDetails', { journal: item })}
    >
      <ImageBackground
        source={{ uri: item.coverImg }}
        style={styles.journalImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <Text style={styles.journalTitle}>
            {item.journalTitle}
          </Text>
          <Text style={styles.journalDate}>
            {item.createdAt}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>


  );

  return (
    <ImageBackground
      source={require('../../assets/journalBG.jpeg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}> Explore Journals </Text>


        {/* List of Saved Journals */}
        <FlatList
          data={journals}
          renderItem={renderJournalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.journalList}
        />


      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginTop: 30,
  },
  btncontainer: {
    marginBottom: 20,
  },
  journalList: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#5a4032',
  },
  journalItem: {
    borderRadius: 10, 
    overflow: 'hidden', 
    marginBottom: 20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  journalImage: {
    width: '100%', 
    height: 100, 
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 10, 
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 100,
    justifyContent: 'center',
  },
  journalTitle: {
    fontSize: 26,
    color: '#000',
    fontFamily: 'PatricHand'
  },
  journalDate: {
    fontSize: 14,
    color: '#7a7a7a',
    textAlign: 'right',
    marginTop: 10,
    fontFamily: 'PatricHand'
  },
});

export default PublicJournals;

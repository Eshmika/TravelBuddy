import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig'; // Adjust the path as needed
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Bar as ProgressBar } from 'react-native-progress'; // Import the Bar component from react-native-progress

export default function MyGoalList({ navigation }) {
  const [goalList, setGoalList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsCollection = collection(db, 'GoalList');
        const goalsSnapshot = await getDocs(goalsCollection);
        const goalsList = goalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGoalList(goalsList);
      } catch (error) {
        console.error("Error fetching goal list: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Function to handle goal deletion
  const deleteGoal = async (goalId) => {
    try {
      await deleteDoc(doc(db, 'GoalList', goalId));
      setGoalList(prevGoals => prevGoals.filter(goal => goal.id !== goalId)); // Update the list after deletion
    } catch (error) {
      console.error("Error deleting goal: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {goalList.map(goal => (
        <TouchableOpacity 
          key={goal.id} 
          style={styles.card} 
          onPress={() => navigation.navigate('TravelUpdate', { goalId: goal.id })}
        >
          <Image source={{ uri: goal.image }} style={styles.image} />
          <Text style={styles.title}>{goal.title}</Text>
          
          {/* Progress Bar */}
          <ProgressBar 
            progress={goal.progress || 0} // Show progress; default to 0 if progress field is missing
            width={null}
            height={8}
            borderWidth={0}
            color="#5e4f34" // Custom color for the progress bar
            style={styles.progressBar}
          />
          
          {/* Progress Percentage */}
          <Text style={styles.progressText}>{Math.round((goal.progress || 0) * 100)}% completed</Text>

          <ScrollView style={styles.descriptionContainer} horizontal showsHorizontalScrollIndicator={false}>
            {/* <Text style={styles.description}>{goal.description}</Text> */}
          </ScrollView>

          {/* Delete Button */}
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => deleteGoal(goal.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressBar: {
    marginTop: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5e4f34',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#5e4f34',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

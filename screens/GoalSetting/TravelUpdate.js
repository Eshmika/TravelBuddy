import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Bar as ProgressBar } from 'react-native-progress';

export default function TravelUpdate({ route }) {
  const { goalId } = route.params;
  const [goal, setGoal] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [form, setForm] = useState({
    accommodation: 'Not Yet',
    healthAdvisor: 'Not Yet',
    travelJournal: 'Not Yet',
    visited: 'Not Yet',
    itinerary: 'Not Yet',
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goalDoc = doc(db, 'GoalList', goalId);
        const goalSnapshot = await getDoc(goalDoc);
        if (goalSnapshot.exists()) {
          const data = goalSnapshot.data();
          setGoal(data);
          setForm({
            accommodation: data.accommodation || 'Not Yet',
            healthAdvisor: data.healthAdvisor || 'Not Yet',
            travelJournal: data.travelJournal || 'Not Yet',
            visited: data.visited || 'Not Yet',
            itinerary: data.itinerary || 'Not Yet',
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate ? new Date(data.endDate) : new Date(),
          });
        }
      } catch (error) {
        console.error("Error fetching goal details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [goalId]);

  useEffect(() => {
    const calculateProgress = () => {
      const relevantFields = {
        accommodation: form.accommodation,
        healthAdvisor: form.healthAdvisor,
        travelJournal: form.travelJournal,
        visited: form.visited,
        itinerary: form.itinerary,
      };
      
      const values = Object.values(relevantFields);
      const completed = values.filter(value => value === 'Done').length;
      const totalFields = values.length;
      const progressValue = completed / totalFields;
  
      setProgress(progressValue);
  
      if (progressValue === 1) {
        Alert.alert(
          "Congratulations!",
          "You have successfully completed your travel goal.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    };
  
    calculateProgress();
  }, [form]);

  const handleFormChange = (field, value) => {
    setForm(prevForm => ({ ...prevForm, [field]: value }));
  };

  const handleDateChange = (event, selectedDate, field) => {
    const currentDate = selectedDate || form[field];
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    handleFormChange(field, currentDate);
  };

  const handleSubmit = async () => {
    try {
      const goalRef = doc(db, 'GoalList', goalId);
      await updateDoc(goalRef, {
        ...form,
        progress,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),
      });
      Alert.alert("Success", "Progress updated!");
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset your progress?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: resetProgress }
      ],
      { cancelable: false }
    );
  };

  const resetProgress = () => {
    setForm({
      accommodation: 'Not Yet',
      healthAdvisor: 'Not Yet',
      travelJournal: 'Not Yet',
      visited: 'Not Yet',
      itinerary: 'Not Yet',
      startDate: new Date(),
      endDate: new Date(),
    });
    setProgress(0);
    Alert.alert("Success", "Progress has been reset!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: goal.image }} style={styles.image} />
      <Text style={styles.title}>{goal.title}</Text>

      <ProgressBar
        progress={progress}
        width={null}
        height={8}
        borderWidth={0}
        color={progress === 1 ? "#76c7c0" : "#4caf50"} // Color changes when complete
        style={styles.progressBar}
      />

      <View style={styles.form}>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.label}>Start Date: {form.startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={form.startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'startDate')}
          />
        )}

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.label}>End Date: {form.endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={form.endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'endDate')}
          />
        )}

        {renderFormField('Accommodation', 'accommodation', form.accommodation, handleFormChange)}
        {renderFormField('Health Advisor', 'healthAdvisor', form.healthAdvisor, handleFormChange)}
        {renderFormField('Start Travel Journal', 'travelJournal', form.travelJournal, handleFormChange)}
        {renderFormField('Visited', 'visited', form.visited, handleFormChange)}
        {renderFormField('Itinerary', 'itinerary', form.itinerary, handleFormChange)}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleResetProgress}>
          <Text style={styles.buttonText}>Reset Progress</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const renderFormField = (label, field, value, onChange) => (
  <View style={styles.fieldContainer} key={field}>
    <Text style={styles.label}>{label}</Text>
    <RNPickerSelect
      onValueChange={(value) => onChange(field, value)}
      value={value}
      items={[
        { label: 'Done', value: 'Done' },
        { label: 'Not Yet', value: 'Not Yet' },
      ]}
      style={pickerSelectStyles}
    />
  </View>
);

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  progressBar: {
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  datePicker: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


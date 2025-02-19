// screens/ExerciseTracker.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import WorkoutContext from "../context/WorkoutContext";

const ExerciseTracker = ({ navigation }) => {
  const { workouts, trackSession } = useContext(WorkoutContext);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentSession, setCurrentSession] = useState([]);

  const logSet = (exerciseIndex, setIndex, field, value) => {
    const updatedSession = [...currentSession];
    if (!updatedSession[exerciseIndex]) {
      updatedSession[exerciseIndex] = {
        name: selectedWorkout.exercises[exerciseIndex].name,
        sets: [],
      };
    }
    updatedSession[exerciseIndex].sets[setIndex] = {
      ...updatedSession[exerciseIndex].sets[setIndex],
      [field]: Number(value),
      completed: true,
    };
    setCurrentSession(updatedSession);
  };

  const renderSet = (exercise, exerciseIndex, set, setIndex) => (
    <View key={setIndex} style={styles.set}>
      <Text style={styles.setText}>Set {setIndex + 1}</Text>
      <View style={styles.setInputs}>
        <TextInput
          placeholder="kg"
          keyboardType="numeric"
          onChangeText={(t) => logSet(exerciseIndex, setIndex, "weight", t)}
          style={[styles.input, styles.weightInput]}
        />
        <TextInput
          placeholder={`${set.reps} reps`}
          keyboardType="numeric"
          onChangeText={(t) => logSet(exerciseIndex, setIndex, "reps", t)}
          style={[styles.input, styles.repsInput]}
        />
        <TouchableOpacity
          style={[
            styles.completeButton,
            currentSession[exerciseIndex]?.sets[setIndex]?.completed &&
              styles.completedButton,
          ]}
          onPress={() => logSet(exerciseIndex, setIndex, "completed", true)}
        >
          <Text style={styles.completeButtonText}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const saveSession = () => {
    trackSession({
      date: new Date().toISOString(),
      workout: selectedWorkout.name,
      exercises: currentSession,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {!selectedWorkout ? (
        <FlatList
          data={workouts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => setSelectedWorkout(item)}
            />
          )}
        />
      ) : (
        <View style={styles.sessionContainer}>
          <Text style={styles.title}>{selectedWorkout.name}</Text>
          <FlatList
            data={selectedWorkout.exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.exercise}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                {item.sets.map((set, setIndex) =>
                  renderSet(item, index, set, setIndex)
                )}
              </View>
            )}
          />
          <Button
            title="Complete Workout"
            onPress={saveSession}
            disabled={
              !currentSession.every((ex) =>
                ex?.sets?.every((set) => set?.completed)
              )
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ...existing styles...
  setInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightInput: {
    width: 80,
    textAlign: "center",
  },
  repsInput: {
    width: 60,
    textAlign: "center",
  },
  completeButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginLeft: 10,
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  completeButtonText: {
    color: "white",
  },
});

export default ExerciseTracker;

import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const EditWorkout = ({ route, navigation }) => {
  const { workout: initialWorkout } = route.params;
  const { saveWorkout } = useContext(WorkoutContext);
  const [workout, setWorkout] = useState(initialWorkout);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [tempSets, setTempSets] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const notificationOpacity = useRef(new Animated.Value(0)).current;
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState("3");
  const [newExerciseReps, setNewExerciseReps] = useState("12");

  const showNotification = (message) => {
    setNotificationText(message);
    setNotification(true);
    notificationOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(notificationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setNotification(false));
  };

  const handleDeleteExercise = (exerciseToDelete) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(
        (ex) => ex.name !== exerciseToDelete.name
      ),
    };

    setWorkout(updatedWorkout);
    saveWorkout(updatedWorkout);
    showNotification(`Removed ${exerciseToDelete.name}`);
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setTempSets(exercise.sets.length.toString());
    setTempReps(exercise.sets[0].reps.toString());
    setEditModal(true);
  };

  const handleSaveExerciseEdit = () => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map((ex) => {
        if (ex.name === editingExercise.name) {
          return {
            ...ex,
            sets: Array(parseInt(tempSets)).fill({
              weight: 0,
              reps: parseInt(tempReps),
              completed: false,
            }),
          };
        }
        return ex;
      }),
    };
    saveWorkout(updatedWorkout);
    setEditModal(false);
    setEditingExercise(null);
  };

  const handleAddManualExercise = () => {
    if (!newExerciseName.trim()) {
      showNotification("Please enter an exercise name");
      return;
    }

    const newExercise = {
      name: newExerciseName.trim(),
      sets: Array(parseInt(newExerciseSets)).fill({
        weight: 0,
        reps: parseInt(newExerciseReps),
        completed: false,
      }),
    };

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };

    saveWorkout(updatedWorkout);
    setWorkout(updatedWorkout);
    setShowAddManualModal(false);
    setNewExerciseName("");
    setNewExerciseSets("3");
    setNewExerciseReps("12");
    showNotification(`Added ${newExerciseName}`);
  };

  const renderExercise = ({ item }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditExercise(item)}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={COLORS.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteExercise(item)}
          >
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color={COLORS.accent}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.exerciseDetail}>
        {item.sets.length} sets × {item.sets[0].reps} reps
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {notification && (
            <Animated.View
              style={[
                styles.notification,
                {
                  opacity: notificationOpacity,
                  transform: [
                    {
                      translateY: notificationOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={COLORS.text}
              />
              <Text style={styles.notificationText}>{notificationText}</Text>
            </Animated.View>
          )}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Workout</Text>
          </View>

          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.exerciseCount}>
              {workout.exercises.length} exercises
            </Text>
          </View>

          <FlatList
            data={workout.exercises}
            renderItem={renderExercise}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No exercises added yet</Text>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddManualModal(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color={COLORS.text} />
            <Text style={styles.addButtonText}>Add Custom Exercise</Text>
          </TouchableOpacity>

          <Modal
            visible={editModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setEditModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Exercise</Text>
                <Text style={styles.exerciseNameLabel}>
                  {editingExercise?.name}
                </Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={styles.input}
                      value={tempSets}
                      onChangeText={setTempSets}
                      keyboardType="numeric"
                      placeholder="Sets"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.input}
                      value={tempReps}
                      onChangeText={setTempReps}
                      keyboardType="numeric"
                      placeholder="Reps"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveExerciseEdit}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showAddManualModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowAddManualModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Custom Exercise</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Exercise Name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={newExerciseName}
                  onChangeText={setNewExerciseName}
                />

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sets</Text>
                    <TextInput
                      style={styles.input}
                      value={newExerciseSets}
                      onChangeText={setNewExerciseSets}
                      keyboardType="numeric"
                      placeholder="3"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Reps</Text>
                    <TextInput
                      style={styles.input}
                      value={newExerciseReps}
                      onChangeText={setNewExerciseReps}
                      keyboardType="numeric"
                      placeholder="12"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowAddManualModal(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleAddManualExercise}
                  >
                    <Text style={styles.buttonText}>Add Exercise</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradient1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 15,
  },
  workoutInfo: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  exerciseCount: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  exerciseItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  exerciseDetail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    color: COLORS.text,
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.gradient1,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  exerciseNameLabel: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 20,
    opacity: 0.8,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: COLORS.text,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: COLORS.accent,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  notification: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    color: COLORS.text,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EditWorkout;

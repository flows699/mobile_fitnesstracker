import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const EditWorkout = ({ route, navigation }) => {
  const { workout } = route.params;
  const { saveWorkout } = useContext(WorkoutContext);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [tempSets, setTempSets] = useState("");
  const [tempReps, setTempReps] = useState("");

  const handleDeleteExercise = (exerciseToDelete) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(
        (ex) => ex.name !== exerciseToDelete.name
      ),
    };
    saveWorkout(updatedWorkout);
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
});

export default EditWorkout;

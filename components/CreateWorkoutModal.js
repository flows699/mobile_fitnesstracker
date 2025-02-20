import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const CreateWorkoutModal = ({ visible, onClose, onSuccess }) => {
  const [workoutName, setWorkoutName] = useState("");
  const { saveWorkout } = useContext(WorkoutContext);

  const handleCreate = () => {
    if (workoutName.trim()) {
      const newWorkout = {
        name: workoutName,
        exercises: [],
        date: new Date().toISOString(),
      };
      saveWorkout(newWorkout);
      setWorkoutName("");
      onSuccess && onSuccess(newWorkout);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={50}
            color={COLORS.accent}
          />
          <Text style={styles.modalTitle}>Create New Workout</Text>

          <TextInput
            style={styles.input}
            placeholder="Workout Name"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={workoutName}
            onChangeText={setWorkoutName}
            autoFocus={true}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.createButton]}
              onPress={handleCreate}
              disabled={!workoutName.trim()}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.gradient1,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    width: "90%",
    maxWidth: 340,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  createButton: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateWorkoutModal;

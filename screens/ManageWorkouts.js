import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/HomeScreenStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { WorkoutContext } from "../context/WorkoutContext";
import CreateWorkoutModal from "../components/CreateWorkoutModal";

const ManageWorkouts = ({ navigation }) => {
  const { workouts, deleteWorkout } = useContext(WorkoutContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = (workout) => {
    setWorkoutToDelete(workout);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteWorkout(workoutToDelete);
    setDeleteModal(false);
    setWorkoutToDelete(null);
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={styles.workoutItem}
      onPress={() => navigation.navigate("EditWorkout", { workout: item })}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("EditWorkout", { workout: item })
            }
          >
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={COLORS.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item)}
          >
            <MaterialCommunityIcons
              name="delete"
              size={24}
              color={COLORS.accent}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.exerciseCount}>
        {item.exercises?.length || 0} exercises
      </Text>
    </TouchableOpacity>
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
            <Text style={styles.title}>Manage Workouts</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateModal(true)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={30}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          {!workouts || workouts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={50}
                color={COLORS.accent}
              />
              <Text style={styles.emptyText}>No workouts created yet</Text>
            </View>
          ) : (
            <FlatList
              data={workouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.list}
            />
          )}

          <CreateWorkoutModal
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => setShowCreateModal(false)} // Just close the modal
          />

          <Modal
            visible={deleteModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDeleteModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={50}
                  color={COLORS.accent}
                />
                <Text style={styles.modalTitle}>Delete Workout</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete "{workoutToDelete?.name}"?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={confirmDelete}
                  >
                    <Text
                      style={[styles.modalButtonText, styles.deleteButtonText]}
                    >
                      Delete
                    </Text>
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 15,
  },
  workoutItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  workoutName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  exerciseCount: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  list: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    marginTop: 10,
  },
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
  modalText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
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
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  modalButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButtonText: {
    color: "#ffffff",
  },
  addButton: {
    padding: 5,
  },
});

export default ManageWorkouts;

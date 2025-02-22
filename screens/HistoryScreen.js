import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const HistoryScreen = ({ navigation }) => {
  const { trainingHistory, deleteTrainingSession, clearAllData } =
    useContext(WorkoutContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const sortedHistory = [...trainingHistory].reverse();

  const handleDelete = (session) => {
    setSessionToDelete(session);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (await deleteTrainingSession(sessionToDelete.date)) {
      setDeleteModal(false);
      setSessionToDelete(null);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all workout history and progress data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
          },
        },
      ]
    );
  };

  const renderWorkoutSession = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View>
          <Text style={styles.workoutName}>{item.workoutName}</Text>
          <Text style={styles.workoutDate}>
            {new Date(item.date).toLocaleDateString()} •{" "}
            {item.exercises?.length || 0} exercises
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={COLORS.accent}
          />
        </TouchableOpacity>
      </View>
      {item.exercises?.map((exercise, index) => (
        <View key={index} style={styles.exerciseItem}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseSets}>
            {exercise.sets
              ?.map((set, i) => `${set.weight}kg × ${set.reps}`)
              .join(", ")}
          </Text>
        </View>
      ))}
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
            <Text style={styles.title}>History</Text>
          </View>

          {/* Add Progress Charts Button */}
          <TouchableOpacity
            style={styles.chartsButton}
            onPress={() => navigation.navigate("Progress")}
          >
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color={COLORS.text}
            />
            <Text style={styles.chartsButtonText}>View Progress Charts</Text>
          </TouchableOpacity>

          {sortedHistory.length > 0 && (
            <TouchableOpacity
              style={[
                styles.chartsButton,
                { backgroundColor: "#ff3b30", marginBottom: 10 },
              ]}
              onPress={handleClearAll}
            >
              <MaterialCommunityIcons
                name="delete-sweep"
                size={24}
                color={COLORS.text}
              />
              <Text style={styles.chartsButtonText}>Clear All Data</Text>
            </TouchableOpacity>
          )}

          {/* Remove debug clear button */}

          {!sortedHistory || sortedHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="history"
                size={50}
                color={COLORS.accent}
              />
              <Text style={styles.emptyText}>
                No workout history yet.{"\n"}Complete some workouts to see them
                here!
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedHistory}
              renderItem={renderWorkoutSession}
              keyExtractor={(item) => item.date}
              contentContainerStyle={styles.list}
            />
          )}

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
                  Are you sure you want to delete this workout session?
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
  },
  list: {
    flexGrow: 1,
  },
  historyItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  workoutName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  workoutDate: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  exerciseItem: {
    marginTop: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },
  exerciseSets: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
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
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
  chartsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  chartsButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default HistoryScreen;

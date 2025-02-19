import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import WorkoutContext from "../context/WorkoutContext";
import { COLORS } from "../styles/HomeScreenStyle";
import { WORKOUT_TEMPLATES } from "../data/workoutTemplates";

const ManageWorkouts = ({ navigation }) => {
  const { workouts, saveWorkout } = useContext(WorkoutContext);
  const [showTemplates, setShowTemplates] = useState(true);

  // Add this safety check
  const templates = Object.values(WORKOUT_TEMPLATES || {});

  const deleteWorkout = (workoutToDelete) => {
    const updatedWorkouts = workouts.filter(
      (w) => w.name !== workoutToDelete.name
    );
    saveWorkout(updatedWorkouts);
  };

  const renderWorkoutCard = (item, isTemplate = false) => (
    <View style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View>
          <Text style={styles.workoutName}>{item.name}</Text>
          {isTemplate && (
            <Text style={styles.templateTag}>PRE-MADE TEMPLATE</Text>
          )}
          {isTemplate && (
            <Text style={styles.templateDescription}>{item.description}</Text>
          )}
        </View>
        <Text style={styles.exerciseCount}>
          {item.exercises.length} exercises
        </Text>
      </View>

      <View style={styles.exerciseList}>
        {item.exercises.map((exercise, idx) => (
          <Text key={idx} style={styles.exerciseItem}>
            • {exercise.name} ({exercise.sets.length} × {exercise.sets[0].reps})
          </Text>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() =>
            navigation.navigate("PlanWorkout", {
              editWorkout: item,
              isTemplate: isTemplate,
            })
          }
        >
          <Ionicons name="create-outline" size={20} color={COLORS.text} />
          <Text style={styles.buttonText}>
            {isTemplate ? "Use Template" : "Edit"}
          </Text>
        </TouchableOpacity>

        {!isTemplate && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => deleteWorkout(item)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.text} />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>WORKOUT{"\n"}LIBRARY</Text>

          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, showTemplates && styles.activeSegment]}
              onPress={() => setShowTemplates(true)}
            >
              <Text style={styles.segmentText}>Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, !showTemplates && styles.activeSegment]}
              onPress={() => setShowTemplates(false)}
            >
              <Text style={styles.segmentText}>My Workouts</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={showTemplates ? templates : workouts}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => renderWorkoutCard(item, showTemplates)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {showTemplates ? "No templates available" : "No workouts saved"}
              </Text>
            }
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.gradient1,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  workoutCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  exerciseCount: {
    color: COLORS.accent,
    fontSize: 14,
  },
  exerciseList: {
    marginBottom: 15,
  },
  exerciseItem: {
    color: "rgba(255,255,255,0.7)",
    marginVertical: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteButton: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  templateTag: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  templateDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 4,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeSegment: {
    backgroundColor: COLORS.accent,
    borderRadius: 6,
  },
  segmentText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  emptyText: {
    color: COLORS.text,
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
});

export default ManageWorkouts;

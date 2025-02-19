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
import styles from "../styles/ManageWorkoutsStyle";

const ManageWorkouts = ({ navigation }) => {
  const { workouts, saveWorkout } = useContext(WorkoutContext);
  const [showTemplates, setShowTemplates] = useState(true);

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

export default ManageWorkouts;

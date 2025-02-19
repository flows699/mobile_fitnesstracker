import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import WorkoutContext from "../context/WorkoutContext";
import { getExercisesByBodyPart, bodyParts } from "../services/exerciseAPI";
import styles from "../styles/WorkoutPlannerStyle";
import { COLORS } from "../constants/theme";

const WorkoutPlanner = ({ navigation, route }) => {
  const templateWorkout = route.params?.editWorkout || null;
  const isTemplate = route.params?.isTemplate || false;

  // Initialize state with template data if available, with proper default values
  const [workoutName, setWorkoutName] = useState(templateWorkout?.name || "");
  const [exercises, setExercises] = useState(templateWorkout?.exercises || []);
  const [exerciseName, setExerciseName] = useState("");
  const [setsCount, setSetsCount] = useState("3");
  const [targetReps, setTargetReps] = useState("12");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableExercises, setAvailableExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { saveWorkout } = useContext(WorkoutContext);

  useEffect(() => {
    if (selectedCategory) {
      loadExercises();
    }
  }, [selectedCategory]);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const exercises = await getExercisesByBodyPart(selectedCategory);
      setAvailableExercises(exercises);
    } catch (error) {
      console.error("Error loading exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExercise = () => {
    if (exerciseName) {
      setExercises([
        ...exercises,
        {
          name: exerciseName,
          sets: Array(parseInt(setsCount)).fill({
            weight: 0,
            reps: parseInt(targetReps),
            completed: false,
          }),
          notes: "",
        },
      ]);
      setExerciseName("");
    }
  };

  const savePlan = () => {
    saveWorkout({
      name: workoutName,
      exercises,
      date: new Date().toISOString(),
      isFromTemplate: isTemplate,
      originalTemplate: isTemplate ? templateWorkout.name : null,
    });
    navigation.goBack();
  };

  // Add this helper function
  const cleanDescription = (description) => {
    if (!description) return "";
    return description
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace
  };

  const ExerciseModal = () => (
    <Modal
      visible={showExerciseModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowExerciseModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowExerciseModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Exercise</Text>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.accent} />
                  <Text style={styles.loadingText}>Loading exercises...</Text>
                </View>
              ) : (
                <FlatList
                  data={availableExercises}
                  keyExtractor={(item, index) =>
                    `exercise-${item.id}-${index}-${Date.now()}`
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.exerciseItem}
                      onPress={() => {
                        setExerciseName(item.name);
                        setShowExerciseModal(false);
                      }}
                    >
                      <Text style={styles.exerciseItemText}>{item.name}</Text>
                      <Text style={styles.exerciseDescription}>
                        {cleanDescription(item.description)?.slice(0, 100)}
                        {item.description?.length > 100 ? "..." : ""}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text
                      style={[styles.exerciseItemText, { textAlign: "center" }]}
                    >
                      No exercises found
                    </Text>
                  }
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowExerciseModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Safely render exercises list
  const renderExercisesList = () => {
    if (!exercises || exercises.length === 0) {
      return (
        <Text
          style={[styles.exerciseTitle, { textAlign: "center", padding: 20 }]}
        >
          No exercises added yet
        </Text>
      );
    }

    return (
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => `workout-exercise-${item.name}-${index}`} // Updated keyExtractor
        renderItem={({ item, index }) => (
          <View style={styles.exercise}>
            <Text style={styles.exerciseTitle}>{item.name}</Text>
            <Text style={styles.exerciseSubtitle}>
              {item.sets?.length || 0} sets × {item.sets?.[0]?.reps || 0} reps
            </Text>
            <TouchableOpacity
              onPress={() => {
                const newExercises = [...exercises];
                newExercises.splice(index, 1);
                setExercises(newExercises);
              }}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  const renderCategorySelector = () => (
    <View style={styles.categorySelector}>
      <Text style={styles.label}>SELECT CATEGORY</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {bodyParts &&
          bodyParts.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryButtonText}>
                {category.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          {/* Add Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {isTemplate ? "CUSTOMIZE\nTEMPLATE" : "CREATE\nWORKOUT"}
          </Text>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Workout Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={workoutName}
              onChangeText={setWorkoutName}
              style={styles.input}
            />

            {renderCategorySelector()}

            <TouchableOpacity
              style={styles.selectExerciseButton}
              onPress={() => setShowExerciseModal(true)}
            >
              <Ionicons
                name="fitness-outline"
                size={24}
                color={COLORS.accent}
              />
              <Text style={styles.selectExerciseText}>SELECT EXERCISE</Text>
            </TouchableOpacity>

            <View style={styles.exerciseForm}>
              <TextInput
                placeholder="Exercise Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={exerciseName}
                onChangeText={setExerciseName}
                style={styles.input}
              />
              <View style={styles.row}>
                <TextInput
                  placeholder="Sets"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={setsCount}
                  onChangeText={setSetsCount}
                  keyboardType="numeric"
                  style={[styles.input, styles.numberInput]}
                />
                <TextInput
                  placeholder="Target Reps"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={targetReps}
                  onChangeText={setTargetReps}
                  keyboardType="numeric"
                  style={[styles.input, styles.numberInput]}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={COLORS.accent}
                />
                <Text style={styles.addButtonText}>ADD EXERCISE</Text>
              </TouchableOpacity>
            </View>

            {renderExercisesList()}

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!workoutName || !exercises?.length) &&
                  styles.saveButtonDisabled,
              ]}
              onPress={savePlan}
              disabled={!workoutName || !exercises?.length}
            >
              <Text style={styles.saveButtonText}>
                {isTemplate ? "SAVE CUSTOM WORKOUT" : "SAVE WORKOUT"}
              </Text>
            </TouchableOpacity>
          </View>

          {showExerciseModal && <ExerciseModal />}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default WorkoutPlanner;

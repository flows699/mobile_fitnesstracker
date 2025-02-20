import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const ExerciseTracker = ({ navigation }) => {
  const { workouts, saveTrainingSession } = useContext(WorkoutContext);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exerciseData, setExerciseData] = useState({});
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationIsError, setNotificationIsError] = useState(false);
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  const showNotification = (message, isError = false) => {
    setNotificationText(message);
    setNotificationIsError(isError);
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

  const handleSetComplete = (exerciseIndex, setIndex, weight, reps) => {
    setExerciseData((prev) => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        sets: {
          ...prev[exerciseIndex]?.sets,
          [setIndex]: { weight, reps, completed: true },
        },
      },
    }));
  };

  const handleSaveExercise = async (exercise, index) => {
    const currentExerciseData = exerciseData[index];
    if (!currentExerciseData || !currentExerciseData.sets) {
      showNotification("Please enter data before saving", true);
      return;
    }

    const setsArray = Object.values(currentExerciseData.sets);
    const allSetsCompleted =
      setsArray.length === exercise.sets.length &&
      setsArray.every((set) => set && set.weight && set.reps);

    if (!allSetsCompleted) {
      showNotification("Please complete all sets before saving", true);
      return;
    }

    const exerciseRecord = {
      name: exercise.name,
      date: new Date().toISOString(),
      sets: setsArray,
      workoutName: selectedWorkout.name,
    };

    const saveSuccess = await saveTrainingSession(exerciseRecord);

    if (saveSuccess) {
      showNotification(`${exercise.name} progress saved!`);
    } else {
      showNotification("Error saving progress", true);
    }
  };

  const handleAddSet = (exerciseIndex) => {
    const exercise = selectedWorkout.exercises[exerciseIndex];
    const currentSets = exercise.sets.length;
    const lastSet = exercise.sets[currentSets - 1];

    setExerciseData((prev) => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        sets: {
          ...prev[exerciseIndex]?.sets,
          [currentSets]: { weight: "", reps: lastSet.reps, completed: false },
        },
      },
    }));

    // Update workout exercise sets
    const updatedExercises = [...selectedWorkout.exercises];
    updatedExercises[exerciseIndex].sets.push({ ...lastSet, completed: false });
    setSelectedWorkout({
      ...selectedWorkout,
      exercises: updatedExercises,
    });
  };

  const handleRemoveSet = (exerciseIndex) => {
    if (selectedWorkout.exercises[exerciseIndex].sets.length <= 1) return;

    const updatedExercises = [...selectedWorkout.exercises];
    updatedExercises[exerciseIndex].sets.pop();

    setSelectedWorkout({
      ...selectedWorkout,
      exercises: updatedExercises,
    });

    // Update exercise data
    const updatedSets = { ...exerciseData[exerciseIndex]?.sets };
    delete updatedSets[Object.keys(updatedSets).length - 1];

    setExerciseData((prev) => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        sets: updatedSets,
      },
    }));
  };

  const handleFinishWorkout = async () => {
    // Check if any exercises were completed
    const completedExercises = Object.entries(exerciseData)
      .map(([index, data]) => ({
        name: selectedWorkout.exercises[index].name,
        sets: Object.values(data.sets || {}),
        date: new Date().toISOString(),
      }))
      .filter((exercise) => exercise.sets.length > 0);

    if (completedExercises.length === 0) {
      showNotification("No exercises completed yet", true);
      return;
    }

    // Create workout session record
    const workoutSession = {
      workoutName: selectedWorkout.name,
      date: new Date().toISOString(),
      exercises: completedExercises,
    };

    const success = await saveTrainingSession(workoutSession);

    if (success) {
      showNotification("Workout completed!");
      setTimeout(() => {
        navigation.navigate("History");
      }, 1500);
    } else {
      showNotification("Error saving workout", true);
    }
  };

  const renderExercise = ({ item, index }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleSaveExercise(item, index)}
        >
          <MaterialCommunityIcons
            name="content-save"
            size={24}
            color={COLORS.accent}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.setControls}>
        <TouchableOpacity
          style={styles.setControlButton}
          onPress={() => handleRemoveSet(index)}
        >
          <MaterialCommunityIcons name="minus" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.setsCount}>{item.sets.length} sets</Text>
        <TouchableOpacity
          style={styles.setControlButton}
          onPress={() => handleAddSet(index)}
        >
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {item.sets.map((set, setIndex) => (
        <View key={`${index}-${setIndex}`} style={styles.setContainer}>
          <Text style={styles.setText}>Set {setIndex + 1}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="rgba(255,255,255,0.5)"
              onChangeText={(weight) => {
                const reps = exerciseData[index]?.sets?.[setIndex]?.reps || "";
                handleSetComplete(index, setIndex, weight, reps);
              }}
              value={exerciseData[index]?.sets?.[setIndex]?.weight || ""}
            />
            <Text style={styles.inputLabel}>kg</Text>
            <Text style={styles.multiply}>×</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="rgba(255,255,255,0.5)"
              onChangeText={(reps) => {
                const weight =
                  exerciseData[index]?.sets?.[setIndex]?.weight || "";
                handleSetComplete(index, setIndex, weight, reps);
              }}
              value={exerciseData[index]?.sets?.[setIndex]?.reps || ""}
            />
            <Text style={styles.inputLabel}>reps</Text>
          </View>
        </View>
      ))}
    </View>
  );

  if (!selectedWorkout) {
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
              <Text style={styles.title}>Select Workout</Text>
            </View>
            <FlatList
              data={workouts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.workoutCard}
                  onPress={() => setSelectedWorkout(item)}
                >
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <Text style={styles.exerciseCount}>
                    {item.exercises.length} exercises
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <SafeAreaView style={styles.safeArea}>
            {notification && (
              <Animated.View
                style={[
                  styles.notification,
                  notificationIsError && styles.errorNotification,
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
                  name={notificationIsError ? "alert-circle" : "check-circle"}
                  size={20}
                  color={COLORS.text}
                />
                <Text style={styles.notificationText}>{notificationText}</Text>
              </Animated.View>
            )}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setSelectedWorkout(null)}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color={COLORS.text}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{selectedWorkout.name}</Text>
            </View>
            <FlatList
              data={selectedWorkout.exercises}
              renderItem={renderExercise}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              style={[
                styles.finishButton,
                { marginBottom: Platform.OS === "ios" ? 20 : 0 },
              ]}
              onPress={handleFinishWorkout}
            >
              <Text style={styles.finishButtonText}>Finish Workout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
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
  workoutCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  workoutName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  exerciseCount: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 5,
  },
  exerciseCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  setContainer: {
    marginTop: 10,
  },
  setText: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    width: 60,
    color: COLORS.text,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  inputLabel: {
    color: "rgba(255,255,255,0.7)",
  },
  multiply: {
    color: COLORS.text,
    fontSize: 18,
    marginHorizontal: 5,
  },
  saveButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  finishButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  finishButtonText: {
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
  errorNotification: {
    backgroundColor: "#ff3b30",
  },
  notificationText: {
    color: COLORS.text,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  setControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  setControlButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
  },
  setsCount: {
    color: COLORS.text,
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 100, // Increased padding to ensure space for keyboard
  },
});

export default ExerciseTracker;

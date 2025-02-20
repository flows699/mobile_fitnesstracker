import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/HomeScreenStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchExercisesByMuscle } from "../services/exerciseAPI";
import { WorkoutContext } from "../context/WorkoutContext";

const ExerciseList = ({ route, navigation }) => {
  const { muscleGroup } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const { workouts, saveWorkout } = useContext(WorkoutContext);
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const notificationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, exercises]);

  const loadExercises = async () => {
    const data = await fetchExercisesByMuscle(muscleGroup);
    setExercises(data);
    setLoading(false);
  };

  const filterExercises = () => {
    const filtered = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const handleAddExercise = (exercise) => {
    setSelectedExercise(exercise);
    setShowWorkoutModal(true);
  };

  const showNotification = (message) => {
    setNotificationText(message);
    setNotification(true);
    notificationOpacity.setValue(0); // Reset opacity before animation

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
    ]).start(() => {
      setNotification(false);
    });
  };

  const handleSaveToWorkout = (workout) => {
    const updatedWorkout = {
      ...workout,
      exercises: [
        ...workout.exercises,
        {
          name: selectedExercise.name,
          sets: Array(3).fill({ weight: 0, reps: 12, completed: false }),
          notes: "",
        },
      ],
    };
    saveWorkout(updatedWorkout);
    setShowWorkoutModal(false);
    setSelectedExercise(null);
    showNotification(`Added ${selectedExercise.name} to ${workout.name}`);
  };

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleAddExercise(item)}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={24}
            color={COLORS.accent}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.exerciseDescription}>
        {item.description.replace(/<[^>]*>/g, "")}
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
            <Text style={styles.title}>{muscleGroup.name} Exercises</Text>
          </View>

          <View style={styles.searchContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={COLORS.text}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
            />
          )}

          <Modal
            visible={showWorkoutModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowWorkoutModal(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowWorkoutModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Workout</Text>
                <FlatList
                  data={workouts}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.workoutItem}
                      onPress={() => handleSaveToWorkout(item)}
                    >
                      <Text style={styles.workoutName}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </TouchableOpacity>
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
  exerciseItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  exerciseDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 10,
    fontSize: 16,
  },
  comingSoon: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchIcon: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.gradient1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  workoutItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  workoutName: {
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
});

export default ExerciseList;

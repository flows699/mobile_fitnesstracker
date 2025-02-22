// context/WorkoutContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    loadWorkouts();
    loadProgress();
    loadTrainingHistory();
  }, []);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem("workouts");
      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts));
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
    }
  };

  const saveWorkout = async (workout) => {
    try {
      const updatedWorkouts = workouts.map((w) =>
        w.name === workout.name ? workout : w
      );
      if (!workouts.find((w) => w.name === workout.name)) {
        updatedWorkouts.push(workout);
      }
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const deleteWorkout = async (workoutToDelete) => {
    try {
      const updatedWorkouts = workouts.filter(
        (w) => w.name !== workoutToDelete.name
      );
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("progress");
      if (savedProgress) {
        setProgressData(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const saveProgress = async (exerciseRecord) => {
    try {
      const updatedProgress = {
        ...progressData,
        [Date.now()]: exerciseRecord,
      };
      setProgressData(updatedProgress);
      await AsyncStorage.setItem("progress", JSON.stringify(updatedProgress));
      return true;
    } catch (error) {
      console.error("Error saving progress:", error);
      return false;
    }
  };

  const loadTrainingHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("trainingHistory");
      if (savedHistory) {
        setTrainingHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading training history:", error);
    }
  };

  const saveTrainingSession = async (exerciseData) => {
    try {
      console.log("Saving training session:", exerciseData); // Debug log

      // Handle single exercise tracking
      if (!exerciseData.exercises) {
        const timestamp = Date.now().toString();
        const updatedProgress = {
          ...progressData,
          [timestamp]: {
            name: exerciseData.name,
            sets: exerciseData.sets,
            date: exerciseData.date,
            isWorkout: false,
          },
        };

        setProgressData(updatedProgress);
        await AsyncStorage.setItem("progress", JSON.stringify(updatedProgress));
        return true;
      }

      // Handle complete workout session
      const updatedHistory = [...trainingHistory, exerciseData];
      setTrainingHistory(updatedHistory);
      await AsyncStorage.setItem(
        "trainingHistory",
        JSON.stringify(updatedHistory)
      );

      // Save to progress if it's a workout
      if (exerciseData.workoutName && exerciseData.exercises) {
        const updatedProgress = { ...progressData };
        exerciseData.exercises.forEach((exercise) => {
          const timestamp = Date.now().toString();
          updatedProgress[timestamp] = {
            name: exercise.name,
            sets: exercise.sets,
            date: exerciseData.date,
            isWorkout: true,
            workoutName: exerciseData.workoutName,
          };
        });

        setProgressData(updatedProgress);
        await AsyncStorage.setItem("progress", JSON.stringify(updatedProgress));
      }

      return true;
    } catch (error) {
      console.error("Error saving training session:", error);
      return false;
    }
  };

  const deleteTrainingSession = async (sessionDate) => {
    try {
      // Find the session that's being deleted
      const sessionToDelete = trainingHistory.find(
        (session) => session.date === sessionDate
      );

      if (!sessionToDelete) return false;

      // Remove from training history
      const updatedHistory = trainingHistory.filter(
        (session) => session.date !== sessionDate
      );
      await AsyncStorage.setItem(
        "trainingHistory",
        JSON.stringify(updatedHistory)
      );
      setTrainingHistory(updatedHistory);

      // Remove from progress data
      const updatedProgress = { ...progressData };
      Object.keys(updatedProgress).forEach((key) => {
        if (updatedProgress[key].date === sessionDate) {
          delete updatedProgress[key];
        }
      });

      await AsyncStorage.setItem("progress", JSON.stringify(updatedProgress));
      setProgressData(updatedProgress);

      return true;
    } catch (error) {
      console.error("Error deleting training session:", error);
      return false;
    }
  };

  // Add a new utility function to clear all data
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setTrainingHistory([]);
      setProgressData({});
      setWorkouts([]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        saveWorkout,
        deleteWorkout,
        progressData,
        saveProgress,
        trainingHistory,
        saveTrainingSession,
        deleteTrainingSession,
        clearAllData,
        setProgressData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;

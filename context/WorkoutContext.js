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
      const updatedHistory = [...trainingHistory, exerciseData];
      setTrainingHistory(updatedHistory);
      await AsyncStorage.setItem(
        "trainingHistory",
        JSON.stringify(updatedHistory)
      );
      return true;
    } catch (error) {
      console.error("Error saving training session:", error);
      return false;
    }
  };

  const deleteTrainingSession = async (sessionDate) => {
    try {
      const updatedHistory = trainingHistory.filter(
        (session) => session.date !== sessionDate
      );
      setTrainingHistory(updatedHistory);
      await AsyncStorage.setItem(
        "trainingHistory",
        JSON.stringify(updatedHistory)
      );
      return true;
    } catch (error) {
      console.error("Error deleting training session:", error);
      return false;
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
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;

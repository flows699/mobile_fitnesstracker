// context/WorkoutContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [trackedSessions, setTrackedSessions] = useState([]);

  // Load saved data on app start
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem("workouts");
      const savedSessions = await AsyncStorage.getItem("sessions");

      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
      if (savedSessions) setTrackedSessions(JSON.parse(savedSessions));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveWorkout = async (newWorkout) => {
    try {
      const updatedWorkouts = [...workouts, newWorkout];
      setWorkouts(updatedWorkouts);
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const trackSession = async (session) => {
    const updatedSessions = [...trackedSessions, session];
    setTrackedSessions(updatedSessions);
    await AsyncStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  const getProgressForExercise = (exerciseName) => {
    return trackedSessions
      .filter((session) =>
        session.exercises.some((ex) => ex.name === exerciseName)
      )
      .map((session) => ({
        date: session.date,
        maxWeight: Math.max(
          ...session.exercises
            .find((ex) => ex.name === exerciseName)
            .sets.map((set) => set.weight)
        ),
        totalVolume: session.exercises
          .find((ex) => ex.name === exerciseName)
          .sets.reduce((acc, set) => acc + set.weight * set.reps, 0),
      }));
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        saveWorkout,
        trackedSessions,
        trackSession,
        getProgressForExercise,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;

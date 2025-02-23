import React, { createContext, useState, useEffect } from "react";
import { storageService } from "../services/storageService";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Load data when app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const savedWorkouts = await storageService.loadData("WORKOUTS");
    const savedCompletedWorkouts = await storageService.loadData(
      "COMPLETED_WORKOUTS"
    );
    const savedProgress = await storageService.loadData("PROGRESS");
    const savedHistory = await storageService.loadData("TRAINING_HISTORY");
    const savedActiveWorkout = await storageService.loadData("ACTIVE_WORKOUT");

    if (savedWorkouts) setWorkouts(savedWorkouts);
    if (savedCompletedWorkouts) setCompletedWorkouts(savedCompletedWorkouts);
    if (savedProgress) setProgressData(savedProgress);
    if (savedHistory) setTrainingHistory(savedHistory);
    if (savedActiveWorkout) setActiveWorkout(savedActiveWorkout);
  };

  const saveWorkout = async (workout) => {
    try {
      // Find the index of the existing workout
      const workoutIndex = workouts.findIndex((w) => w.name === workout.name);
      let updatedWorkouts;

      if (workoutIndex >= 0) {
        // Update existing workout
        updatedWorkouts = [...workouts];
        updatedWorkouts[workoutIndex] = workout;
      } else {
        // Add new workout
        updatedWorkouts = [...workouts, workout];
      }

      setWorkouts(updatedWorkouts);
      await storageService.saveData("WORKOUTS", updatedWorkouts);
      return true;
    } catch (error) {
      console.error("Error saving workout:", error);
      return false;
    }
  };

  const completeWorkout = async (workout) => {
    try {
      const updatedCompleted = [
        ...completedWorkouts,
        {
          ...workout,
          completedAt: new Date().toISOString(),
        },
      ];
      setCompletedWorkouts(updatedCompleted);
      await storageService.saveData("COMPLETED_WORKOUTS", updatedCompleted);
      return true;
    } catch (error) {
      console.error("Error completing workout:", error);
      return false;
    }
  };

  const saveProgress = async (exerciseRecord) => {
    try {
      const updatedProgress = {
        ...progressData,
        [Date.now()]: exerciseRecord,
      };
      setProgressData(updatedProgress);
      await storageService.saveData("PROGRESS", updatedProgress);
      return true;
    } catch (error) {
      console.error("Error saving progress:", error);
      return false;
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
        await storageService.saveData("PROGRESS", updatedProgress);
        return true;
      }

      // Handle complete workout session
      const updatedHistory = [...trainingHistory, exerciseData];
      setTrainingHistory(updatedHistory);
      await storageService.saveData("TRAINING_HISTORY", updatedHistory);

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
        await storageService.saveData("PROGRESS", updatedProgress);
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
      await storageService.saveData("TRAINING_HISTORY", updatedHistory);
      setTrainingHistory(updatedHistory);

      // Remove from progress data
      const updatedProgress = { ...progressData };
      Object.keys(updatedProgress).forEach((key) => {
        if (updatedProgress[key].date === sessionDate) {
          delete updatedProgress[key];
        }
      });

      await storageService.saveData("PROGRESS", updatedProgress);
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
      await storageService.clearAllData();
      setTrainingHistory([]);
      setProgressData({});
      setWorkouts([]);
      setCompletedWorkouts([]);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const saveActiveWorkout = async (workout, exerciseData) => {
    try {
      const activeWorkoutData = {
        workout,
        exerciseData,
        timestamp: Date.now(),
      };
      await storageService.saveData("ACTIVE_WORKOUT", activeWorkoutData);
      setActiveWorkout(activeWorkoutData);
    } catch (error) {
      console.error("Error saving active workout:", error);
    }
  };

  const clearActiveWorkout = async () => {
    try {
      await storageService.removeData("ACTIVE_WORKOUT");
      setActiveWorkout(null);
    } catch (error) {
      console.error("Error clearing active workout:", error);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        completedWorkouts,
        saveWorkout,
        completeWorkout,
        progressData,
        saveProgress,
        trainingHistory,
        saveTrainingSession,
        deleteTrainingSession,
        clearAllData,
        setProgressData,
        activeWorkout,
        saveActiveWorkout,
        clearActiveWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;

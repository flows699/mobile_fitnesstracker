import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { WorkoutProvider } from "./context/WorkoutContext";
import { StatusBar } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import WorkoutPlanner from "./screens/WorkoutPlanner";
import ExerciseTracker from "./screens/ExerciseTracker";
import HistoryScreen from "./screens/HistoryScreen";
import ManageWorkouts from "./screens/ManageWorkouts";
import LoadingScreen from "./components/LoadingScreen";
import ExerciseList from "./screens/ExerciseList";
import EditWorkout from "./screens/EditWorkout";
import ProgressScreen from "./screens/ProgressScreen";

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: "#000000" },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 300,
        useNativeDriver: true,
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 300,
        useNativeDriver: true,
      },
    },
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <WorkoutProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Workout Tracker" }}
            />
            <Stack.Screen
              name="PlanWorkout"
              component={WorkoutPlanner}
              options={{ title: "Create Workout" }}
            />
            <Stack.Screen
              name="TrackWorkout"
              component={ExerciseTracker}
              options={{ title: "Track Workout" }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: "Progress History" }}
            />
            <Stack.Screen
              name="ManageWorkouts"
              component={ManageWorkouts}
              options={{ title: "Manage Workouts" }}
            />
            <Stack.Screen name="ExerciseList" component={ExerciseList} />
            <Stack.Screen name="EditWorkout" component={EditWorkout} />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{ title: "Check Progress" }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </WorkoutProvider>
  );
}

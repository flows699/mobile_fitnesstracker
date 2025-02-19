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

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <WorkoutProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#000000" },
          }}
        >
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
        </Stack.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
}

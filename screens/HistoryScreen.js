// screens/HistoryScreen.js
import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import WorkoutContext from "../context/WorkoutContext";

const HistoryScreen = () => {
  const { trackedSessions } = useContext(WorkoutContext);

  // Process data for charts
  const processExerciseData = (exerciseName) => {
    const data = trackedSessions
      .flatMap((session) =>
        session.exercises
          .filter((ex) => ex.name === exerciseName)
          .map((ex) => ({
            date: session.date,
            weight: Math.max(...ex.sets.map((set) => set.weight)),
          }))
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      labels: data.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          data: data.map((d) => d.weight),
        },
      ],
    };
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={trackedSessions}
        renderItem={({ item }) => (
          <View style={styles.session}>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            <Text>{item.workout}</Text>
            {item.exercises.map((ex, index) => (
              <View key={index}>
                <Text>{ex.name}</Text>
                <LineChart
                  data={processExerciseData(ex.name)}
                  width={300}
                  height={200}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                  }}
                />
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

// Add styles
export default HistoryScreen;

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const ProgressScreen = ({ navigation }) => {
  const { progressData } = useContext(WorkoutContext);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Group progress data by exercise name
  const exerciseHistory = Object.values(progressData || {}).reduce(
    (acc, record) => {
      if (!acc[record.name]) {
        acc[record.name] = [];
      }
      acc[record.name].push(record);
      return acc;
    },
    {}
  );

  const renderExerciseItem = ({ item: exerciseName }) => {
    const history = exerciseHistory[exerciseName];
    const latestRecord = history[history.length - 1];
    const maxWeight = Math.max(
      ...history.flatMap((record) =>
        record.sets.map((set) => Number(set.weight))
      )
    );

    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => setSelectedExercise(exerciseName)}
      >
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Weight</Text>
            <Text style={styles.statValue}>
              {latestRecord.sets[0].weight}kg × {latestRecord.sets[0].reps}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PR</Text>
            <Text style={styles.statValue}>{maxWeight}kg</Text>
          </View>
          <Text style={styles.date}>
            {new Date(latestRecord.date).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text style={styles.title}>Progress</Text>
          </View>

          {!progressData || Object.keys(exerciseHistory).length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="chart-line"
                size={50}
                color={COLORS.accent}
              />
              <Text style={styles.emptyText}>
                No progress data yet.{"\n"}Complete some exercises to see your
                progress!
              </Text>
            </View>
          ) : (
            <FlatList
              data={Object.keys(exerciseHistory)}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.list}
            />
          )}
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
  exerciseCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  exerciseName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    opacity: 0.7,
  },
  list: {
    flexGrow: 1,
  },
});

export default ProgressScreen;

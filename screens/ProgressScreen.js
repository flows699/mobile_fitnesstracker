import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this import
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/HomeScreenStyle";
import { WorkoutContext } from "../context/WorkoutContext";

const ProgressScreen = ({ navigation }) => {
  const { progressData, setProgressData } = useContext(WorkoutContext);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [fullscreenChart, setFullscreenChart] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const exerciseHistory = Object.values(progressData || {}).reduce(
    (acc, record) => {
      if (!acc[record.name]) {
        acc[record.name] = [];
      }
      // Only add records that have valid weight data
      if (record.sets && record.sets.length > 0 && record.sets[0].weight) {
        acc[record.name].push(record);
      }
      return acc;
    },
    {}
  );

  console.log("Progress Data:", progressData); // Add this for debugging
  console.log("Exercise History:", exerciseHistory); // Add this for debugging

  const getChartData = (exerciseName) => {
    const history = exerciseHistory[exerciseName].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Ensure we have valid data
    if (history.length === 0) {
      return {
        labels: ["Start"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: history.map((record) =>
        new Date(record.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          data: history.map((record) =>
            Math.max(...record.sets.map((set) => Number(set.weight) || 0))
          ),
        },
      ],
    };
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const getVolumeChartData = (exerciseName) => {
    const history = exerciseHistory[exerciseName].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (history.length === 0) {
      return {
        labels: ["Start"],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: history.map((record) =>
        new Date(record.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      datasets: [
        {
          data: history.map((record) => {
            // Calculate total volume (weight × reps) for all sets
            const totalVolume = record.sets.reduce(
              (total, set) =>
                total + (Number(set.weight) || 0) * (Number(set.reps) || 0),
              0
            );
            return totalVolume;
          }),
        },
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "rgba(0,0,0,0.2)",
    backgroundGradientTo: "rgba(0,0,0,0.2)",
    color: (opacity = 1) => `rgba(129, 236, 236, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: COLORS.accent,
    },
    propsForLabels: {
      fill: COLORS.text,
      fontSize: 12,
      fontWeight: "600",
    },
    propsForVerticalLabels: {
      fontSize: 14,
      fontWeight: "600",
    },
    decimalPlaces: 0,
    formatYLabel: (value) => `${value}kg`,
  };

  const renderChart = (
    exerciseName,
    data,
    type = "line",
    fullscreen = false
  ) => {
    // Add data validation
    if (
      !data ||
      !data.datasets ||
      !data.datasets[0] ||
      !data.datasets[0].data ||
      data.datasets[0].data.length === 0
    ) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Not enough data for chart</Text>
        </View>
      );
    }

    const chartWidth = fullscreen ? screenWidth - 40 : screenWidth - 80; // Adjusted width
    const chartHeight = fullscreen ? screenWidth * 0.8 : 220;

    // Ensure data has at least two points
    if (data.datasets[0].data.length === 1) {
      data.labels.unshift("Start");
      data.datasets[0].data.unshift(0);
    }

    const chartProps = {
      data,
      width: chartWidth,
      height: chartHeight,
      chartConfig: {
        ...chartConfig,
        propsForLabels: {
          ...chartConfig.propsForLabels,
          fontSize: fullscreen ? 14 : 12,
        },
        // Add formatter for Y axis labels
        formatYLabel: (value) =>
          type === "line" ? `${value}kg` : formatNumber(value),
      },
      style: [
        styles.chart,
        fullscreen && styles.fullscreenChart,
        // Add alignment styles
        {
          alignSelf: "center",
          marginLeft: type === "bar" ? -15 : 0, // Adjust left margin for bar chart
        },
      ],
      bezier: type === "line",
      withDots: true,
      withInnerLines: true,
      withOuterLines: true,
      withVerticalLines: true,
      withHorizontalLines: true,
      yAxisLabel: "",
      // Remove suffix for volume chart
      yAxisSuffix: type === "line" ? "kg" : "", // Remove kg suffix for volume chart
      segments: type === "bar" ? 4 : 5, // Fewer segments for volume chart
      fromZero: true,
    };

    return (
      <TouchableOpacity
        onPress={() => setFullscreenChart({ exerciseName, data, type })}
        activeOpacity={0.8}
      >
        {type === "line" ? (
          <LineChart {...chartProps} />
        ) : (
          <View>
            <BarChart {...chartProps} />
            <Text style={styles.volumeExplanation}>
              Volume = Weight × Reps (Total:{" "}
              {formatNumber(
                data.datasets[0].data[data.datasets[0].data.length - 1]
              )}{" "}
              kg·reps)
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleDeleteExercise = (exerciseName) => {
    setExerciseToDelete(exerciseName);
    setDeleteModalVisible(true);
  };

  const confirmDeleteExercise = async () => {
    try {
      const updatedProgress = { ...progressData };
      // Remove all entries for this exercise
      Object.keys(updatedProgress).forEach((key) => {
        if (updatedProgress[key].name === exerciseToDelete) {
          delete updatedProgress[key];
        }
      });

      await AsyncStorage.setItem("progress", JSON.stringify(updatedProgress));
      setProgressData(updatedProgress);
      setDeleteModalVisible(false);
      setExerciseToDelete(null);
      setSelectedExercise(null); // Close the expanded view if it was open
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const renderExerciseItem = ({ item: exerciseName }) => {
    const history = exerciseHistory[exerciseName];
    const latestRecord = history[history.length - 1];
    const maxWeight = Math.max(
      ...history.flatMap((record) =>
        record.sets.map((set) => Number(set.weight))
      )
    );

    // Calculate progress percentages
    const firstRecord = history[0];
    const weightProgress = (
      ((latestRecord.sets[0].weight - firstRecord.sets[0].weight) /
        firstRecord.sets[0].weight) *
      100
    ).toFixed(1);

    // Ensure we have at least two data points
    const chartData = getChartData(exerciseName);
    if (chartData.labels.length < 2) {
      chartData.labels.unshift("Start");
      chartData.datasets[0].data.unshift(0);
    }

    return (
      <View style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <TouchableOpacity
            style={styles.exerciseTitleContainer}
            onPress={() =>
              setSelectedExercise(
                exerciseName === selectedExercise ? null : exerciseName
              )
            }
          >
            <Text style={styles.exerciseName}>{exerciseName}</Text>
            <MaterialCommunityIcons
              name={
                selectedExercise === exerciseName
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={24}
              color={COLORS.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteExercise(exerciseName)}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons name="delete" size={22} color="#ff3b30" />
          </TouchableOpacity>
        </View>

        {selectedExercise === exerciseName && (
          <View style={styles.chartsContainer}>
            <Text style={styles.chartTitle}>Weight Progress</Text>
            {renderChart(exerciseName, getChartData(exerciseName), "line")}

            <Text style={[styles.chartTitle, { marginTop: 20 }]}>
              Volume Progress
            </Text>
            {renderChart(exerciseName, getVolumeChartData(exerciseName), "bar")}

            <View style={styles.progressSummary}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text
                  style={[
                    styles.progressValue,
                    {
                      color:
                        weightProgress > 0
                          ? "#4CAF50"
                          : weightProgress < 0
                          ? "#FF5252"
                          : COLORS.text,
                    },
                  ]}
                >
                  {weightProgress > 0 ? "+" : ""}
                  {weightProgress}%
                </Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Starting Weight</Text>
                <Text style={styles.progressValue}>
                  {firstRecord.sets[0].weight}kg
                </Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Current Weight</Text>
                <Text style={styles.progressValue}>
                  {latestRecord.sets[0].weight}kg
                </Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { flex: 2 }]}>
            <Text style={styles.statLabel}>Last Sets</Text>
            <View style={styles.setsContainer}>
              {latestRecord.sets.map((set, index) => (
                <Text key={index} style={styles.statValue}>
                  Set {index + 1}: {set.weight}kg × {set.reps}
                </Text>
              ))}
            </View>
          </View>
          <View style={[styles.statItem, { flex: 1, alignItems: "flex-end" }]}>
            <Text style={styles.statLabel}>PR</Text>
            <Text style={styles.statValue}>{maxWeight}kg</Text>
            <Text style={styles.date}>
              {new Date(latestRecord.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
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
            <ScrollView contentContainerStyle={styles.list}>
              {Object.keys(exerciseHistory).map((exerciseName) => (
                <View key={exerciseName}>
                  {renderExerciseItem({ item: exerciseName })}
                </View>
              ))}
            </ScrollView>
          )}

          <Modal
            visible={!!fullscreenChart}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setFullscreenChart(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {fullscreenChart?.exerciseName}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setFullscreenChart(null)}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={COLORS.text}
                    />
                  </TouchableOpacity>
                </View>
                {fullscreenChart &&
                  renderChart(
                    fullscreenChart.exerciseName,
                    fullscreenChart.data,
                    fullscreenChart.type,
                    true
                  )}
              </View>
            </View>
          </Modal>

          <Modal
            visible={deleteModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={50}
                  color={COLORS.accent}
                />
                <Text style={styles.modalTitle}>Delete Exercise Progress</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete all progress data for{" "}
                  {exerciseToDelete}?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={confirmDeleteExercise}
                  >
                    <Text
                      style={[styles.modalButtonText, styles.deleteButtonText]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  exerciseCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  exerciseTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    alignItems: "flex-start",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
  },
  setsContainer: {
    gap: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.accent,
    fontSize: 14,
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
  chartContainer: {
    marginVertical: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  chartsContainer: {
    marginVertical: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    padding: 15,
  },
  chartTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  progressSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
  },
  progressItem: {
    alignItems: "center",
  },
  progressLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 5,
  },
  progressValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  fullscreenChart: {
    marginVertical: 20,
    borderRadius: 15,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    marginVertical: 10,
  },
  noDataText: {
    color: COLORS.text,
    fontSize: 16,
    opacity: 0.7,
  },
  volumeExplanation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  modalText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  deleteButtonText: {
    color: "#ff3b30",
  },
  modalButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProgressScreen;

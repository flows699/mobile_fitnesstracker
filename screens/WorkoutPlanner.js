import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/HomeScreenStyle";
import { fetchMuscles } from "../services/exerciseAPI";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const boxWidth = (width - 60) / 2; // 60 = padding (20) * 3

const WorkoutPlanner = ({ navigation }) => {
  const [muscles, setMuscles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMuscles();
  }, []);

  const loadMuscles = async () => {
    try {
      const data = await fetchMuscles();
      setMuscles(data);
    } catch (error) {
      console.error("Error loading muscles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMuscleGroupPress = (muscleGroup) => {
    navigation.navigate("ExerciseList", { muscleGroup });
  };

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={30}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>WORKOUT{"\n"}PLANNER</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.accent} />
          ) : (
            <ScrollView
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}
            >
              {muscles.map((muscle) => (
                <TouchableOpacity
                  key={muscle.id}
                  style={styles.box}
                  onPress={() => handleMuscleGroupPress(muscle)}
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={muscle.icon}
                      size={boxWidth * 0.4}
                      color={COLORS.accent}
                    />
                  </View>
                  <Text style={styles.muscleName}>{muscle.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.gradient1,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 2,
    marginLeft: 15,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20, // Add padding at bottom for better scrolling
  },
  box: {
    width: boxWidth,
    height: boxWidth,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconContainer: {
    width: boxWidth * 0.6,
    height: boxWidth * 0.6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: boxWidth * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  muscleName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default WorkoutPlanner;

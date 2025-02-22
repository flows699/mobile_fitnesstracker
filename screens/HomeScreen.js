import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import styles, { COLORS } from "../styles/HomeScreenStyle";

const Pattern = () => (
  <View style={styles.pattern}>
    {Array(6)
      .fill(null)
      .map((_, i) => (
        <View key={i} style={styles.patternRow}>
          {Array(6)
            .fill(null)
            .map((_, j) => (
              <View key={j} style={styles.patternDot} />
            ))}
        </View>
      ))}
  </View>
);

const AnimatedShape = ({ style }) => {
  const translateY = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.shape, style, { transform: [{ translateY }] }]}
    />
  );
};

const ActionButton = ({ title, onPress, iconName }) => (
  <TouchableOpacity
    style={styles.buttonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <LinearGradient
      colors={[COLORS.buttonGradient1, COLORS.buttonGradient2]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name={iconName}
          size={22}
          color={COLORS.text}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>{title}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.text}
        style={styles.chevron}
      />
    </LinearGradient>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const startWorkout = () => {
    // Navigate to ManageWorkouts instead of directly to TrackWorkout
    navigation.navigate("ManageWorkouts");
  };

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AnimatedShape style={[styles.circle, { top: "10%", left: "10%" }]} />
        <AnimatedShape style={[styles.square, { top: "30%", right: "15%" }]} />
        <AnimatedShape
          style={[styles.triangle, { bottom: "20%", left: "20%" }]}
        />

        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>IRON{"\n"}TRACKER</Text>
            <Text style={styles.subtitle}>TRACK YOUR PROGRESS</Text>
          </View>

          <View style={styles.buttonGroup}>
            <ActionButton
              title="CREATE WORKOUT"
              onPress={() => navigation.navigate("PlanWorkout")}
              iconName="barbell-outline"
            />
            <ActionButton
              title="START TRAINING"
              onPress={() => navigation.navigate("TrackWorkout")}
              iconName="fitness-outline"
            />
            <ActionButton
              title="CHECK PROGRESS"
              onPress={() => navigation.navigate("History")}
              iconName="trending-up-outline"
            />
            <ActionButton
              title="MANAGE WORKOUTS"
              onPress={() => navigation.navigate("ManageWorkouts")}
              iconName="list-outline"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

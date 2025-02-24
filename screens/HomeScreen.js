import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  StyleSheet,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import baseStyles, { COLORS } from "../styles/HomeScreenStyle";

const Pattern = () => (
  <View style={baseStyles.pattern}>
    {Array(6)
      .fill(null)
      .map((_, i) => (
        <View key={i} style={baseStyles.patternRow}>
          {Array(6)
            .fill(null)
            .map((_, j) => (
              <View key={j} style={baseStyles.patternDot} />
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
      style={[baseStyles.shape, style, { transform: [{ translateY }] }]}
    />
  );
};

const ActionButton = ({ title, onPress, iconName }) => (
  <TouchableOpacity
    style={baseStyles.buttonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <LinearGradient
      colors={[COLORS.buttonGradient1, COLORS.buttonGradient2]}
      style={baseStyles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={baseStyles.buttonContent}>
        <Ionicons
          name={iconName}
          size={22}
          color={COLORS.text}
          style={baseStyles.icon}
        />
        <Text style={baseStyles.buttonText}>{title}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.text}
        style={baseStyles.chevron}
      />
    </LinearGradient>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current; // Reduced distance

  useEffect(() => {
    // Smoother animation configuration
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600, // Increased duration
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing curve
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600, // Matched duration
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Same easing curve
      }),
    ]).start();
  }, []);

  const startWorkout = () => {
    // Navigate to ManageWorkouts instead of directly to TrackWorkout
    navigation.navigate("ManageWorkouts");
  };

  return (
    <View style={baseStyles.outerContainer}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={baseStyles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AnimatedShape
          style={[baseStyles.circle, { top: "10%", left: "10%" }]}
        />
        <AnimatedShape
          style={[baseStyles.square, { top: "30%", right: "15%" }]}
        />
        <AnimatedShape
          style={[baseStyles.triangle, { bottom: "20%", left: "20%" }]}
        />

        <SafeAreaView style={baseStyles.container}>
          <Animated.View
            style={[
              baseStyles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={baseStyles.header}>
              <Text style={baseStyles.title}>IRON{"\n"}TRACKER</Text>
              <Text style={baseStyles.subtitle}>TRACK YOUR PROGRESS</Text>
            </View>

            <View style={baseStyles.buttonGroup}>
              <ActionButton
                title="SEARCH EXERCISES" // Changed from "CREATE WORKOUT"
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
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

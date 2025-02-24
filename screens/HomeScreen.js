import React, { useEffect, useRef } from "react";
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

const ShootingStar = ({ style, duration = 1000 }) => {
  const translateX = useRef(new Animated.Value(-50)).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 250,
            duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(translateY, {
            toValue: 250,
            duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration - 100,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.delay(Math.random() * 500), // Random delay between loops
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          opacity,
          transform: [{ translateX }, { translateY }, { rotate: "45deg" }],
        },
      ]}
    />
  );
};

const AnimatedBackground = () => {
  // Generate multiple shooting stars with different positions and timings
  const stars = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 70}%`,
      duration: 800 + Math.random() * 500,
    }));

  return (
    <View style={styles.backgroundOverlay}>
      <LinearGradient
        colors={["rgba(255,255,255,0.05)", "transparent"]}
        style={styles.topGlow}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      {stars.map((star) => (
        <ShootingStar
          key={star.id}
          style={{ top: star.top, left: star.left }}
          duration={star.duration}
        />
      ))}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    ]).start();
  }, []);

  return (
    <View style={baseStyles.outerContainer}>
      <LinearGradient
        colors={[
          COLORS.gradient1,
          "rgba(16, 16, 35, 1)",
          "rgba(22, 22, 45, 1)",
        ]}
        style={baseStyles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AnimatedBackground />

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
                title="SEARCH EXERCISES"
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

const styles = StyleSheet.create({
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  star: {
    position: "absolute",
    width: 3,
    height: 3,
    backgroundColor: "#ffffff",
    borderRadius: 1,
    opacity: 0.8,
  },
});

export default HomeScreen;

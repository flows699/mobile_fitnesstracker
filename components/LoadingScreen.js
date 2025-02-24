import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/HomeScreenStyle";

const LoadingScreen = ({ onLoadingComplete, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.sin, // Changed from sine to sin
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.sin, // Changed from sine to sin
          }),
        ])
      ).start();

      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.ease,
      }).start(() => {
        // Exit animations
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -200,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.cubic,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(onLoadingComplete);
      });
    });
  }, []);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
        style={styles.background}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Only the icon container gets the scale animation */}
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <MaterialCommunityIcons
              name="weight-lifter"
              size={100}
              color={COLORS.accent}
            />
          </Animated.View>

          {/* Title and progress bar remain static */}
          <Text style={styles.title}>IRON TRACKER</Text>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 3,
    marginBottom: 30,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  progressContainer: {
    width: 200,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.accent,
  },
});

export default LoadingScreen;

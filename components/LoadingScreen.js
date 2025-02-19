import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/HomeScreenStyle";
import { Ionicons } from "@expo/vector-icons";

const LoadingScreen = () => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.gradient1, COLORS.gradient2, COLORS.gradient3]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons name="barbell-outline" size={80} color={COLORS.accent} />
        <Text style={styles.title}>IRON TRACKER</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 20,
    letterSpacing: 2,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
});

export default LoadingScreen;

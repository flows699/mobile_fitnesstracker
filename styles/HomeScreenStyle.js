import { StyleSheet, Platform } from "react-native";

export const COLORS = {
  gradient1: "#000000",
  gradient2: "#1a1a1a",
  gradient3: "#2d2d2d",
  buttonGradient1: "#333333",
  buttonGradient2: "#1a1a1a",
  text: "#ffffff",
  accent: "#ff0000",
  shadow: "#000000",
};

export default StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    transform: [{ rotate: "15deg" }],
  },
  patternRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 50,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    marginTop: Platform.OS === "ios" ? 14 : 40,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 2,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: "800",
    letterSpacing: 4,
    marginTop: 8,
  },
  buttonGroup: {
    padding: 20,
    marginTop: 20,
  },
  buttonContainer: {
    height: 75,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
    color: COLORS.accent,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },
  chevron: {
    marginRight: -2,
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: "rgba(245,246,250,0.8)",
  },
  shape: {
    position: "absolute",
    opacity: 0.3,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
  },
  glassButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
});

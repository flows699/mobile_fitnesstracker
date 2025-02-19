import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default styles = StyleSheet.create({
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
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  workoutCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  exerciseCount: {
    color: COLORS.accent,
    fontSize: 14,
  },
  exerciseList: {
    marginBottom: 15,
  },
  exerciseItem: {
    color: "rgba(255,255,255,0.7)",
    marginVertical: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 5,
  },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteButton: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  templateTag: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  templateDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 4,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeSegment: {
    backgroundColor: COLORS.accent,
    borderRadius: 6,
  },
  segmentText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  emptyText: {
    color: COLORS.text,
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
});

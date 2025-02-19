import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.gradient1,
  },
  background: {
    flex: 1,
    width: "100%",
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
  formContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: COLORS.text,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  numberInput: {
    flex: 1,
  },
  exercise: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  exerciseSubtitle: {
    color: "rgba(255,255,255,0.7)",
    marginRight: 10,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    marginVertical: 10,
  },
  addButtonText: {
    color: COLORS.accent,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "rgba(255,0,0,0.3)",
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  categorySelector: {
    marginVertical: 15,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  categoryButtonActive: {
    backgroundColor: COLORS.accent,
  },
  categoryButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.gradient1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  exerciseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  exerciseItemText: {
    color: COLORS.text,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  selectExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    marginBottom: 15,
  },
  selectExerciseText: {
    color: COLORS.accent,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 10,
  },
  exerciseDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 5,
  },
});

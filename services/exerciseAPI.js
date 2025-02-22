import { exerciseDatabase } from "../data/exerciseDatabase";

export const getExercisesByBodyPart = async (bodyPart) => {
  // Simulate API delay for smooth UI
  await new Promise((resolve) => setTimeout(resolve, 300));
  return exerciseDatabase[bodyPart] || [];
};

const BASE_URL = "https://wger.de/api/v2";

// Get exercise details including images
export const getExerciseDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/exerciseinfo/${id}/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    return null;
  }
};

export const fetchExercisesByMuscle = async (muscleGroup) => {
  try {
    const response = await fetch(
      `${BASE_URL}/exercise/?language=2&limit=60&muscles=${getMuscleId(
        muscleGroup
      )}`
    );
    const data = await response.json();
    return data.results.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

const getMuscleId = (muscleGroup) => {
  // wger API muscle IDs
  const muscleIds = {
    chest: "4", // Chest
    back: "12", // Back
    legs: "10", // Legs
    shoulders: "2", // Shoulders
    arms: "1", // Biceps
    abs: "6", // Abs
  };
  return muscleIds[muscleGroup.id] || "4";
};

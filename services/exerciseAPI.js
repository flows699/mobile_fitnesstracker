import { bodyParts, exerciseDatabase } from "../data/exerciseDatabase";

export const getExercisesByBodyPart = async (bodyPart) => {
  // Simulate API delay for smooth UI
  await new Promise((resolve) => setTimeout(resolve, 300));
  return exerciseDatabase[bodyPart] || [];
};

export { bodyParts };

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

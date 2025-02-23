import { exerciseDatabase } from "../data/exerciseDatabase";

export const getExercisesByBodyPart = async (bodyPart) => {
  // Simulate API delay for smooth UI
  await new Promise((resolve) => setTimeout(resolve, 300));
  return exerciseDatabase[bodyPart] || [];
};

const WGER_URL = "https://wger.de/api/v2";

// Map scientific names to friendly names
const muscleTranslations = {
  // Upper Body
  "Anterior deltoid": "Front Shoulders",
  "Biceps brachii": "Biceps",
  "Triceps brachii": "Triceps",
  "Pectoralis major": "Chest",
  "Latissimus dorsi": "Back",
  Brachialis: "Upper Arms",
  Brachioradialis: "Forearms",
  Deltoids: "Shoulders",
  "Serratus anterior": "Upper Ribs",
  Trapezius: "Upper Back",

  // Core
  "Rectus abdominis": "Abs",
  "Obliquus externus abdominis": "Side Abs",
  "Erector spinae": "Lower Back",

  // Lower Body
  "Quadriceps femoris": "Quads",
  "Biceps femoris": "Hamstrings",
  Gastrocnemius: "Calves",
  "Gluteus maximus": "Glutes",
  Soleus: "Lower Calves",
};

// Get exercise details including images
export const getExerciseDetails = async (id) => {
  try {
    const response = await fetch(`${WGER_URL}/exerciseinfo/${id}/`, {
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

export const fetchMuscles = async () => {
  try {
    const response = await fetch(`${WGER_URL}/muscle/`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Raw muscle data:", data);

    return data.results.map((muscle) => ({
      id: muscle.id.toString(),
      name: muscleTranslations[muscle.name] || muscle.name,
      icon: getIconForMuscle(muscleTranslations[muscle.name] || muscle.name),
    }));
  } catch (error) {
    console.error("Error fetching muscles:", error);
    return getDefaultMuscles();
  }
};

export const fetchExercisesByMuscle = async (muscleGroup) => {
  try {
    const response = await fetch(
      `${WGER_URL}/exercise/?language=2&muscles=${muscleGroup.id}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log(
      `Found ${data.results.length} exercises for ${muscleGroup.name}`
    );

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

const getIconForMuscle = (muscleName) => {
  const iconMap = {
    Chest: "checkbox-blank-circle-outline",
    Back: "human-handsup",
    "Front Shoulders": "dumbbell",
    Shoulders: "dumbbell",
    Biceps: "arm-flex",
    Triceps: "arm-flex-outline",
    Abs: "hexagon-outline",
    Obliques: "rhombus-outline",
    Quads: "human-male",
    Hamstrings: "run",
    Calves: "shoe-heel",
    "Upper Back": "human-handsup",
  };
  return iconMap[muscleName] || "dumbbell";
};

const getDefaultMuscles = () => [
  { id: "4", name: "Chest", icon: "checkbox-blank-circle-outline" },
  { id: "1", name: "Biceps", icon: "arm-flex" },
  { id: "2", name: "Shoulders", icon: "dumbbell" },
  { id: "12", name: "Back", icon: "human-handsup" },
];

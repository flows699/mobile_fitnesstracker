export const WORKOUT_TEMPLATES = {
  push: {
    name: "Push Day",
    type: "template",
    description: "Chest, Shoulders, and Triceps",
    exercises: [
      {
        name: "Bench Press",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Overhead Press",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Incline Dumbbell Press",
        sets: Array(3).fill({ weight: 0, reps: 10, completed: false }),
      },
      {
        name: "Lateral Raises",
        sets: Array(3).fill({ weight: 0, reps: 12, completed: false }),
      },
      {
        name: "Tricep Pushdowns",
        sets: Array(3).fill({ weight: 0, reps: 12, completed: false }),
      },
    ],
  },
  pull: {
    name: "Pull Day",
    type: "template",
    description: "Back and Biceps",
    exercises: [
      {
        name: "Barbell Rows",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Pull-ups",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Face Pulls",
        sets: Array(3).fill({ weight: 0, reps: 12, completed: false }),
      },
      {
        name: "Barbell Curls",
        sets: Array(3).fill({ weight: 0, reps: 10, completed: false }),
      },
    ],
  },
  legs: {
    name: "Leg Day",
    type: "template",
    description: "Lower Body Focus",
    exercises: [
      {
        name: "Squats",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Romanian Deadlifts",
        sets: Array(4).fill({ weight: 0, reps: 8, completed: false }),
      },
      {
        name: "Leg Press",
        sets: Array(3).fill({ weight: 0, reps: 12, completed: false }),
      },
      {
        name: "Calf Raises",
        sets: Array(4).fill({ weight: 0, reps: 15, completed: false }),
      },
    ],
  },
};

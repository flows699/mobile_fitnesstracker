export const bodyParts = ["chest", "back", "legs", "shoulders", "arms", "core"];

export const exerciseDatabase = {
  chest: [
    {
      id: "chest-1",
      name: "Bench Press",
      description:
        "1. Lie flat on bench\n2. Grip barbell shoulder-width apart\n3. Lower bar to chest\n4. Press upward to starting position",
      equipment: "Barbell, Bench",
      type: "compound",
    },
    {
      id: "chest-2",
      name: "Incline Dumbbell Press",
      description:
        "1. Set bench to 30-45 degrees\n2. Press dumbbells up\n3. Lower with control\n4. Keep core tight",
      equipment: "Dumbbells, Incline Bench",
      type: "compound",
    },
    {
      id: "chest-3",
      name: "Cable Flyes",
      description:
        "1. Stand between cable machines\n2. Keep slight bend in elbows\n3. Bring hands together in arc motion\n4. Control the return",
      equipment: "Cable Machine",
      type: "isolation",
    },
  ],
  back: [
    {
      id: "back-1",
      name: "Barbell Rows",
      description:
        "1. Bend at hips, back straight\n2. Pull bar to lower chest\n3. Squeeze shoulder blades\n4. Lower with control",
      equipment: "Barbell",
      type: "compound",
    },
    {
      id: "back-2",
      name: "Pull-ups",
      description:
        "1. Hang from bar with wide grip\n2. Pull chest to bar\n3. Lower with control\n4. Keep core engaged",
      equipment: "Pull-up Bar",
      type: "compound",
    },
  ],
  legs: [
    {
      id: "legs-1",
      name: "Squats",
      description:
        "1. Bar across upper back\n2. Bend knees and hips\n3. Keep chest up\n4. Push through heels",
      equipment: "Barbell",
      type: "compound",
    },
    {
      id: "legs-2",
      name: "Romanian Deadlift",
      description:
        "1. Hold bar at hip level\n2. Hinge at hips\n3. Keep back straight\n4. Feel hamstring stretch",
      equipment: "Barbell",
      type: "compound",
    },
  ],
  shoulders: [
    {
      id: "shoulders-1",
      name: "Military Press",
      description:
        "1. Stand with bar at shoulders\n2. Press overhead\n3. Lower with control\n4. Keep core tight",
      equipment: "Barbell",
      type: "compound",
    },
    {
      id: "shoulders-2",
      name: "Lateral Raises",
      description:
        "1. Stand with dumbbells at sides\n2. Raise arms to shoulder level\n3. Keep slight bend in elbows\n4. Lower slowly",
      equipment: "Dumbbells",
      type: "isolation",
    },
  ],
  arms: [
    {
      id: "arms-1",
      name: "Barbell Curls",
      description:
        "1. Stand with barbell\n2. Curl weight up\n3. Keep elbows at sides\n4. Lower with control",
      equipment: "Barbell",
      type: "isolation",
    },
    {
      id: "arms-2",
      name: "Tricep Pushdowns",
      description:
        "1. Stand at cable machine\n2. Push bar down\n3. Keep elbows at sides\n4. Control the return",
      equipment: "Cable Machine",
      type: "isolation",
    },
  ],
  core: [
    {
      id: "core-1",
      name: "Cable Crunches",
      description:
        "1. Kneel at cable machine\n2. Hold rope behind head\n3. Crunch downward\n4. Control return",
      equipment: "Cable Machine",
      type: "isolation",
    },
    {
      id: "core-2",
      name: "Hanging Leg Raises",
      description:
        "1. Hang from pull-up bar\n2. Raise legs to parallel\n3. Lower with control\n4. Keep core tight",
      equipment: "Pull-up Bar",
      type: "compound",
    },
  ],
};

export const getExercisesByBodyPart = async (bodyPart) => {
  // Simulate API delay for smooth UI
  await new Promise((resolve) => setTimeout(resolve, 300));
  return exerciseDatabase[bodyPart] || [];
};

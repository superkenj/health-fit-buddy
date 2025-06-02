export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  // Basic implementation - in a real app, you'd connect to actual fitness APIs
  let data

  switch (type) {
    case "exercises":
      data = await fetchExercises()
      break
    case "nutrition":
      data = await fetchNutritionInfo(searchParams.get("query") || "")
      break
    default:
      data = { error: "Invalid request type" }
  }

  return Response.json(data)
}

async function fetchExercises() {
  // Simulating an API call to an exercise database
  // In a production app, you would connect to a real API like ExerciseDB or Wger
  return {
    exercises: [
      {
        name: "Push-up",
        muscle: "Chest",
        difficulty: "Beginner",
        instructions:
          "Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.",
        variations: ["Wide Push-up", "Diamond Push-up", "Decline Push-up"],
      },
      {
        name: "Squat",
        muscle: "Legs",
        difficulty: "Beginner",
        instructions:
          "Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back as if sitting in a chair. Return to standing position.",
        variations: ["Goblet Squat", "Sumo Squat", "Jump Squat"],
      },
      {
        name: "Pull-up",
        muscle: "Back",
        difficulty: "Intermediate",
        instructions:
          "Hang from a bar with palms facing away from you. Pull your body up until your chin is over the bar, then lower back down with control.",
        variations: ["Chin-up", "Wide-grip Pull-up", "Negative Pull-up"],
      },
      {
        name: "Deadlift",
        muscle: "Full Body",
        difficulty: "Intermediate",
        instructions:
          "Stand with feet hip-width apart, barbell over midfoot. Bend at hips and knees to grip the bar, then stand up by driving through heels and extending hips and knees.",
        variations: ["Romanian Deadlift", "Sumo Deadlift", "Single-leg Deadlift"],
      },
      {
        name: "Plank",
        muscle: "Core",
        difficulty: "Beginner",
        instructions:
          "Start in a push-up position but with weight on forearms. Keep body in a straight line from head to heels, engaging core muscles.",
        variations: ["Side Plank", "Plank with Shoulder Taps", "Mountain Climber Plank"],
      },
      {
        name: "Lunges",
        muscle: "Legs",
        difficulty: "Beginner",
        instructions:
          "Stand tall, then step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push back to starting position.",
        variations: ["Walking Lunges", "Reverse Lunges", "Bulgarian Split Squats"],
      },
      {
        name: "Bench Press",
        muscle: "Chest",
        difficulty: "Intermediate",
        instructions:
          "Lie on a bench, grip barbell with hands slightly wider than shoulder-width. Lower the bar to chest level, then press back up to starting position.",
        variations: ["Incline Bench Press", "Decline Bench Press", "Dumbbell Bench Press"],
      },
      {
        name: "Shoulder Press",
        muscle: "Shoulders",
        difficulty: "Intermediate",
        instructions:
          "Sit or stand with dumbbells at shoulder height, palms facing forward. Press weights upward until arms are extended, then lower back to starting position.",
        variations: ["Arnold Press", "Push Press", "Landmine Press"],
      },
    ],
  }
}

async function fetchNutritionInfo(query: string) {
  // Simulating a nutrition API call
  // In a production app, you would connect to a real API like Nutritionix or Edamam
  if (!query) return { items: [] }

  // Common foods with realistic nutrition data
  const foodDatabase = {
    "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    broccoli: { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
    salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
    egg: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    "sweet potato": { calories: 112, protein: 2, carbs: 26, fat: 0.1 },
    avocado: { calories: 240, protein: 3, carbs: 12, fat: 22 },
    "greek yogurt": { calories: 100, protein: 17, carbs: 6, fat: 0.4 },
    oatmeal: { calories: 150, protein: 5, carbs: 27, fat: 2.5 },
    "protein shake": { calories: 120, protein: 24, carbs: 3, fat: 1 },
    almonds: { calories: 164, protein: 6, carbs: 6, fat: 14 },
    quinoa: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
    spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  }

  // Check if the query matches any food in our database
  const lowerQuery = query.toLowerCase()
  const matchedFood = Object.keys(foodDatabase).find((food) => lowerQuery.includes(food) || food.includes(lowerQuery))

  if (matchedFood) {
    return {
      items: [
        {
          name: matchedFood,
          ...foodDatabase[matchedFood],
          serving: "100g",
        },
      ],
    }
  }

  // If no match, return generic data
  return {
    items: [
      {
        name: query,
        calories: Math.floor(Math.random() * 300) + 100,
        protein: Math.floor(Math.random() * 25) + 5,
        carbs: Math.floor(Math.random() * 30) + 5,
        fat: Math.floor(Math.random() * 15) + 2,
        serving: "100g",
      },
    ],
  }
}

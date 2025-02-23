import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  WORKOUTS: "@workouts",
  COMPLETED_WORKOUTS: "@completed_workouts",
  TRAINING_HISTORY: "@training_history",
  PROGRESS: "@progress",
  ACTIVE_WORKOUT: "@active_workout",
};

export const storageService = {
  saveData: async (key, data) => {
    try {
      if (!key || typeof key !== "string") {
        console.error("Invalid storage key:", key);
        return false;
      }
      const storageKey = STORAGE_KEYS[key] || key;
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  },

  loadData: async (key) => {
    try {
      if (!key || typeof key !== "string") {
        console.error("Invalid storage key:", key);
        return null;
      }
      const storageKey = STORAGE_KEYS[key] || key;
      const data = await AsyncStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return null;
    }
  },

  removeData: async (key) => {
    try {
      if (!key || typeof key !== "string") {
        console.error("Invalid storage key:", key);
        return false;
      }
      const storageKey = STORAGE_KEYS[key] || key;
      await AsyncStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  },

  clearAllData: async () => {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error("Error clearing all data:", error);
      return false;
    }
  },
};

// Set Local Storage
export const setLocalStorage = (key, value) => {
  try {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};

// Get Local Storage
export const getLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error reading localStorage:", error);
    return null;
  }
};

// Remove Local Storage
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage:", error);
  }
};

"use server";

import { getUserPreferences, upsertUserPreferences } from "@/db/db";
import { currentUser } from "@clerk/nextjs/server";

export async function saveUserPreferencesAction(preferences) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error(
      "saveUserPreferencesAction: User not authenticated (using currentUser)."
    );
    return { success: false, error: "User not authenticated." };
  }

  // Allow defaultMode to be provided optionally
  const validDefaultModes = ["home", "away", "dnd"];
  if (
    preferences.defaultMode &&
    !validDefaultModes.includes(preferences.defaultMode)
  ) {
    console.error(
      "saveUserPreferencesAction: Invalid mode provided.",
      preferences.defaultMode
    );
    return { success: false, error: "Invalid mode value." };
  }

  // Make sure at least one of the required fields is provided
  if (
    (preferences.notificationsEnabled === undefined ||
      typeof preferences.notificationsEnabled !== "boolean") &&
    (preferences.soundsEnabled === undefined ||
      typeof preferences.soundsEnabled !== "boolean") &&
    !preferences.defaultMode
  ) {
    console.error(
      "saveUserPreferencesAction: No valid preferences provided.",
      preferences
    );
    return { success: false, error: "No valid preference values provided." };
  }

  try {
    const result = await upsertUserPreferences(userId, preferences);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error saving user preferences via action:", error);
    return {
      success: false,
      error: "Failed to save user preferences. Please try again.",
    };
  }
}

export async function getUserPreferencesAction() {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error(
      "getUserPreferencesAction: User not authenticated (using currentUser)."
    );
    return { success: false, error: "User not authenticated." };
  }

  try {
    const preferencesData = await getUserPreferences(userId);
    return { success: true, data: preferencesData };
  } catch (error) {
    console.error("Error fetching user preferences via action:", error);
    return { success: false, error: "Failed to load preferences." };
  }
}

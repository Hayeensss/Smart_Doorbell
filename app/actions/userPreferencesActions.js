'use server';

import { auth } from '@clerk/nextjs/server';
import { upsertUserPreferences, getUserPreferences } from '@/db/db'; // We will define these in db/db.js


export async function saveUserPreferencesAction(preferences) {
  const { userId } = auth();
  if (!userId) {
    console.error("saveUserPreferencesAction: User not authenticated.");
    return { success: false, error: 'User not authenticated.' };
  }

  if (typeof preferences.notificationsEnabled !== 'boolean' ||
      typeof preferences.soundsEnabled !== 'boolean' ||
      typeof preferences.defaultMode !== 'string') {
    console.error("saveUserPreferencesAction: Invalid preferences object received.", preferences);
    return { success: false, error: 'Invalid preference values.' };
  }

  try {
    const result = await upsertUserPreferences(userId, preferences);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving user preferences via action:', error);
    return { success: false, error: 'Failed to save preferences. Please try again.' };
  }
}

/**
 * Fetches user preferences.
 * @returns {Promise<{success: boolean, data?: object | null, error?: string}>}
 */
export async function getUserPreferencesAction() {
  const { userId } = auth();
  if (!userId) {
    console.error("getUserPreferencesAction: User not authenticated.");
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const preferences = await getUserPreferences(userId);
    return { success: true, data: preferences }; // preferences can be null if not found
  } catch (error) {
    console.error('Error fetching user preferences via action:', error);
    // It's not necessarily an error if preferences don't exist yet for a user
    // The db function should handle returning null in that case.
    return { success: false, error: 'Failed to load preferences.' };
  }
} 
'use server';

import { currentUser } from '@clerk/nextjs/server';
import { upsertUserPreferences, getUserPreferences } from '@/db/db';

export async function saveUserPreferencesAction(preferences) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("saveUserPreferencesAction: User not authenticated (using currentUser).");
    return { success: false, error: 'User not authenticated.' };
  }

  if (typeof preferences.notificationsEnabled !== 'boolean' ||
      typeof preferences.soundsEnabled !== 'boolean') {
    console.error("saveUserPreferencesAction: Invalid preferences object received.", preferences);
    return { success: false, error: 'Invalid preference values for notifications or sounds.' };
  }

  try {
    const result = await upsertUserPreferences(userId, preferences);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving user preferences via action:', error);
    return { success: false, error: 'Failed to save notification/sound preferences. Please try again.' };
  }
}

export async function getUserPreferencesAction() {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("getUserPreferencesAction: User not authenticated (using currentUser).");
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const preferencesData = await getUserPreferences(userId);
    return { success: true, data: preferencesData }; 
  } catch (error) {
    console.error('Error fetching user preferences via action:', error);
    return { success: false, error: 'Failed to load preferences.' };
  }
} 
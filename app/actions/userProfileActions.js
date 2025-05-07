'use server'

import { currentUser } from '@clerk/nextjs/server';

export async function updateUserAccountAction(formData) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    console.error("SERVER ACTION: Auth check failed inside action using currentUser. userId is null/undefined.");
    return { success: false, error: "User not authenticated." };
  }

  const newTimezone = formData.get('timezone');
  const newDeviceId = formData.get('deviceId');

  let timezoneUpdateStatus = { success: true, message: "No timezone change requested." };
  let deviceUpdateStatus = { success: true, message: "No device ID change requested." };

  let metadataPayloadForAPI = {}; 
  if (newTimezone) {
    metadataPayloadForAPI.timezone = newTimezone;
  }
  if (newDeviceId) {
    metadataPayloadForAPI.deviceId = newDeviceId;
  }

  try {
    if (Object.keys(metadataPayloadForAPI).length > 0) {
      const CLERK_SECRET_KEY_FROM_ENV = process.env.CLERK_SECRET_KEY;
      if (!CLERK_SECRET_KEY_FROM_ENV) {
        console.error("SERVER ACTION: Missing CLERK_SECRET_KEY for direct API call.");
        if (newTimezone) timezoneUpdateStatus = { success: false, error: "Server configuration error for timezone update." };
        if (newDeviceId) deviceUpdateStatus = { success: false, error: "Server configuration error for device ID update." };
      } else {
        try {
          const clerkUserResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${CLERK_SECRET_KEY_FROM_ENV}` },
          });
          if (!clerkUserResponse.ok) {
            console.error(`Failed to fetch current user data before metadata update. Status: ${clerkUserResponse.status}`);
            throw new Error("Failed to prepare settings update."); 
          }
          const clerkUserData = await clerkUserResponse.json();
          const currentUnsafeMetadata = clerkUserData.unsafe_metadata || {};
          const mergedUnsafeMetadata = { ...currentUnsafeMetadata, ...metadataPayloadForAPI };

          const response = await fetch(
            `https://api.clerk.com/v1/users/${userId}/metadata`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${CLERK_SECRET_KEY_FROM_ENV}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ unsafe_metadata: mergedUnsafeMetadata }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Clerk API error during metadata update:", errorData);
            const errorMessage = errorData.errors?.[0]?.message || `Failed to update settings: ${response.statusText}`;
            if (newTimezone) timezoneUpdateStatus = { success: false, error: `Timezone: ${errorMessage}` };
            if (newDeviceId) deviceUpdateStatus = { success: false, error: `Device ID: ${errorMessage}` };
          } else {
            if (newTimezone) timezoneUpdateStatus = { success: true, message: "Timezone updated successfully." };
            if (newDeviceId) deviceUpdateStatus = { success: true, message: "Default device ID updated successfully." };
          }
        } catch (e) {
            console.error("SERVER ACTION: Exception during direct API call for metadata:", e);
            const errorMessage = e.message || "Exception during settings update.";
            if (newTimezone) timezoneUpdateStatus = { success: false, error: `Timezone: ${errorMessage}` };
            if (newDeviceId) deviceUpdateStatus = { success: false, error: `Device ID: ${errorMessage}` };
        }
      }
    } else {
        if (newTimezone === undefined && newDeviceId === undefined) {
            timezoneUpdateStatus = { success: true, message: "No timezone data submitted." };
            deviceUpdateStatus = { success: true, message: "No device ID data submitted." };
        } else {
            if (newTimezone === undefined) timezoneUpdateStatus = { success: true, message: "No timezone change requested." };
            if (newDeviceId === undefined) deviceUpdateStatus = { success: true, message: "No device ID change requested." };
        }
    }

    return {
      success: timezoneUpdateStatus.success && deviceUpdateStatus.success,
      timezoneUpdate: timezoneUpdateStatus,
      deviceUpdate: deviceUpdateStatus,
    };

  } catch (error) {
    console.error("Critical error in updateUserAccountAction:", error);
    return {
      success: false,
      error: "An critical server error occurred.", 
      timezoneUpdate: { success: false, error: "Update failed due to server error." }, 
      deviceUpdate: { success: false, error: "Update failed due to server error." }
    };
  }
} 
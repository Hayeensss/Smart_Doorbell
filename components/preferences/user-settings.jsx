"use client"

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import AccountInformationForm from "./account-information-form";
import DefaultSettingsForm from "./default-settings-form";
import UserSettingsSkeleton from "./user-settings-skeleton";
import { saveUserPreferencesAction } from "@/app/actions/userPreferencesActions";
import { updateUserAccountAction } from "@/app/actions/userProfileActions";
import { toast } from "@/hooks/use-toast";

export default function UserSettings({ initialPreferences }) {
  const { user, isLoaded: isUserLoaded, ...restUser } = useUser();

  // Account Info State 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deviceId, setDeviceId] = useState(""); 
  const [timezone, setTimezone] = useState("Australia/Perth");
  const [isSavingAccountInfo, setIsSavingAccountInfo] = useState(false);

  // Default Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      setTimezone(user.unsafeMetadata?.timezone || "Australia/Perth");
      setDeviceId(user.unsafeMetadata?.deviceId || ""); 
    }
  }, [user]);

  useEffect(() => {
    if (initialPreferences) {
      setNotificationsEnabled(
        initialPreferences.notificationsEnabled !== undefined
          ? initialPreferences.notificationsEnabled
          : true
      );
      setSoundsEnabled(
        initialPreferences.soundsEnabled !== undefined
          ? initialPreferences.soundsEnabled
          : true
      );
    } else {
      setNotificationsEnabled(true);
      setSoundsEnabled(true);
    }
    setIsLoading(false);
  }, [initialPreferences]);


  const handleSaveDefaultSettings = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "User not authenticated. Cannot save preferences.", variant: "destructive" });
      console.error("Attempted to save default settings without a user.");
      return;
    }
    setIsSavingPreferences(true);
    const preferencesToSaveForDB = { notificationsEnabled, soundsEnabled };
    try {
      const dbResult = await saveUserPreferencesAction(preferencesToSaveForDB);
      if (dbResult.success) {
        toast({ title: "Settings Saved", description: "Notification and sound settings saved successfully.", variant: "default" });
      } else {
        toast({ title: "Save Failed", description: dbResult.error || "Failed to save notification/sound settings.", variant: "destructive" });
        console.error("Failed to save default settings:", dbResult.error);
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while saving default settings.", variant: "destructive" });
      console.error("Error saving default settings in UserSettings:", error);
    }
    setIsSavingPreferences(false);
  };

  const handleSaveAccountInformation = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "User session not found. Please sign in again.", variant: "destructive" });
      console.error("Attempted to save account info without a user.");
      return;
    }

    setIsSavingAccountInfo(true);
    const currentMetaTimezone = user.unsafeMetadata?.timezone;
    const currentMetaDeviceId = user.unsafeMetadata?.deviceId;

    const formData = new FormData();
    let changesMade = false;

    if (timezone !== currentMetaTimezone) {
      formData.append('timezone', timezone);
      changesMade = true;
    }
    if (deviceId !== currentMetaDeviceId) {
      formData.append('deviceId', deviceId);
      changesMade = true;
    }

    if (!changesMade) {
      setIsSavingAccountInfo(false);
      return;
    }

    try {
      const result = await updateUserAccountAction(formData);
      let successMessages = [];
      let errorMessages = [];

      if (result.timezoneUpdate) {
        if (result.timezoneUpdate.success && result.timezoneUpdate.message !== "No timezone change requested.") {
          successMessages.push(result.timezoneUpdate.message || "Timezone updated successfully.");
        } else if (!result.timezoneUpdate.success) {
          errorMessages.push(result.timezoneUpdate.error || "Failed to update timezone.");
        }
      }
      if (result.deviceUpdate) {
        if (result.deviceUpdate.success && result.deviceUpdate.message !== "No device ID change requested.") { 
          successMessages.push(result.deviceUpdate.message || "Default device ID updated successfully.");
        } else if (!result.deviceUpdate.success) {
          errorMessages.push(result.deviceUpdate.error || "Failed to update device ID.");
        }
      }

      errorMessages.forEach(msg => toast({ title: "Update Error", description: msg, variant: "destructive" }));
      successMessages.forEach(msg => toast({ title: "Update Successful", description: msg, variant: "default" }));

      if (successMessages.length > 0 && restUser?.revalidate) {
         await restUser.revalidate(); 
      }
      
      if (successMessages.length === 0 && errorMessages.length === 0) {
          if (!result.success && result.error) {
            toast({ title: "Error", description: result.error || "An unknown error occurred.", variant: "destructive" });
            console.error("General error from updateUserAccountAction:", result.error);
          } else if (!changesMade && result.success) {
          }
      }

    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred while saving account changes.", variant: "destructive" });
      console.error("Error calling updateUserAccountAction in UserSettings:", error);
    }
    setIsSavingAccountInfo(false);
  };

  if (!isUserLoaded || isLoading) {
    return <UserSettingsSkeleton />;
  }

  if (!user && isUserLoaded) {
    console.log("Rendering UserSettings: User not loaded, but isLoaded is true. Showing sign-in prompt.");
    return <div className="p-6">Please sign in to manage your settings.</div>;
  }

  return (
    <div className="space-y-6">
      <AccountInformationForm
        name={name} 
        email={email} 
        deviceId={deviceId}
        setDeviceId={setDeviceId}
        timezone={timezone}
        setTimezone={setTimezone}
        handleAccountInfoSaveChanges={handleSaveAccountInformation}
        isSavingAccountInfo={isSavingAccountInfo}
      />
      <DefaultSettingsForm
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        soundsEnabled={soundsEnabled}
        setSoundsEnabled={setSoundsEnabled}
        handleSavePreferences={handleSaveDefaultSettings}
        isSavingPreferences={isSavingPreferences}
      />
    </div>
  );
}
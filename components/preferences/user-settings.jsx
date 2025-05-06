"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveUserPreferencesAction } from "@/app/actions/userPreferencesActions"

export default function UserSettings({ initialPreferences, preferencesError }) {
  const { user, isLoaded: isUserLoaded } = useUser();

  // Account Information States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("america-new_york");

  // Preferences States
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialPreferences?.notificationsEnabled !== undefined ? initialPreferences.notificationsEnabled : true
  );
  const [soundsEnabled, setSoundsEnabled] = useState(
    initialPreferences?.soundsEnabled !== undefined ? initialPreferences.soundsEnabled : true
  );
  const [defaultMode, setDefaultMode] = useState(initialPreferences?.defaultMode || "home");
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [initialLoadError, setInitialLoadError] = useState(preferencesError || null);

  // Effect to set account info once user is loaded
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
      setPhone(user.primaryPhoneNumber?.phoneNumber || "");
      setTimezone(user.unsafeMetadata?.timezone || "america-new_york");
    }
  }, [user]);

  // Effect to update states if initialPreferences prop changes (e.g., due to client-side navigation or re-fetch in parent)
  // This also handles the initial setup from the prop.
  useEffect(() => {
    if (initialPreferences) {
      setNotificationsEnabled(initialPreferences.notificationsEnabled !== undefined ? initialPreferences.notificationsEnabled : true);
      setSoundsEnabled(initialPreferences.soundsEnabled !== undefined ? initialPreferences.soundsEnabled : true);
      setDefaultMode(initialPreferences.defaultMode || "home");
      setInitialLoadError(null); // Clear previous error if new props are successfully passed
    } else if (preferencesError) {
        setInitialLoadError(preferencesError);
    }
    // If you want a brief loading state even with props, manage `isLoadingPreferences` based on `isUserLoaded`
    // For now, setting it to false as data is assumed to be loaded by parent.
    setIsLoadingPreferences(false); 
  }, [initialPreferences, preferencesError]);

  const handleAccountInfoSaveChanges = async () => {
    if (!user) {
      alert("User session not found. Please sign in again.");
      return;
    }
    let nameUpdateAttempted = false;
    let emailUpdateAttempted = false;
    let changesMade = false;
    if (name && name !== user.fullName) {
      nameUpdateAttempted = true;
      try {
        await user.update({ fullName: name });
        console.log("User full name updated successfully in Clerk.");
        changesMade = true;
      } catch (error) {
        console.error("Error updating full name:", error);
        alert(`Failed to update name: ${error.errors?.[0]?.message || 'An unexpected error occurred.'}`);
        return;
      }
    }
    const currentPrimaryEmail = user.primaryEmailAddress?.emailAddress;
    if (email && email !== currentPrimaryEmail) {
      emailUpdateAttempted = true;
      try {
        const newEmailAddress = await user.createEmailAddress({ email: email });
        console.log(`New email address ${email} added to Clerk. Verification needed.`);
        changesMade = true;
        alert(`The email address '${email}' has been added to your account. Please check your inbox (and spam folder) for a verification email from Clerk. Once verified, you can set it as your primary email address through your Clerk profile settings.`);
      } catch (error) {
        console.error("Error creating new email address with Clerk:", error);
        alert(`Failed to add new email: ${error.errors?.[0]?.message || 'An unexpected error occurred.'}`);
        return;
      }
    }
    if (changesMade) {
      alert("Your account changes have been processed.");
    } else if (nameUpdateAttempted || emailUpdateAttempted) {
      alert("No changes detected for account name or email.");
    } else {
      alert("No information was entered to update account name or email.");
    }
  };

  const handleSavePreferences = async () => {
    if (!user) {
      alert("User not authenticated. Cannot save preferences.");
      return;
    }
    setIsSavingPreferences(true);
    const preferencesToSave = {
      notificationsEnabled,
      soundsEnabled,
      defaultMode,
    };
    try {
      const result = await saveUserPreferencesAction(preferencesToSave);
      if (result.success) {
        alert("Preferences saved successfully!");
      } else {
        alert(`Failed to save preferences: ${result.error || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error("Error saving preferences in component:", error);
      alert("An unexpected error occurred while saving preferences.");
    }
    setIsSavingPreferences(false);
  };

  if (!isUserLoaded || isLoadingPreferences) {
    return <div className="p-6">Loading user settings...</div>; // Or a spinner component
  }

  if (!user && isUserLoaded) {
    return <div className="p-6">Please sign in to manage your settings.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new_york">America/New York</SelectItem>
                  <SelectItem value="america-los_angeles">America/Los Angeles</SelectItem>
                  <SelectItem value="america-chicago">America/Chicago</SelectItem>
                  <SelectItem value="europe-london">Europe/London</SelectItem>
                  <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAccountInfoSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>Configure your default system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-mode">Default Mode</Label>
            <Select value={defaultMode} onValueChange={setDefaultMode}>
              <SelectTrigger id="default-mode">
                <SelectValue placeholder="Select default mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="dnd">Do Not Disturb</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">This mode will be activated when the system starts up</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
              </div>
              <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sounds">Sounds</Label>
                <p className="text-sm text-muted-foreground">Play sounds for alerts and notifications</p>
              </div>
              <Switch id="sounds" checked={soundsEnabled} onCheckedChange={setSoundsEnabled} />
            </div>
          </div>

          <Button onClick={handleSavePreferences} disabled={isSavingPreferences}>
            {isSavingPreferences ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
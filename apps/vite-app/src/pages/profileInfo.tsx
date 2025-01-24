import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Pen, Check, Loader } from "lucide-react";

import { useUserProfile } from "../features/user/hooks/use.user.profile";
import { Countries } from "@repo/data/constants/countries";
import { Professions } from "@repo/data/constants/professions";
import AgePicker from "../components/AgePicker";
import { EditableProfileType, ProfileType } from "@repo/data/types/user";
import { defaultUserProfile } from "@repo/zod/validation/user";
import { showToast } from "@repo/ui/components/ui/toaster";
import CredentialsPage from "../features/user/components/CredentialsPage";
import { useUpdateUserProfile } from "../features/user/hooks/useUpdateUserProfile";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ProfileInfo() {
  const { userProfile, mutate } = useUserProfile();
  const { updateProfile } = useUpdateUserProfile();

  const [activeTab, setActiveTab] = useState("personalInfo");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editableProfile, setEditableProfile] = useState<Partial<ProfileType>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Merge local edits into the loaded user profile
  const profileData: ProfileType = {
    ...defaultUserProfile,
    ...(userProfile as ProfileType),
    ...editableProfile,
  };

  // Start editing a field
  const handleEdit = (field: keyof ProfileType) => {
    setEditingField(field);
    setEditableProfile((prev) => ({
      ...prev,
      [field]: (userProfile as ProfileType)?.[field] ?? null,
    }));
  };

  // Track changes; set isDirty = true if user has changed anything
  const handleChange = (field: keyof ProfileType, value: string | number | null) => {
    setEditableProfile((prev) => ({
      ...prev,
      [field]: value ?? undefined,
    }));
    setIsDirty(true);
  };

  // Save changes to the backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Only send fields that changed
      const modifiedFields: EditableProfileType = Object.fromEntries(Object.entries(editableProfile).filter(([key, val]) => val !== (userProfile as Partial<ProfileType>)[key as keyof ProfileType] && val !== undefined)) as EditableProfileType;

      if (Object.keys(modifiedFields).length > 0) {
        const updatedProfile: ProfileType = {
          ...profileData,
          ...modifiedFields,
        };

        // Update backend
        await updateProfile(updatedProfile);
        // Revalidate SWR data
        await mutate();
        showToast("Profile updated successfully!");
        setIsDirty(false);
      } else {
        showToast("No changes to save.");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error("Error updating profile:", errorMessage);
      showToast(`Failed to save changes: ${errorMessage}`, "error");
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  // Stop editing on Enter press (optional)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setEditingField(null);
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      {/* Banner if profile is incomplete */}

      <Card className="w-full max-w-4xl mx-auto bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>

        <Tabs defaultValue="personalInfo" value={activeTab} onValueChange={setActiveTab} className="mt-2 sm:mt-4">
          <TabsList className="flex justify-start pl-2 sm:pl-4 md:pl-6 pb-1 sm:pb-2 space-x-2 sm:space-x-4 bg-transparent">
            <TabsTrigger value="personalInfo" className={`sm:px-4 py-1 sm:py-2 whitespace-nowrap ${activeTab === "personalInfo" ? "border-b-2 border-primary bg-transparent" : "bg-transparent"}`}>
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="credentials" className={`px-2 sm:px-4 py-1 sm:py-2 whitespace-nowrap ${activeTab === "credentials" ? "border-b-2 border-primary bg-transparent" : "bg-transparent"}`}>
              Credentials
            </TabsTrigger>
          </TabsList>

          {/* --- Personal Info Tab --- */}
          <TabsContent value="personalInfo">
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(profileData).map(([key, value]) => {
                  if (["profilePicture", "coverImage", "createdAt", "completedProfile", "email", "password", "friendlyId"].includes(key)) {
                    return null; // Skip these fields
                  }

                  return (
                    <div key={key} className="relative flex flex-col bg-muted text-muted-foreground rounded-lg p-3 sm:p-4">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">{key === "age" ? "Age" : key.charAt(0).toUpperCase() + key.slice(1)}</label>

                        {editingField === key ? (
                          // If editing, show input/textarea/select
                          key === "bio" ? (
                            <Textarea value={(value as string) || ""} onChange={(e) => handleChange(key as keyof ProfileType, e.target.value)} onKeyDown={handleKeyDown} className="mt-1 w-full bg-card text-card-foreground border border-border rounded-lg text-sm p-2 sm:p-3" />
                          ) : key === "countryOrigin" || key === "profession" ? (
                            <Select onValueChange={(val) => handleChange(key as keyof ProfileType, val)} value={(value as string) || ""}>
                              <SelectTrigger className="w-full bg-card text-card-foreground text-sm p-2 sm:p-3">
                                <SelectValue>{key === "countryOrigin" ? Countries.find((c) => c.value === value)?.label || "Select" : Professions.find((p) => p.value === value)?.label || "Select"}</SelectValue>
                              </SelectTrigger>

                              <SelectContent className="bg-card text-card-foreground max-h-60 overflow-y-auto z-50">
                                {(key === "countryOrigin" ? Countries : Professions).map((item) => (
                                  <SelectItem key={item.value} value={item.value} className="cursor-pointer hover:bg-muted hover:text-primary rounded px-2 py-1 pr-10">
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : key === "age" ? (
                            <AgePicker value={(value as number) || null} onChange={(age) => handleChange(key as keyof ProfileType, age)} />
                          ) : (
                            <Input
                              value={(value as string | number) || ""}
                              onChange={(e) => handleChange(key as keyof ProfileType, e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="mt-1 w-full bg-card text-card-foreground border border-border rounded-lg text-sm p-2 sm:p-3"
                            />
                          )
                        ) : (
                          // If not editing, show plain text
                          <p className="mt-1 text-sm">{key === "age" && value === 0 ? "" : value}</p>
                        )}
                      </div>

                      {editingField !== key && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(key as keyof ProfileType)} className="absolute top-1 right-1 text-muted-foreground hover:text-foreground flex items-center">
                          <Pen className="h-3 w-3" />
                        </Button>
                      )}

                      {editingField === key && (
                        <Button variant="ghost" size="icon" onClick={() => setEditingField(null)} className="absolute top-1 right-1 text-primary hover:text-primary-foreground flex items-center">
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            {isDirty && (
              <CardFooter className="mt-4">
                <Button onClick={handleSave} className="bg-primary hover:bg-accent text-primary-foreground" disabled={isSaving}>
                  {isSaving ? <Loader className="animate-spin h-5 w-5" /> : "Save Changes"}
                </Button>
              </CardFooter>
            )}
          </TabsContent>
          <TabsContent value="credentials">
            <CredentialsPage />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

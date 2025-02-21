import { useState } from 'react';

import { Countries } from '@repo/data/constants/countries';
import { Professions } from '@repo/data/constants/professions';
import { EditableProfileType, ProfileType } from '@repo/data/types/user';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { showToast } from '@repo/ui/components/ui/toaster';
import { defaultUserProfile } from '@repo/zod/validation/user';
import { AlertCircle, Check, Loader, Pen } from 'lucide-react';

import { getErrorMessage } from '../../utils/getErrorMessage';
import AgePicker from '../components/AgePicker';
import CredentialsPage from '../features/user/components/CredentialsPage';
import IncompleteProfileDialog from '../features/user/components/IncompleteProfileDialog';
import ProfilePictureEdit from '../features/user/components/ProfilePicture';
import { useUserProfile } from '../features/user/hooks/use.user.profile';
import { useUpdateUserProfile } from '../features/user/hooks/useUpdateUserProfile';

export default function ProfileInfo() {
  const { userProfile, mutate } = useUserProfile();
  const { updateProfile } = useUpdateUserProfile();

  const [activeTab, setActiveTab] = useState('personalInfo');
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
      const modifiedFields: EditableProfileType = Object.fromEntries(
        Object.entries(editableProfile).filter(
          ([key, val]) =>
            val !== (userProfile as Partial<ProfileType>)[key as keyof ProfileType] &&
            val !== undefined,
        ),
      ) as EditableProfileType;

      if (Object.keys(modifiedFields).length > 0) {
        const updatedProfile: ProfileType = {
          ...profileData,
          ...modifiedFields,
        };

        // Update backend
        await updateProfile(updatedProfile);
        // Revalidate SWR data
        await mutate();
        showToast('Profile updated successfully!');
        setIsDirty(false);
      } else {
        showToast('No changes to save.');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error updating profile:', errorMessage);
      showToast(`Failed to save changes: ${errorMessage}`, 'error');
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  const [modalContent, setModalContent] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Stop editing on Enter press (optional)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setEditingField(null);
    }
  };

  const handleOpenModal = () => {
    const missingFields: string[] = [];
    if (!userProfile.username) missingFields.push('Username');
    if (!userProfile.profession) missingFields.push('Profession');
    if (!userProfile.countryOrigin) missingFields.push('Country');
    if (!userProfile.age) missingFields.push('Age');
    if (!userProfile.bio) missingFields.push('Bio');
    if (!userProfile.profilePicture) missingFields.push('Profile Picture');
    setModalContent(missingFields);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      {/* Banner if profile is incomplete */}
      <Card className="bg-card text-card-foreground mx-auto w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold sm:text-xl md:text-2xl">Edit Profile</CardTitle>
        </CardHeader>
        {userProfile.completedProfile === false && (
          <div
            className="ml-2 flex w-fit cursor-pointer items-center gap-2 rounded p-2 hover:bg-red-200"
            onClick={handleOpenModal}
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-500">
              Incomplete Profile – click here for details
            </span>
          </div>
        )}

        <IncompleteProfileDialog
          showModal={showModal}
          setShowModal={setShowModal}
          modalContent={modalContent}
        />

        <Tabs
          defaultValue="personalInfo"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2 sm:mt-10"
        >
          <TabsList className="flex justify-start space-x-2 bg-transparent pl-2 sm:space-x-4 sm:pb-10 sm:pl-4 md:pl-6">
            <TabsTrigger
              value="personalInfo"
              className={`whitespace-nowrap py-1 sm:px-4 sm:py-2 ${
                activeTab === 'personalInfo' ? 'border-primary border-b-2' : 'bg-transparent'
              }`}
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className={`whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2 ${
                activeTab === 'credentials'
                  ? 'border-primary border-b-2 bg-transparent'
                  : 'bg-transparent'
              }`}
            >
              Credentials
            </TabsTrigger>
          </TabsList>

          {/* --- Personal Info Tab --- */}
          <TabsContent value="personalInfo">
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex w-fit cursor-pointer">
                  <ProfilePictureEdit label="Profile Picture" field="profilePicture" />
                </div>
                {Object.entries(profileData).map(([key, value]) => {
                  if (
                    [
                      'profilePicture',
                      'coverImage',
                      'createdAt',
                      'completedProfile',
                      'email',
                      'password',
                      'friendlyId',
                    ].includes(key)
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={key}
                      className="bg-muted text-muted-foreground relative flex flex-col rounded-lg p-3 sm:p-4"
                    >
                      <div className="w-full">
                        <label className="text-muted-foreground mb-1 block text-sm font-medium">
                          {key === 'age' ? 'Age' : key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>

                        {editingField === key ? (
                          // If editing, show input/textarea/select
                          key === 'bio' ? (
                            <Textarea
                              value={(value as string) || ''}
                              onChange={(e) =>
                                handleChange(key as keyof ProfileType, e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className="bg-card text-card-foreground border-border mt-1 w-full rounded-lg border p-2 text-sm sm:p-3"
                            />
                          ) : key === 'countryOrigin' || key === 'profession' ? (
                            <Select
                              onValueChange={(val) => handleChange(key as keyof ProfileType, val)}
                              value={(value as string) || ''}
                            >
                              <SelectTrigger className="bg-card text-card-foreground w-full p-2 text-sm sm:p-3">
                                <SelectValue>
                                  {key === 'countryOrigin'
                                    ? Countries.find((c) => c.value === value)?.label || 'Select'
                                    : Professions.find((p) => p.value === value)?.label || 'Select'}
                                </SelectValue>
                              </SelectTrigger>

                              <SelectContent className="bg-card text-card-foreground z-50 max-h-60 overflow-y-auto">
                                {(key === 'countryOrigin' ? Countries : Professions).map((item) => (
                                  <SelectItem
                                    key={item.value}
                                    value={item.value}
                                    className="hover:bg-muted hover:text-primary cursor-pointer rounded px-2 py-1 pr-10"
                                  >
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : key === 'age' ? (
                            <AgePicker
                              value={(value as number) || null}
                              onChange={(age) => handleChange(key as keyof ProfileType, age)}
                            />
                          ) : (
                            <Input
                              value={(value as string | number) || ''}
                              onChange={(e) =>
                                handleChange(key as keyof ProfileType, e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className="bg-card text-card-foreground border-border mt-1 w-full rounded-lg border p-2 text-sm sm:p-3"
                            />
                          )
                        ) : (
                          // If not editing, show plain text
                          <p className="mt-1 text-sm">
                            {key === 'age' && value === 0 ? '' : value}
                          </p>
                        )}
                      </div>

                      {editingField !== key && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(key as keyof ProfileType)}
                          className="text-muted-foreground hover:text-foreground absolute right-1 top-1 flex items-center"
                        >
                          <Pen className="h-3 w-3" />
                        </Button>
                      )}

                      {editingField === key && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingField(null)}
                          className="text-primary hover:text-primary-foreground absolute right-1 top-1 flex items-center"
                        >
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
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader className="h-5 w-5 animate-spin" /> : 'Save Changes'}
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

// import { useState } from 'react';

// import { EditableProfileType, ProfileType } from '@repo/data/types/user';
// import { Button } from '@repo/ui/components/ui/button';
// import { showToast } from '@repo/ui/components/ui/toaster';

// import { getErrorMessage } from '../../utils/getErrorMessage';
// import { useUserProfile } from '../features/user/hooks/use.user.profile';
// import ProfileField from './ProfileField';
// import { useUpdateUserProfile } from '../hooks/useUpdateUserProfile';

// export default function ProfileForm() {
//   const { userProfile, mutate } = useUserProfile();
//   const { updateProfile } = useUpdateUserProfile();

//   const [editableProfile, setEditableProfile] = useState<Partial<ProfileType>>({});
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const profileData: ProfileType = { ...userProfile, ...editableProfile };

//   const handleEdit = (field: keyof ProfileType) => {
//     setEditingField(field);
//     setEditableProfile((prev) => ({ ...prev, [field]: userProfile?.[field] ?? null }));
//   };

//   const handleChange = (field: keyof ProfileType, value: string | number | null) => {
//     setEditableProfile((prev) => ({ ...prev, [field]: value ?? undefined }));
//     setIsDirty(true);
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       const modifiedFields = Object.fromEntries(
//         Object.entries(editableProfile).filter(([key, val]) => val !== userProfile?.[key]),
//       );
//       if (Object.keys(modifiedFields).length > 0) {
//         await updateProfile({ ...profileData, ...modifiedFields } as EditableProfileType);
//         await mutate();
//         showToast('Profile updated successfully!');
//       } else {
//         showToast('No changes to save.');
//       }
//     } catch (err) {
//       showToast(`Failed to save changes: ${getErrorMessage(err)}`, 'error');
//     } finally {
//       setIsSaving(false);
//       setEditingField(null);
//       setIsDirty(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {Object.entries(profileData).map(([key, value]) =>
//         [
//           'profilePicture',
//           'coverImage',
//           'createdAt',
//           'completedProfile',
//           'email',
//           'password',
//           'friendlyId',
//         ].includes(key) ? null : (
//           <ProfileField
//             key={key}
//             field={key}
//             label={key.charAt(0).toUpperCase() + key.slice(1)}
//             value={value}
//             isEditing={editingField === key}
//             onEdit={() => handleEdit(key as keyof ProfileType)}
//             onSave={handleSave}
//             onChange={(val) => handleChange(key as keyof ProfileType, val)}
//           />
//         ),
//       )}
//       {isDirty && (
//         <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-accent">
//           {isSaving ? 'Saving...' : 'Save Changes'}
//         </Button>
//       )}
//     </div>
//   );
// }

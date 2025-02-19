import { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { showToast } from '@repo/ui/components/ui/toaster';
import { Check, Loader, Pen } from 'lucide-react';

import { useFetchCredentials, useUpdateCredentials } from '../hooks/use.auth';

type EditableCredentialsType = {
  email: string;
  password: string;
};
export type UpdateCredentialsPayload = {
  email?: string | undefined;
  password?: string | undefined;
};

export default function CredentialsPage() {
  const { credentials, mutate } = useFetchCredentials();
  const { updateCredentials } = useUpdateCredentials();

  // local editing states
  const [editableCredentials, setEditableCredentials] = useState<Partial<EditableCredentialsType>>(
    {},
  );
  const [editingField, setEditingField] = useState<keyof EditableCredentialsType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Whenever editableCredentials or credentials changes, check if there's a difference
  useEffect(() => {
    const emailChanged = editableCredentials.email !== credentials?.email;
    const passwordChanged =
      editableCredentials.password !== undefined && editableCredentials.password !== '';
    setIsDirty(emailChanged || passwordChanged);
  }, [editableCredentials, credentials]);

  // Start editing a field
  const handleEdit = (field: keyof EditableCredentialsType) => {
    setEditingField(field);
    setEditableCredentials((prev) => ({
      ...prev,
      [field]: field === 'password' ? '' : (credentials?.[field] ?? ''),
    }));
  };

  // Track changes
  const handleChange = (field: keyof EditableCredentialsType, value: string) => {
    setEditableCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Only send changed fields
      const modifiedFields: UpdateCredentialsPayload = {
        email:
          editableCredentials.email !== credentials?.email ? editableCredentials.email : undefined,
        password: editableCredentials.password !== '' ? editableCredentials.password : undefined,
      };

      const hasChanges = Object.values(modifiedFields).some((val) => val !== undefined);

      if (hasChanges) {
        await updateCredentials(modifiedFields);
        // revalidate the data
        await mutate();
        showToast('Credentials updated successfully!');
      } else {
        showToast('No changes to save.');
      }
    } catch (err) {
      console.error('Error updating credentials:', err);
      showToast('Failed to save credentials.');
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6">
      {/* Fields */}
      {(['email', 'password'] as (keyof EditableCredentialsType)[]).map((field) => {
        const label = field === 'password' ? 'Password' : 'Email';
        const currentValue =
          editableCredentials[field] ?? credentials?.[field] ?? (field === 'password' ? '' : '');

        return (
          <div
            key={field}
            className="bg-muted text-muted-foreground relative mb-6 flex flex-col rounded-lg p-3 sm:p-4"
          >
            <label className="text-muted-foreground mb-1 block text-sm font-medium">{label}</label>

            {/* Edit or Display */}
            {editingField === field ? (
              <Input
                type={field === 'password' ? 'password' : 'text'}
                value={currentValue}
                onChange={(e) => handleChange(field, e.target.value)}
                className="bg-card text-card-foreground border-border mt-1 w-full rounded-lg border p-2 text-sm sm:p-3"
              />
            ) : (
              <p className="mt-1 text-sm">{field === 'password' ? '********' : currentValue}</p>
            )}

            {/* Edit / Save icons */}
            {editingField !== field ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(field)}
                className="text-muted-foreground hover:text-foreground absolute right-1 top-1 flex items-center"
              >
                <Pen className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingField(null)} // discard changes for that field
                className="text-primary hover:text-primary-foreground absolute right-1 top-1 flex items-center"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}

      {/* Single Save button */}
      {isDirty && (
        <div className="mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-accent text-primary-foreground mb-4"
          >
            {isSaving ? <Loader className="h-5 w-5 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}

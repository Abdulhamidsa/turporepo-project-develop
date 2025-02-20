import { Countries } from '@repo/data/constants/countries';
import { Professions } from '@repo/data/constants/professions';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Check, Pen } from 'lucide-react';

import AgePicker from '../../../components/AgePicker';

interface ProfileFieldProps {
  label: string;
  value: string | number | null;
  field: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onChange: (value: string | number | null) => void;
}

export default function ProfileField({
  label,
  value,
  field,
  isEditing,
  onEdit,
  onSave,
  onChange,
}: ProfileFieldProps) {
  return (
    <div className="bg-muted text-muted-foreground relative flex flex-col rounded-lg p-3 sm:p-4">
      <label className="text-sm font-medium">{label}</label>

      {isEditing ? (
        field === 'bio' ? (
          <Textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border p-2"
          />
        ) : field === 'age' ? (
          <AgePicker value={value as number} onChange={onChange} />
        ) : field === 'countryOrigin' || field === 'profession' ? (
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {field === 'countryOrigin'
                  ? Countries.find((c) => c.value === value)?.label
                  : Professions.find((p) => p.value === value)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(field === 'countryOrigin' ? Countries : Professions).map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-full border p-2"
          />
        )
      ) : (
        <p className="mt-1 text-sm">{value || '—'}</p>
      )}

      <Button
        onClick={isEditing ? onSave : onEdit}
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1"
      >
        {isEditing ? <Check className="h-4 w-4" /> : <Pen className="h-3 w-3" />}
      </Button>
    </div>
  );
}

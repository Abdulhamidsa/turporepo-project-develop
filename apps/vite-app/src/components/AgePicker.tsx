import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';

interface AgePickerProps {
  value: number | null;
  onChange: (age: number) => void;
}

export default function AgePicker({ value, onChange }: AgePickerProps) {
  const minAge = 16;
  const maxAge = 100;
  const ageOptions = Array.from({ length: maxAge - minAge + 1 }, (_, i) => minAge + i);

  return (
    <Select onValueChange={(val) => onChange(parseInt(val, 10))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={value ? value.toString() : 'Select Age'} />
      </SelectTrigger>
      <SelectContent className="bg-card text-card-foreground z-50 max-h-60 overflow-y-auto">
        {ageOptions.map((age) => (
          <SelectItem
            key={age}
            value={age.toString()}
            className="hover:bg-muted hover:text-primary cursor-pointer rounded px-2 py-1"
          >
            {age}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

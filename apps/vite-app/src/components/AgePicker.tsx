import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";

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
        <SelectValue placeholder={value ? value.toString() : "Select Age"} />
      </SelectTrigger>
      <SelectContent className="bg-card text-card-foreground max-h-60 overflow-y-auto z-50">
        {ageOptions.map((age) => (
          <SelectItem key={age} value={age.toString()} className="cursor-pointer hover:bg-muted hover:text-primary rounded px-2 py-1">
            {age}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

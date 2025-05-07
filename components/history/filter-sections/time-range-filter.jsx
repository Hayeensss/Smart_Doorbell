import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timeRangeOptions = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export default function TimeRangeFilter({ localTimeRange, onTimeRangeChange }) {
  return (
    <div className="space-y-2">
      <Label>Time Range</Label>
      <RadioGroup value={localTimeRange} onValueChange={onTimeRangeChange}>
        {timeRangeOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`filter-${option.value}`} />
            <Label htmlFor={`filter-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 
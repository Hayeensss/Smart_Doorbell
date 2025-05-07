import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const formatEventTypeForDisplay = (type) => {
  if (!type) return "";
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function EventTypesFilter({ localEventTypes, availableEventTypes = [], onEventTypeChange }) {
  return (
    <div className="space-y-2">
      <Label>Event Types</Label>
      {availableEventTypes.length > 0 ? (
        availableEventTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${type}`}
              checked={!!localEventTypes[type]} 
              onCheckedChange={() => onEventTypeChange(type)}
            />
            <Label htmlFor={`filter-${type}`}>{formatEventTypeForDisplay(type)}</Label>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No event types available to filter.</p>
      )}
    </div>
  );
} 
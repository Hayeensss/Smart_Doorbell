import { Label } from "@/components/ui/label";
import { format as formatDate, parseISO } from 'date-fns';

const formatDateForInput = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    return formatDate(date, 'yyyy-MM-dd');
  } 
  return '';
};

export default function DateFilter({ localDate, onDateChange }) {
  
  const handleInputChange = (event) => {
    const dateString = event.target.value;
    if (dateString) {
      try {
        const newDate = parseISO(dateString);
        if (!isNaN(newDate)) {
          onDateChange(newDate); 
        } else {
          onDateChange(null);
        }
      } catch (e) {
        console.error("Error parsing date string:", e);
        onDateChange(null);
      }
    } else {
      onDateChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date-filter-input">Date</Label>
      <input
        type="date"
        id="date-filter-input"
        value={formatDateForInput(localDate)}
        onChange={handleInputChange}
        className="flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Basic styling similar to shadcn Input
      />
    </div>
  );
} 
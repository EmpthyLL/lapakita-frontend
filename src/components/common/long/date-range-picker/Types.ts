import { DateRange, Matcher } from "react-day-picker";

export interface DateRangePickerProps {
  onUpdate?: (values: DateRange) => void;
  value?: DateRange;
  selectedDate?: DateRange | undefined;
  onCancel?: () => void;
  fixedCalender?: boolean;
  align?: "start" | "center" | "end";
  locale?: string;
  disabled?: Matcher | Matcher[];
  fromYear?: number;
  toYear?: number;
}

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const PRESET_KEYS = [
  "today",
  "yesterday",
  "last7",
  "last14",
  "last30",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisYear",
] as const;

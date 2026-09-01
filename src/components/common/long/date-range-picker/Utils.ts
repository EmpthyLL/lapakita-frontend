import { DateRange } from "react-day-picker";

export const formatDate = (date: Date, locale: string = "en-US"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const isValidDate = (date: Date | string | undefined): boolean => {
  if (date === undefined) return false;
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

export const getPresetRange = (presetName: string): DateRange => {
  const from = new Date();
  const to = new Date();
  const first = from.getDate() - from.getDay();

  switch (presetName) {
    case "today":
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "yesterday":
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;
    case "last7":
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "last14":
      from.setDate(from.getDate() - 13);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "last30":
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "thisWeek":
      from.setDate(first);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "lastWeek":
      from.setDate(from.getDate() - 7 - from.getDay());
      to.setDate(to.getDate() - to.getDay() - 1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "thisMonth":
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "lastMonth":
      from.setMonth(from.getMonth() - 1);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
    case "thisYear":
      from.setMonth(0);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error(`Unexpected preset name: ${presetName}`);
  }

  return { from, to };
};

export const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
  if (!a || !b) return a === b;
  return (
    a?.from?.getTime() === b?.from?.getTime() &&
    (!a?.to || !b?.to || a.to.getTime() === b.to.getTime())
  );
};

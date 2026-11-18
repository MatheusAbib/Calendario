import { formatDateKey, parseDateKey } from "./dates";

function readStoredObject(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return {};

    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

export function readEvents() {
  return readStoredObject("events");
}

export function readRecurringEvents() {
  return readStoredObject("recurringEvents");
}

export function normalizeEventsForDate(value) {
  if (!value) return [];

  const items = Array.isArray(value) ? value : [value];

  return items
    .filter((event) => event && typeof event === "object")
    .map((event, index) => ({
      ...event,
      id: event.id || `legacy_${index}`,
      isRecurring: false
    }));
}

function matchesRecurrence(event, date, startDate) {
  switch (event.type) {
    case "daily":
      return true;

    case "weekly":
      if (!event.daysOfWeek?.length) {
        return date.getDay() === startDate.getDay();
      }

      return event.daysOfWeek.map(String).includes(String(date.getDay()));

    case "monthly":
      if (event.monthlyOption === "same-day") {
        return date.getDate() === startDate.getDate();
      }

      return (
        date.getDay() === startDate.getDay() &&
        Math.ceil(date.getDate() / 7) === Math.ceil(startDate.getDate() / 7)
      );

    case "yearly":
      return (
        date.getDate() === startDate.getDate() &&
        date.getMonth() === startDate.getMonth()
      );

    default:
      return false;
  }
}

function getRecurringOccurrence(id, event, date) {
  const startDate = parseDateKey(event.startDate);

  if (!startDate) return null;

  const dateKey = formatDateKey(date);

  if (date < startDate) return null;

  if (event.excludedDates?.includes(dateKey)) return null;

  if (event.endCondition === "date") {
    const endDate = parseDateKey(event.endDate);

    if (!endDate || date > endDate) return null;
  }

  if (!matchesRecurrence(event, date, startDate)) return null;

  if (event.endCondition === "count") {
    const limit = Number(event.occurrenceCount);

    if (!Number.isInteger(limit) || limit <= 0) return null;

    let occurrences = 0;
    const current = new Date(startDate);

    while (current <= date && occurrences < limit) {
      const currentKey = formatDateKey(current);

      if (
        !event.excludedDates?.includes(currentKey) &&
        matchesRecurrence(event, current, startDate)
      ) {
        occurrences++;

        if (currentKey === dateKey) {
          return {
            ...event,
            id,
            originalId: id,
            isRecurring: true
          };
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return null;
  }

  return {
    ...event,
    id,
    originalId: id,
    isRecurring: true
  };
}

export function getEventsForDate(date, events, recurringEvents) {
  const dateKey = formatDateKey(date);
  const result = normalizeEventsForDate(events[dateKey]);

  for (const [id, event] of Object.entries(recurringEvents)) {
    const occurrence = getRecurringOccurrence(id, event, date);

    if (occurrence) {
      result.push(occurrence);
    }
  }

  return result;
}

import { formatDateKey, parseDateKey } from "./dates";

const STORAGE_KEY = "customSpecialDates";

export function readSpecialDates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) =>
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.name === "string" &&
      parseDateKey(item.date)
    );
  } catch {
    return [];
  }
}

export function saveSpecialDates(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function createSpecialDate(data) {
  const name = String(data.name || "").trim();
  const date = parseDateKey(data.date);

  if (!name || !date) {
    return null;
  }

  const item = {
    id: `special_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    name,
    date: formatDateKey(date),
    recurring: Boolean(data.recurring),
    type: data.type === "holiday" ? "holiday" : "commemorative"
  };

  const items = readSpecialDates();

  if (!saveSpecialDates([...items, item])) {
    return null;
  }

  return item;
}

export function updateSpecialDate(id, data) {
  const items = readSpecialDates();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  const name = String(data.name || "").trim();
  const date = parseDateKey(data.date);

  if (!name || !date) {
    return false;
  }

  const updated = [...items];

  updated[index] = {
    ...updated[index],
    name,
    date: formatDateKey(date),
    recurring: Boolean(data.recurring),
    type: data.type === "holiday" ? "holiday" : "commemorative"
  };

  return saveSpecialDates(updated);
}

export function deleteSpecialDate(id) {
  const items = readSpecialDates();

  if (!items.some((item) => item.id === id)) {
    return false;
  }

  return saveSpecialDates(items.filter((item) => item.id !== id));
}

export function getSpecialDatesForDate(date, items = readSpecialDates()) {
  const targetKey = formatDateKey(date);

  return items.filter((item) => {
    const originalDate = parseDateKey(item.date);

    if (!originalDate) {
      return false;
    }

    if (!item.recurring) {
      return item.date === targetKey;
    }

    return (
      originalDate.getMonth() === date.getMonth() &&
      originalDate.getDate() === date.getDate() &&
      date.getFullYear() >= originalDate.getFullYear()
    );
  });
}

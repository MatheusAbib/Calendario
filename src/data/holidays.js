import { formatDateKey } from "../utils/dates";

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function offsetDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getHolidaysForYear(year) {
  const holidays = {};

  const addHoliday = (date, name, type = "national") => {
    const key = formatDateKey(date);

    if (!holidays[key]) {
      holidays[key] = [];
    }

    holidays[key].push({ name, type });
  };

  const fixedHolidays = [
    [1, 1, "Confraternização Universal"],
    [4, 21, "Tiradentes"],
    [5, 1, "Dia Mundial do Trabalho"],
    [9, 7, "Independência do Brasil"],
    [10, 12, "Nossa Senhora Aparecida"],
    [11, 2, "Finados"],
    [11, 15, "Proclamação da República"],
    [11, 20, "Dia Nacional de Zumbi e da Consciência Negra"],
    [12, 25, "Natal"]
  ];

  for (const [month, day, name] of fixedHolidays) {
    addHoliday(new Date(year, month - 1, day), name);
  }

  const easter = getEasterDate(year);

  addHoliday(offsetDate(easter, -48), "Segunda-feira de Carnaval", "optional");
  addHoliday(offsetDate(easter, -47), "Terça-feira de Carnaval", "optional");
  addHoliday(offsetDate(easter, -46), "Quarta-feira de Cinzas", "optional");
  addHoliday(offsetDate(easter, -2), "Sexta-feira Santa");
  addHoliday(easter, "Páscoa", "observance");
  addHoliday(offsetDate(easter, 60), "Corpus Christi", "optional");

  return holidays;
}

export function getHolidaysForDate(date) {
  const holidays = getHolidaysForYear(date.getFullYear());
  return holidays[formatDateKey(date)] || [];
}

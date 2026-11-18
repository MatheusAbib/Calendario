import { SearchSunLongitude } from "astronomy-engine";

const TIME_ZONE = "America/Sao_Paulo";

const TRANSITIONS = [
  { longitude: 0, name: "Outono" },
  { longitude: 90, name: "Inverno" },
  { longitude: 180, name: "Primavera" },
  { longitude: 270, name: "Verão" }
];

const MONTH_SEASONS = [
  "Verão",
  "Verão",
  "Verão",
  "Outono",
  "Outono",
  "Outono",
  "Inverno",
  "Inverno",
  "Inverno",
  "Primavera",
  "Primavera",
  "Primavera"
];

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit"
});

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "numeric"
});

const cache = new Map();

export function getSeasonTransitions(year) {
  if (cache.has(year)) return cache.get(year);

  const transitions = TRANSITIONS.map((transition, index) => {
    const approximateMonth = index * 3 + 2;
    const searchStart = new Date(
      Date.UTC(year, approximateMonth, 15, 0, 0, 0)
    );

    const result = SearchSunLongitude(
      transition.longitude,
      searchStart,
      15
    );

    if (!result) {
      throw new Error("Não foi possível calcular a estação.");
    }

    const date = result.date;

    return {
      name: transition.name,
      date,
      month: Number(MONTH_FORMAT.format(date)) - 1,
      formattedDate: DATE_FORMAT.format(date)
    };
  });

  cache.set(year, transitions);

  return transitions;
}

export function getMonthSeason(month, year) {
  const transitions = getSeasonTransitions(year);
  const transition = transitions.find((item) => item.month === month);

  if (transition) {
    const previousSeason = MONTH_SEASONS[month];

    return `${previousSeason} → ${transition.name} · ${transition.formattedDate}`;
  }

  return MONTH_SEASONS[month];
}

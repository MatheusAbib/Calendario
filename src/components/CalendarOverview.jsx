import { useEffect, useState } from "react";
import { getHolidaysForYear } from "../data/holidays";

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const TIME_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short"
});

const DAY_MS = 86400000;

function dayNumber(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
  );
}

function daysBetween(start, end) {
  return dayNumber(end) - dayNumber(start);
}

function getYearProgress(date) {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const elapsed = daysBetween(start, date) + 1;
  const total = daysBetween(start, end);

  return {
    elapsed,
    total,
    percentage: (elapsed / total) * 100
  };
}

function getNextHoliday(date) {
  const currentYear = date.getFullYear();
  const candidates = [];

  for (const year of [currentYear, currentYear + 1]) {
    const holidays = getHolidaysForYear(year);

    for (const [dateKey, items] of Object.entries(holidays)) {
      const [y, m, d] = dateKey.split("-").map(Number);
      const holidayDate = new Date(y, m - 1, d);
      const remaining = daysBetween(date, holidayDate);

      if (remaining < 0) continue;

      for (const item of items) {
        if (item.type === "national") {
          candidates.push({
            name: item.name,
            date: holidayDate,
            remaining
          });
        }
      }
    }
  }

  candidates.sort((a, b) => a.remaining - b.remaining);

  return candidates[0] || null;
}

function getSeasons(year) {
  return [
    { name: "Outono", date: new Date(year, 2, 20) },
    { name: "Inverno", date: new Date(year, 5, 21) },
    { name: "Primavera", date: new Date(year, 8, 22) },
    { name: "Verão", date: new Date(year, 11, 21) }
  ];
}

function getSeasonInformation(date) {
  const year = date.getFullYear();
  const transitions = [
    ...getSeasons(year - 1),
    ...getSeasons(year),
    ...getSeasons(year + 1)
  ];

  let current = transitions[0];
  let next = transitions[transitions.length - 1];

  for (let index = 0; index < transitions.length; index++) {
    if (dayNumber(transitions[index].date) <= dayNumber(date)) {
      current = transitions[index];
      next = transitions[index + 1] || next;
    }
  }

  return {
    current: current.name,
    next: next.name,
    nextDate: next.date,
    remaining: daysBetween(date, next.date)
  };
}

function formatRemaining(days) {
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `Em ${days} dias`;
}

export default function CalendarOverview() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const holiday = getNextHoliday(now);
  const progress = getYearProgress(now);
  const season = getSeasonInformation(now);

  return (
    <section className="calendar-overview" aria-label="Informações do calendário">
      <div className="calendar-overview-heading">
        <span className="calendar-overview-eyebrow">O TEMPO PRESENTE</span>
        <h2>Panorama do dia</h2>
      </div>

      <div className="calendar-overview-grid">

        <article className="calendar-overview-card">
          <span className="calendar-overview-label">PRÓXIMO FERIADO</span>
          {holiday ? (
            <>
              <strong className="calendar-overview-value">
                {SHORT_DATE_FORMAT.format(holiday.date)}
              </strong>
              <span className="calendar-overview-description">
                {holiday.name}
              </span>
              <span className="calendar-overview-detail">
                {formatRemaining(holiday.remaining)}
              </span>
            </>
          ) : (
            <span className="calendar-overview-description">
              Nenhum feriado encontrado
            </span>
          )}
        </article>

        <article className="calendar-overview-card">
          <span className="calendar-overview-label">ANO DECORRIDO</span>
          <strong className="calendar-overview-value">
            {progress.percentage.toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            })}%
          </strong>
          <div
            className="calendar-overview-progress"
            role="progressbar"
            aria-label="Progresso do ano"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(progress.percentage.toFixed(1))}
          >
            <span style={{ width: `${progress.percentage}%` }} />
          </div>
          <span className="calendar-overview-detail">
            {progress.elapsed} de {progress.total} dias
          </span>
        </article>

        <article className="calendar-overview-card calendar-overview-card--season">
          <span className="calendar-overview-label">ESTAÇÃO ATUAL</span>
          <strong className="calendar-overview-value">
            {season.current}
          </strong>
          <span className="calendar-overview-description">
            Hemisfério Sul
          </span>
          <span className="calendar-overview-detail">
            Próxima: {season.next}, aproximadamente em{" "}
            {SHORT_DATE_FORMAT.format(season.nextDate)}
          </span>
          <span className="calendar-overview-detail">
            {formatRemaining(season.remaining)}
          </span>
        </article>
      </div>
    </section>
  );
}


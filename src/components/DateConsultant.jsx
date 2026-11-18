import { useEffect, useState } from "react";

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long"
});

const FULL_DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const DAY_MS = 86400000;

function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getDayNumber(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS
  );
}

function getSeason(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const code = month * 100 + day;

  if (code >= 1221 || code < 320) return "Verão";
  if (code < 621) return "Outono";
  if (code < 922) return "Inverno";
  return "Primavera";
}

function getDistanceDescription(date, today) {
  const difference = getDayNumber(date) - getDayNumber(today);
  const days = Math.abs(difference);

  if (difference === 0) return "É hoje!";
  if (difference === 1) return "É amanhã!";
  if (difference === -1) return "Foi ontem!";

  if (difference > 0) {
    return `Faltam ${days.toLocaleString("pt-BR")} dias`;
  }

  return `Há ${days.toLocaleString("pt-BR")} dias`;
}

function addCalendarMonths(date, months) {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDay));
  return result;
}

function getShortcutDate(type) {
  const date = new Date();

  if (type === "week") {
    date.setDate(date.getDate() + 7);
  }

  if (type === "month") {
    return addCalendarMonths(date, 1);
  }

  if (type === "year") {
    return addCalendarMonths(date, 12);
  }

  return date;
}

export default function DateConsultant() {
  const [selectedDate, setSelectedDate] = useState(() => toDateValue(new Date()));
  const [today, setToday] = useState(() => new Date());
  const [activeShortcut, setActiveShortcut] = useState("today");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setToday(new Date());
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  const date = parseDate(selectedDate);
  const weekday = date ? WEEKDAY_FORMAT.format(date) : "";
  const fullDate = date ? FULL_DATE_FORMAT.format(date) : "";
  const season = date ? getSeason(date) : "";
  const distance = date ? getDistanceDescription(date, today) : "";

  const shortcuts = [
    { id: "today", label: "Hoje" },
    { id: "week", label: "Daqui 1 semana" },
    { id: "month", label: "Daqui 1 mês" },
    { id: "year", label: "Daqui 1 ano" }
  ];

  const applyShortcut = (type) => {
    setSelectedDate(toDateValue(getShortcutDate(type)));
    setToday(new Date());
    setActiveShortcut(type);
  };

  return (
    <section className="date-consultant" aria-labelledby="date-consultant-title">
      <div className="date-consultant-heading">
        <span className="date-consultant-eyebrow">CONSULTA AO CALENDÁRIO</span>
        <h2 id="date-consultant-title">Consultor de Data</h2>
        <p>Descubra em qual dia da semana cai qualquer data.</p>
      </div>

      <div className="date-consultant-layout">
        <div className="date-consultant-form-area">
          <label htmlFor="date-consultant-input">Escolha uma data</label>

          <input
            id="date-consultant-input"
            type="date"
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setActiveShortcut(null);
            }}
          />

          <span className="date-consultant-shortcuts-label">
            CONSULTAS RÁPIDAS
          </span>

          <div className="date-consultant-shortcuts">
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.id}
                type="button"
                className={
                  activeShortcut === shortcut.id
                    ? "date-consultant-shortcut is-active"
                    : "date-consultant-shortcut"
                }
                aria-pressed={activeShortcut === shortcut.id}
                onClick={() => applyShortcut(shortcut.id)}
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>

        <div className="date-consultant-result" aria-live="polite">
          {date ? (
            <>
              <span className="date-consultant-result-label">
                RESULTADO DA CONSULTA
              </span>

              <span className="date-consultant-result-number">
                {String(date.getDate()).padStart(2, "0")}
              </span>

              <h3>{weekday}</h3>

              <p className="date-consultant-full-date">{fullDate}</p>

              <div className="date-consultant-result-bottom">
                <span className="date-consultant-season">
                  {season} · Hemisfério Sul
                </span>

                <strong className="date-consultant-distance">
                  {distance}
                </strong>
              </div>
            </>
          ) : (
            <p className="date-consultant-empty">
              Selecione uma data válida para consultar.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

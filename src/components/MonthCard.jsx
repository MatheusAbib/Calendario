import { getMonthSeason } from "../utils/seasons";
import { getSpecialDatesForDate } from "../utils/specialDates";
import { useState } from "react";
import CalendarDay from "./CalendarDay";
import { MONTHS, WEEKDAYS, MONTH_THEMES } from "../data/calendar";
import { getEventsForDate } from "../utils/events";
import { formatDateKey } from "../utils/dates";

const IMAGE_NAMES = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
];

export default function MonthCard({
  year,
  month,
  selectedDate,
  onSelectDate,
  events = {},
  recurringEvents = {},
  holidays = {},
  specialDates = []
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const theme = MONTH_THEMES[month];

  const days = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from(
      { length: totalDays },
      (_, index) => new Date(year, month, index + 1)
    )
  ];

  return (
    <article
      className="month-card"
      style={{
        "--month-color": theme.color,
        "--month-background": theme.background
      }}
    >
      <div className="month-artwork">
        {!imageFailed && (
          <img
            className="month-artwork-image"
            src={`/imagens/meses/${IMAGE_NAMES[month]}.jpg`}
            alt={`Ilustração botânica de ${MONTHS[month]}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}

        <div className="month-artwork-frame">
          <span className="month-artwork-edition">ALMANAQUE BOTÂNICO</span>
          <span className="month-artwork-year">{year}</span>
        </div>
      </div>

      <div className="month-paper">
        <div className="month-heading">
          <div className="month-heading-title">
            <h2>{MONTHS[month]}</h2>
            <span className="month-heading-season">{getMonthSeason(month, year)}</span>
          </div>
          <span>{String(month + 1).padStart(2, "0")} / {year}</span>
        </div>

        <div className="month-weekdays">
          {WEEKDAYS.map((weekday, index) => (
            <span key={index}>{weekday}</span>
          ))}
        </div>

        <div className="month-days">
          {days.map((date, index) =>
            date ? (
              <CalendarDay
                key={date.getDate()}
                date={date}
                isToday={
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
                }
                isSelected={
                  selectedDate !== null &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear()
                }
                events={getEventsForDate(date, events, recurringEvents)}
                holidays={holidays[formatDateKey(date)] || []}
                specialDates={getSpecialDatesForDate(date, specialDates)}
                onSelect={onSelectDate}
              />
            ) : (
              <span className="calendar-day-empty" key={`empty-${index}`} />
            )
          )}
        </div>
      </div>
    </article>
  );
}






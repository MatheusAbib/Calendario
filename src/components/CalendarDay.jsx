const CATEGORY_LABELS = {
  personal: "Pessoal",
  work: "Trabalho",
  health: "Saúde",
  leisure: "Lazer"
};

const CATEGORY_ORDER = ["personal", "work", "health", "leisure"];

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full"
});

export default function CalendarDay({
  date,
  isToday,
  isSelected,
  onSelect,
  events = [],
  holidays = [],
  specialDates = []
}) {
  const isNationalHoliday = holidays.some((holiday) => holiday.type === "national");
  const isOptionalHoliday = holidays.some((holiday) => holiday.type === "optional");
  const hasSpecialHoliday = specialDates.some((item) => item.type === "holiday");
  const hasSpecialDate = specialDates.length > 0;

  const categories = CATEGORY_ORDER.filter((category) =>
    events.some((event) => event.category === category)
  );

  if (events.some((event) => !CATEGORY_ORDER.includes(event.category))) {
    categories.push("other");
  }

  const ariaLabel = [
    DATE_FORMATTER.format(date),
    ...holidays.map((holiday) => holiday.name),
    ...specialDates.map((item) => item.name),
    events.length
      ? `${events.length} ${events.length === 1 ? "compromisso" : "compromissos"}`
      : ""
  ].filter(Boolean).join(". ");

  return (
    <button
      type="button"
      className={[
        "calendar-day",
        isToday ? "calendar-day--today" : "",
        isSelected ? "calendar-day--selected" : "",
        isNationalHoliday ? "calendar-day--holiday" : "",
        !isNationalHoliday && isOptionalHoliday ? "calendar-day--optional" : "",
        events.length ? "calendar-day--has-events" : "",
        hasSpecialDate ? "calendar-day--special" : "",
        hasSpecialHoliday ? "calendar-day--special-holiday" : ""
      ].filter(Boolean).join(" ")}
      onClick={() => onSelect(date)}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      title={ariaLabel}
    >
      <span className="calendar-day-number">{date.getDate()}</span>

      {hasSpecialDate && (
        <span className="calendar-day-special-symbol" aria-hidden="true" />
      )}

      {categories.length > 0 && (
        <span className="calendar-day-markers" aria-hidden="true">
          {categories.map((category) => (
            <span
              key={category}
              className={`calendar-day-marker calendar-day-marker--${category}`}
            />
          ))}
        </span>
      )}
    </button>
  );
}



import { useMemo } from "react";
import MonthCard from "./MonthCard";
import { getHolidaysForYear } from "../data/holidays";

export default function YearCalendar({
  year,
  selectedDate,
  onSelectDate,
  events = {},
  recurringEvents = {},
  specialDates = []
}) {
  const holidays = useMemo(() => getHolidaysForYear(year), [year]);

  return (
    <section className="year-calendar" aria-label={`Calendário de ${year}`}>
      {Array.from({ length: 12 }, (_, month) => (
        <MonthCard
          key={`${year}-${month}`}
          year={year}
          month={month}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          events={events}
          recurringEvents={recurringEvents}
          holidays={holidays}
          specialDates={specialDates}
        />
      ))}
    </section>
  );
}


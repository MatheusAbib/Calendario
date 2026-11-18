import BotanicalBackground from "./components/BotanicalBackground";
import WeatherPanel from "./components/WeatherPanel";
import DateConsultant from "./components/DateConsultant";
import CalendarOverview from "./components/CalendarOverview";
import { readSpecialDates } from "./utils/specialDates";
import CalendarLegend from "./components/CalendarLegend";
import { useState } from "react";
import YearNavigation from "./components/YearNavigation";
import YearCalendar from "./components/YearCalendar";
import DayPanel from "./components/DayPanel";
import {
  getEventsForDate,
  normalizeEventsForDate,
  readEvents,
  readRecurringEvents
} from "./utils/events";
import { formatDateKey } from "./utils/dates";
import "./App.css";

function createEventId() {
  return `event_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(readEvents);
  const [recurringEvents, setRecurringEvents] = useState(readRecurringEvents);
  const [specialDates, setSpecialDates] = useState(readSpecialDates);

  const changeYear = (nextYear) => {
    setYear(nextYear);
    setSelectedDate(null);
  };

  const handleSelectDate = (date) => {
    setEvents(readEvents());
    setRecurringEvents(readRecurringEvents());
    setSelectedDate(date);
  };

  const handleClosePanel = () => setSelectedDate(null);

  const updateEventsForSelectedDate = (updater) => {
    if (!selectedDate) return false;

    const dateKey = formatDateKey(selectedDate);
    const currentEvents = readEvents();
    const currentList = normalizeEventsForDate(currentEvents[dateKey]);
    const updatedList = updater(currentList);

    if (!updatedList) return false;

    const updatedEvents = { ...currentEvents };

    if (updatedList.length) {
      updatedEvents[dateKey] = updatedList.map(({ isRecurring, ...event }) => event);
    } else {
      delete updatedEvents[dateKey];
    }

    try {
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveEvent = (eventData, editingId = null) => {
    return updateEventsForSelectedDate((currentList) => {
      if (editingId) {
        if (!currentList.some((event) => event.id === editingId)) return null;

        return currentList.map((event) =>
          event.id === editingId
            ? { ...event, text: eventData.text, category: eventData.category }
            : event
        );
      }

      return [
        ...currentList,
        {
          id: createEventId(),
          text: eventData.text,
          category: eventData.category,
          date: formatDateKey(selectedDate)
        }
      ];
    });
  };

  const handleDeleteEvent = (eventId) => {
    return updateEventsForSelectedDate((currentList) => {
      if (!currentList.some((event) => event.id === eventId)) return null;
      return currentList.filter((event) => event.id !== eventId);
    });
  };

  const handleSaveRecurring = (eventData) => {
    if (!selectedDate) return false;

    const recurringId = createEventId().replace("event_", "recurring_");
    const updated = {
      ...readRecurringEvents(),
      [recurringId]: {
        ...eventData,
        startDate: formatDateKey(selectedDate)
      }
    };

    try {
      localStorage.setItem("recurringEvents", JSON.stringify(updated));
      setRecurringEvents(updated);
      return true;
    } catch {
      return false;
    }
  };

  const handleEditRecurringSeries = (recurringId, eventData) => {
    const current = readRecurringEvents();
    const original = current[recurringId];

    if (!original) return false;

    const updated = {
      ...current,
      [recurringId]: {
        ...original,
        ...eventData,
        daysOfWeek: eventData.type === "weekly" ? eventData.daysOfWeek : undefined,
        monthlyOption: eventData.type === "monthly" ? eventData.monthlyOption : undefined,
        occurrenceCount: eventData.endCondition === "count"
          ? eventData.occurrenceCount
          : undefined,
        endDate: eventData.endCondition === "date"
          ? eventData.endDate
          : undefined
      }
    };

    try {
      localStorage.setItem("recurringEvents", JSON.stringify(updated));
      setRecurringEvents(updated);
      return true;
    } catch {
      return false;
    }
  };

  const handleEditRecurringOccurrence = (recurringId, eventData) => {
    if (!selectedDate) return false;

    const currentRecurring = readRecurringEvents();
    const original = currentRecurring[recurringId];

    if (!original) return false;

    const dateKey = formatDateKey(selectedDate);
    const currentEvents = readEvents();
    const currentList = normalizeEventsForDate(currentEvents[dateKey]);

    const updatedEvents = {
      ...currentEvents,
      [dateKey]: [
        ...currentList,
        {
          id: createEventId(),
          text: eventData.text,
          category: eventData.category,
          date: dateKey,
          originalRecurringId: recurringId,
          isFromRecurring: true
        }
      ]
    };

    const updatedRecurring = {
      ...currentRecurring,
      [recurringId]: {
        ...original,
        excludedDates: [
          ...new Set([...(original.excludedDates || []), dateKey])
        ]
      }
    };

    const previousEventsValue = localStorage.getItem("events");

    try {
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      try {
        localStorage.setItem("recurringEvents", JSON.stringify(updatedRecurring));
      } catch {
        if (previousEventsValue === null) {
          localStorage.removeItem("events");
        } else {
          localStorage.setItem("events", previousEventsValue);
        }
        return false;
      }

      setEvents(updatedEvents);
      setRecurringEvents(updatedRecurring);
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteRecurringOccurrence = (recurringId) => {
    if (!selectedDate) return false;

    const current = readRecurringEvents();
    const original = current[recurringId];

    if (!original) return false;

    const dateKey = formatDateKey(selectedDate);
    const updated = {
      ...current,
      [recurringId]: {
        ...original,
        excludedDates: [
          ...new Set([...(original.excludedDates || []), dateKey])
        ]
      }
    };

    try {
      localStorage.setItem("recurringEvents", JSON.stringify(updated));
      setRecurringEvents(updated);
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteRecurringSeries = (recurringId) => {
    const updated = { ...readRecurringEvents() };

    if (!updated[recurringId]) return false;

    delete updated[recurringId];

    try {
      localStorage.setItem("recurringEvents", JSON.stringify(updated));
      setRecurringEvents(updated);
      return true;
    } catch {
      return false;
    }
  };
  const handleSpecialDatesChange = () => {
    setSpecialDates(readSpecialDates());
  };

  const selectedEvents = selectedDate
    ? getEventsForDate(selectedDate, events, recurringEvents)
    : [];

  return (
    <main className="app">
      <BotanicalBackground />
      <YearNavigation
        year={year}
        onPrevious={() => changeYear(year - 1)}
        onNext={() => changeYear(year + 1)}
        onToday={() => changeYear(new Date().getFullYear())}
      />

      <CalendarOverview />
            <WeatherPanel />
      <div className="calendar-toolbar">
        <div className="calendar-year-controls">
        <span className="calendar-year-controls-label">NAVEGAÇÃO ANUAL</span>

        <div className="year-navigation-actions">
          <button type="button" onClick={() => changeYear(year - 1)} aria-label="Ano anterior">
            <span aria-hidden="true">←</span>
          </button>

          <span className="year-navigation-current">{year}</span>

          <button type="button" onClick={() => changeYear(year + 1)} aria-label="Próximo ano">
            <span aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            className="current-year-button"
            onClick={() => changeYear(new Date().getFullYear())}
          >
            Ano atual
          </button>
        </div>
      </div>
      <CalendarLegend />
      </div>
      <YearCalendar
        year={year}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        events={events}
        recurringEvents={recurringEvents}
        specialDates={specialDates}
      />
      <DateConsultant />

<footer className="calendar-colophon calendar-colophon--ornate">
  <span>Calendário {year}</span>
</footer>

      {selectedDate && (
        <DayPanel
          date={selectedDate}
          events={selectedEvents}
          onClose={handleClosePanel}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onSaveRecurring={handleSaveRecurring}
          onEditRecurringSeries={handleEditRecurringSeries}
          onEditRecurringOccurrence={handleEditRecurringOccurrence}
          onDeleteRecurringOccurrence={handleDeleteRecurringOccurrence}
          onDeleteRecurringSeries={handleDeleteRecurringSeries} specialDates={specialDates} onSpecialDatesChange={handleSpecialDatesChange}
        />
      )}
    </main>
  );
}















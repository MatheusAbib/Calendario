import SpecialDatesSection from "./SpecialDatesSection";
import { getHolidaysForDate } from "../data/holidays";
import { useEffect, useState } from "react";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const CATEGORIES = [
  { value: "personal", label: "Pessoal" },
  { value: "work", label: "Trabalho" },
  { value: "health", label: "Saúde" },
  { value: "leisure", label: "Lazer" }
];

const WEEKDAYS = [
  { value: "0", label: "Dom" },
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" }
];

function toInputDate(value) {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length !== 3) return "";
  return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
}

export default function DayPanel({
  date,
  events,
  onClose,
  onSave,
  onDelete,
  onSaveRecurring,
  onEditRecurringSeries,
  onEditRecurringOccurrence,
  onDeleteRecurringOccurrence,
  onDeleteRecurringSeries,
  specialDates = [],
  onSpecialDatesChange
}) {
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingRecurringId, setEditingRecurringId] = useState(null);
  const [editingScope, setEditingScope] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingRecurringId, setDeletingRecurringId] = useState(null);
  const [deletingRecurringScope, setDeletingRecurringScope] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("personal");
  const [error, setError] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("weekly");
  const [weekdays, setWeekdays] = useState([String(date.getDay())]);
  const [monthlyOption, setMonthlyOption] = useState("same-day");
  const [endCondition, setEndCondition] = useState("never");
  const [occurrenceCount, setOccurrenceCount] = useState(10);
  const [endDate, setEndDate] = useState("");
  const [seriesStartDate, setSeriesStartDate] = useState("");

  const isManaging = Boolean(
    formMode || deletingId || deletingRecurringId || editingRecurringId
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (formMode || editingRecurringId || deletingId || deletingRecurringId) {
        cancelAll();
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const resetForm = () => {
    setDescription("");
    setCategory("personal");
    setError("");
    setIsRecurring(false);
    setRecurrenceType("weekly");
    setWeekdays([String(date.getDay())]);
    setMonthlyOption("same-day");
    setEndCondition("never");
    setOccurrenceCount(10);
    setEndDate("");
    setSeriesStartDate("");
  };

  const cancelAll = () => {
    setFormMode(null);
    setEditingId(null);
    setEditingRecurringId(null);
    setEditingScope(null);
    setDeletingId(null);
    setDeletingRecurringId(null);
    setDeletingRecurringScope(null);
    resetForm();
  };

  const openCreateForm = () => {
    cancelAll();
    setFormMode("create");
  };

  const openEditRegular = (event) => {
    cancelAll();
    setDescription(event.text || "");
    setCategory(event.category || "personal");
    setEditingId(event.id);
    setFormMode("edit");
  };

  const chooseRecurringEdit = (event) => {
    cancelAll();
    setEditingRecurringId(event.originalId);
    setDescription(event.text || "");
    setCategory(event.category || "personal");
    setRecurrenceType(event.type || "weekly");
    setWeekdays(
      event.daysOfWeek?.length
        ? event.daysOfWeek.map(String)
        : [String(date.getDay())]
    );
    setMonthlyOption(event.monthlyOption || "same-day");
    setEndCondition(event.endCondition || "never");
    setOccurrenceCount(event.occurrenceCount || 10);
    setEndDate(toInputDate(event.endDate));
    setSeriesStartDate(toInputDate(event.startDate));
  };

  const toggleWeekday = (value) => {
    setWeekdays((current) =>
      current.includes(value)
        ? current.filter((day) => day !== value)
        : [...current, value]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Informe a descrição do compromisso.");
      return;
    }

    const editingSeries = editingScope === "series";
    const creatingRecurring = formMode === "create" && isRecurring;
    const needsRecurrence = editingSeries || creatingRecurring;

    if (needsRecurrence && recurrenceType === "weekly" && !weekdays.length) {
      setError("Selecione pelo menos um dia da semana.");
      return;
    }

    if (
      needsRecurrence &&
      endCondition === "count" &&
      (!Number.isInteger(Number(occurrenceCount)) ||
        Number(occurrenceCount) < 1 ||
        Number(occurrenceCount) > 10000)
    ) {
      setError("Informe uma quantidade entre 1 e 10000.");
      return;
    }

    const startDate = editingSeries
      ? seriesStartDate
      : [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0")
        ].join("-");

    if (needsRecurrence && endCondition === "date" && (!endDate || endDate < startDate)) {
      setError("A data de término deve ser igual ou posterior à data inicial.");
      return;
    }

    const eventData = {
      text: description.trim(),
      category
    };

    const recurrenceData = {
      ...eventData,
      type: recurrenceType,
      endCondition,
      ...(recurrenceType === "weekly" ? { daysOfWeek: weekdays } : {}),
      ...(recurrenceType === "monthly" ? { monthlyOption } : {}),
      ...(endCondition === "count" ? { occurrenceCount: Number(occurrenceCount) } : {}),
      ...(endCondition === "date" ? { endDate } : {})
    };

    let saved = false;

    if (editingScope === "occurrence") {
      saved = onEditRecurringOccurrence(editingRecurringId, eventData);
    } else if (editingSeries) {
      saved = onEditRecurringSeries(editingRecurringId, recurrenceData);
    } else if (creatingRecurring) {
      saved = onSaveRecurring(recurrenceData);
    } else {
      saved = onSave(eventData, formMode === "edit" ? editingId : null);
    }

    if (saved) {
      cancelAll();
    } else {
      setError("Não foi possível salvar as alterações.");
    }
  };

  const handleDelete = (id, recurring, scope) => {
    const deleted = recurring
      ? scope === "occurrence"
        ? onDeleteRecurringOccurrence(id)
        : onDeleteRecurringSeries(id)
      : onDelete(id);

    if (deleted) {
      cancelAll();
    } else {
      setError("Não foi possível excluir o compromisso.");
    }
  };

  return (
    <div
      className="day-panel-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="day-panel" role="dialog" aria-modal="true" aria-labelledby="day-panel-title">
        <header className="day-panel-header">
          <div className="day-panel-heading">
            <span className="day-panel-eyebrow">REGISTRO DO ALMANAQUE</span>
            <h2 id="day-panel-title">{DATE_FORMATTER.format(date)}</h2>
          </div>
          <button type="button" className="day-panel-close" onClick={onClose} aria-label="Fechar painel">×</button>
        </header>

        <div className="day-panel-body">
          {getHolidaysForDate(date).length > 0 && (
            <div className="day-panel-holidays">
              <span className="day-panel-holidays-label">EFEMÉRIDES DO DIA</span>
              {getHolidaysForDate(date).map((holiday, index) => (
                <div className="day-panel-holiday" key={`${holiday.name}-${index}`}>
                  <strong>{holiday.name}</strong>
                  <span>
                    {holiday.type === "national"
                      ? "Feriado nacional"
                      : holiday.type === "optional"
                        ? "Ponto facultativo federal"
                        : "Data comemorativa"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <SpecialDatesSection
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
            date={date}
            specialDates={specialDates}
            onSpecialDatesChange={onSpecialDatesChange}
          />
          <div className="day-panel-section-heading">
            <h3>Compromissos</h3>
            <span>{events.length} {events.length === 1 ? "registro" : "registros"}</span>
          </div>

          {events.length === 0 ? (
            <div className="day-panel-empty">
              <p>Nenhum compromisso registrado para esta data.</p>
            </div>
          ) : (
            <ul className="day-panel-events">
              {events.map((item, index) => (
                <li
                  className={`day-panel-event day-panel-event--managed day-panel-event--${item.category || "personal"}`}
                  key={item.isRecurring ? `recurring-${item.originalId}` : item.id}
                >
                  <div className="day-panel-event-main">
                    <span className="day-panel-event-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="day-panel-event-content">
                      <strong>{item.text || "Compromisso sem descrição"}</strong>
                      <span className={`day-panel-event-category day-panel-event-category--${item.category || "personal"}`}>
                        {CATEGORIES.find((categoryItem) => categoryItem.value === item.category)?.label || item.category || "Sem categoria"}
                      </span>
                    </div>
                  </div>

                  {item.isRecurring && <span className="day-panel-recurring">Recorrente</span>}

                  <div className="day-panel-item-actions">
                    <button
                      type="button"
                      disabled={isManaging}
                      onClick={() => item.isRecurring ? chooseRecurringEdit(item) : openEditRegular(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="day-panel-item-delete"
                      disabled={isManaging}
                      onClick={() => {
                        setError("");
                        if (item.isRecurring) {
                          setDeletingRecurringId(item.originalId);
                        } else {
                          setDeletingId(item.id);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>

                  {editingRecurringId === item.originalId && item.isRecurring && !editingScope && (
                    <div className="day-panel-inline-confirmation">
                      <p>O que deseja editar?</p>
                      <div className="day-panel-recurring-delete-actions">
                        <button type="button" onClick={() => setEditingScope("occurrence")}>
                          Somente esta ocorrência
                        </button>
                        <button type="button" onClick={() => setEditingScope("series")}>
                          Toda a série
                        </button>
                        <button type="button" className="day-panel-cancel" onClick={cancelAll}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {deletingId === item.id && !item.isRecurring && (
                    <div className="day-panel-inline-confirmation">
                      <p>Deseja excluir este compromisso?</p>
                      {error && <p className="day-panel-error" role="alert">{error}</p>}
                      <div className="day-panel-form-actions">
                        <button type="button" className="day-panel-cancel" onClick={cancelAll}>Cancelar</button>
                        <button type="button" className="day-panel-confirm-delete" onClick={() => handleDelete(item.id, false)}>
                          Confirmar exclusão
                        </button>
                      </div>
                    </div>
                  )}

                  {deletingRecurringId === item.originalId && item.isRecurring && (
                     <div className="day-panel-inline-confirmation">
                       <p>Como deseja excluir este compromisso recorrente?</p>

                       <div className="day-panel-recurring-delete-actions">
                         <button
                           type="button"
                           className={deletingRecurringScope === "occurrence" ? "is-selected" : ""}
                           aria-pressed={deletingRecurringScope === "occurrence"}
                           onClick={() => {
                             setDeletingRecurringScope("occurrence");
                             setError("");
                           }}
                         >
                           Somente esta ocorrência
                         </button>

                         <button
                           type="button"
                           className={deletingRecurringScope === "series" ? "is-selected" : ""}
                           aria-pressed={deletingRecurringScope === "series"}
                           onClick={() => {
                             setDeletingRecurringScope("series");
                             setError("");
                           }}
                         >
                           Toda a série
                         </button>
                       </div>

                       {deletingRecurringScope && (
                         <div className="day-panel-recurring-delete-confirmation">
                           <p>
                             {deletingRecurringScope === "occurrence"
                               ? "Deseja excluir somente este compromisso nesta data? As demais ocorrências serão mantidas."
                               : "Deseja excluir toda a série recorrente? Todas as ocorrências serão removidas."}
                           </p>

                           {error && <p className="day-panel-error" role="alert">{error}</p>}

                           <div className="day-panel-form-actions">
                             <button type="button" className="day-panel-cancel" onClick={cancelAll}>
                               Cancelar
                             </button>
                             <button
                               type="button"
                               className="day-panel-confirm-delete"
                               onClick={() => handleDelete(item.originalId, true, deletingRecurringScope)}
                             >
                               Confirmar exclusão
                             </button>
                           </div>
                         </div>
                       )}

                       {!deletingRecurringScope && (
                         <button type="button" className="day-panel-cancel" onClick={cancelAll}>
                           Cancelar
                         </button>
                       )}
                     </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {!isManaging && (
            <button type="button" className="day-panel-add" onClick={openCreateForm}>
              + Adicionar compromisso
            </button>
          )}

          {(formMode || editingScope) && (
            <form className="day-panel-form" onSubmit={handleSubmit}>
              <h3>
                {editingScope === "series"
                  ? "Editar série recorrente"
                  : editingScope === "occurrence"
                    ? "Editar esta ocorrência"
                    : formMode === "edit"
                      ? "Editar compromisso"
                      : "Novo compromisso"}
              </h3>

              <label htmlFor="day-panel-description">Descrição</label>
              <input
                id="day-panel-description"
                type="text"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setError("");
                }}
                placeholder="Ex.: Reunião com equipe"
                maxLength={200}
                autoFocus
              />

              <fieldset className="day-panel-categories">
                <legend>Categoria</legend>
                <div className="day-panel-category-options">
                  {CATEGORIES.map((item) => (
                    <label
                      key={item.value}
                      className={`day-panel-category-option day-panel-category-option--${item.value} ${category === item.value ? "is-active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="event-category"
                        value={item.value}
                        checked={category === item.value}
                        onChange={() => setCategory(item.value)}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {formMode === "create" && (
                <div className="day-panel-recurrence">
                  <label className="day-panel-recurrence-toggle">
                    <input type="checkbox" checked={isRecurring} onChange={(event) => setIsRecurring(event.target.checked)} />
                    <span>Repetir este compromisso</span>
                  </label>
                </div>
              )}

              {((formMode === "create" && isRecurring) || editingScope === "series") && (
                <div className="day-panel-recurrence-fields">
                  <label htmlFor="recurrence-type">Frequência</label>
                  <select id="recurrence-type" value={recurrenceType} onChange={(event) => setRecurrenceType(event.target.value)}>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                    <option value="yearly">Anualmente</option>
                  </select>

                  {recurrenceType === "weekly" && (
                    <fieldset className="day-panel-weekdays">
                      <legend>Dias da semana</legend>
                      <div className="day-panel-weekday-options">
                        {WEEKDAYS.map((dayItem) => (
                          <label key={dayItem.value} className={weekdays.includes(dayItem.value) ? "is-active" : ""}>
                            <input
                              type="checkbox"
                              checked={weekdays.includes(dayItem.value)}
                              onChange={() => toggleWeekday(dayItem.value)}
                            />
                            <span>{dayItem.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {recurrenceType === "monthly" && (
                    <>
                      <label htmlFor="monthly-option">Repetir</label>
                      <select id="monthly-option" value={monthlyOption} onChange={(event) => setMonthlyOption(event.target.value)}>
                        <option value="same-day">No mesmo dia do mês</option>
                        <option value="same-weekday">Na mesma posição da semana</option>
                      </select>
                    </>
                  )}

                  <label htmlFor="recurrence-end">Término da repetição</label>
                  <select id="recurrence-end" value={endCondition} onChange={(event) => setEndCondition(event.target.value)}>
                    <option value="never">Sem término</option>
                    <option value="count">Após um número de ocorrências</option>
                    <option value="date">Em uma data específica</option>
                  </select>

                  {endCondition === "count" && (
                    <>
                      <label htmlFor="recurrence-count">Quantidade de ocorrências</label>
                      <input
                        id="recurrence-count"
                        type="number"
                        min="1"
                        max="10000"
                        value={occurrenceCount}
                        onChange={(event) => setOccurrenceCount(event.target.value)}
                      />
                    </>
                  )}

                  {endCondition === "date" && (
                    <>
                      <label htmlFor="recurrence-end-date">Data de término</label>
                      <input
                        id="recurrence-end-date"
                        type="date"
                        min={editingScope === "series" ? seriesStartDate : toInputDate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)}
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                      />
                    </>
                  )}
                </div>
              )}

              {error && <p className="day-panel-error" role="alert">{error}</p>}

              <div className="day-panel-form-actions">
                <button type="button" className="day-panel-cancel" onClick={cancelAll}>Cancelar</button>
                <button type="submit" className={`day-panel-save day-panel-save--${category}`}>
                  {formMode === "create" ? "Salvar compromisso" : "Salvar alterações"}
                </button>
              </div>
            </form>
          )}
        </div>

        <footer className="day-panel-footer">
          <span>CALENDÁRIO BOTÂNICO</span>
          <button type="button" onClick={onClose}>Fechar registro</button>
        </footer>
      </section>
    </div>
  );
}





import { useState } from "react";
import { formatDateKey } from "../utils/dates";
import {
  createSpecialDate,
  updateSpecialDate,
  deleteSpecialDate,
  getSpecialDatesForDate
} from "../utils/specialDates";

const TYPES = [
  { value: "commemorative", label: "Data comemorativa" },
  { value: "holiday", label: "Feriado personalizado" }
];

function toInputDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function SpecialDatesSection({
  date,
  specialDates = [],
  onSpecialDatesChange
}) {
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("commemorative");
  const [recurring, setRecurring] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  const visibleDates = getSpecialDatesForDate(date, specialDates);
  const isManaging = mode !== null || deletingId !== null;

  const reset = () => {
    setMode(null);
    setEditingId(null);
    setDeletingId(null);
    setName("");
    setType("commemorative");
    setRecurring(true);
    setSelectedDate("");
    setError("");
  };

  const startCreate = () => {
    reset();
    setSelectedDate(toInputDate(formatDateKey(date)));
    setMode("create");
  };

  const startEdit = (item) => {
    reset();
    setEditingId(item.id);
    setName(item.name);
    setType(item.type);
    setRecurring(Boolean(item.recurring));
    setSelectedDate(toInputDate(item.date));
    setMode("edit");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Informe o nome da data especial.");
      return;
    }

    if (!selectedDate) {
      setError("Selecione uma data válida.");
      return;
    }

    const data = {
      name: trimmedName,
      type,
      recurring,
      date: selectedDate
    };

    const saved = mode === "edit"
      ? updateSpecialDate(editingId, data)
      : createSpecialDate(data);

    if (!saved) {
      setError("Não foi possível salvar a data especial.");
      return;
    }

    onSpecialDatesChange();
    reset();
  };

  const handleDelete = (id) => {
    if (!deleteSpecialDate(id)) {
      setError("Não foi possível excluir a data especial.");
      return;
    }

    onSpecialDatesChange();
    reset();
  };

  return (
    <section className="special-dates-section" aria-label="Datas especiais">
      <div className="day-panel-section-heading">
        <h3>Datas especiais</h3>
        <span>
          {visibleDates.length} {visibleDates.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {visibleDates.length === 0 && !mode && (
        <p className="special-dates-empty">
          Nenhuma data especial personalizada para este dia.
        </p>
      )}

      {visibleDates.length > 0 && (
        <ul className="special-dates-list">
          {visibleDates.map((item) => (
            <li className="special-date-item" key={item.id}>
              <span
                className={`special-date-indicator special-date-indicator--${item.type}`}
                aria-hidden="true"
              />

              <div className="special-date-information">
                <strong>{item.name}</strong>
                <span>
                  {item.type === "holiday"
                    ? "Feriado personalizado"
                    : "Data comemorativa"}
                  {item.recurring ? " · Repete anualmente" : ""}
                </span>
              </div>

              {!isManaging && (
                <div className="special-date-actions">
                  <button type="button" onClick={() => startEdit(item)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="special-date-delete"
                    onClick={() => {
                      setError("");
                      setDeletingId(item.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              )}

              {deletingId === item.id && (
                <div className="special-date-confirmation">
                  <p>Deseja excluir esta data especial?</p>
                  {error && <p className="day-panel-error" role="alert">{error}</p>}
                  <div className="day-panel-form-actions">
                    <button type="button" className="day-panel-cancel" onClick={reset}>
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="day-panel-confirm-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Confirmar exclusão
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isManaging && (
        <button type="button" className="special-dates-add" onClick={startCreate}>
          + Adicionar data especial
        </button>
      )}

      {mode && (
        <form className="special-dates-form" onSubmit={handleSubmit}>
          <h4>{mode === "edit" ? "Editar data especial" : "Nova data especial"}</h4>

          <label htmlFor="special-date-name">Nome da data</label>
          <input
            id="special-date-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            maxLength={120}
            placeholder="Ex.: Aniversário da família"
            required
            autoFocus
          />

          <label htmlFor="special-date-date">Data</label>
          <input
            id="special-date-date"
            type="date"
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.target.value);
              setError("");
            }}
            required
          />

          <label htmlFor="special-date-type">Tipo de marcação</label>
          <select
            id="special-date-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {TYPES.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="special-dates-repeat">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(event) => setRecurring(event.target.checked)}
            />
            <span>Repetir todos os anos</span>
          </label>

          {error && <p className="day-panel-error" role="alert">{error}</p>}

          <div className="day-panel-form-actions">
            <button type="button" className="day-panel-cancel" onClick={reset}>
              Cancelar
            </button>
            <button type="submit" className="day-panel-save">
              {mode === "edit" ? "Salvar alterações" : "Salvar data especial"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

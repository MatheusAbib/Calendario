const LEGEND_ITEMS = [
  { label: "Feriado nacional", type: "holiday" },
  { label: "Ponto facultativo", type: "optional" },
  { label: "Data personalizada", type: "special" },
  { label: "Pessoal", type: "personal" },
  { label: "Trabalho", type: "work" },
  { label: "Saúde", type: "health" },
  { label: "Lazer", type: "leisure" }
];

export default function CalendarLegend() {
  return (
    <aside className="calendar-legend" aria-label="Legenda do calendário">
      <div className="calendar-legend-heading">
        <span className="calendar-legend-title">LEGENDA</span>
        <span className="calendar-legend-subtitle">Guia de marcações</span>
      </div>

      <div className="calendar-legend-items">
        {LEGEND_ITEMS.map((item) => (
          <div className="calendar-legend-item" key={item.type}>
            <span
              className={`calendar-legend-symbol calendar-legend-symbol--${item.type}`}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}




import { useEffect, useState } from "react";

const TIME_ZONES = [
  { label: "Brasília", zone: "America/Sao_Paulo" },
  { label: "Manaus", zone: "America/Manaus" },
  { label: "Fortaleza", zone: "America/Fortaleza" },
  { label: "Recife", zone: "America/Recife" },
  { label: "Bahia", zone: "America/Bahia" },
  { label: "Belém", zone: "America/Belem" },
  { label: "Cuiabá", zone: "America/Cuiaba" },
  { label: "Campo Grande", zone: "America/Campo_Grande" },
  { label: "Porto Velho", zone: "America/Porto_Velho" },
  { label: "Acre", zone: "America/Rio_Branco" },
  { label: "Santarém", zone: "America/Santarem" },
  { label: "Maceió", zone: "America/Maceio" },
  { label: "Fernando de Noronha", zone: "America/Noronha" },
  { label: "Boa Vista", zone: "America/Boa_Vista" },
  { label: "Palmas", zone: "America/Araguaina" }
];

function getClockParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );

  return {
    hours: Number(values.hour),
    minutes: Number(values.minute),
    seconds: Number(values.second),
    digital: `${values.hour}:${values.minute}:${values.second}`
  };
}

export default function BotanicalClock() {
  const [now, setNow] = useState(() => new Date());
  const [timeZone, setTimeZone] = useState("America/Sao_Paulo");

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const clock = getClockParts(now, timeZone);
  const selected = TIME_ZONES.find((item) => item.zone === timeZone);

  const hourAngle = (clock.hours % 12) * 30 + clock.minutes * 0.5;
  const minuteAngle = clock.minutes * 6 + clock.seconds * 0.1;
  const secondAngle = clock.seconds * 6;

  return (
    <div className="botanical-clock">
      <div
        className="botanical-clock-face"
        role="img"
        aria-label={`Relógio marcando ${clock.digital}, horário de ${selected?.label}`}
      >
        <div className="botanical-clock-inner">
          {[...Array(12)].map((_, index) => (
            <span
              className="botanical-clock-tick"
              key={index}
              style={{ transform: `rotate(${index * 30}deg)` }}
            />
          ))}

          <span className="botanical-clock-number botanical-clock-number--12">12</span>
          <span className="botanical-clock-number botanical-clock-number--3">3</span>
          <span className="botanical-clock-number botanical-clock-number--6">6</span>
          <span className="botanical-clock-number botanical-clock-number--9">9</span>

          <span className="botanical-clock-brand">TEMPO</span>

          <span
            className="botanical-clock-hand botanical-clock-hand--hour"
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <span
            className="botanical-clock-hand botanical-clock-hand--minute"
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
          <span
            className="botanical-clock-hand botanical-clock-hand--second"
            style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }}
          />
          <span className="botanical-clock-center" />
        </div>
      </div>

      <div className="botanical-clock-info">
        <span className="botanical-clock-label">HORÁRIO BRASILEIRO</span>
        <time className="botanical-clock-digital">{clock.digital}</time>

        <label className="botanical-clock-select-label" htmlFor="botanical-clock-timezone">
          Fuso horário
        </label>

        <select
          id="botanical-clock-timezone"
          className="botanical-clock-select"
          value={timeZone}
          onChange={(event) => setTimeZone(event.target.value)}
        >
          {TIME_ZONES.map((item) => (
            <option key={item.label} value={item.zone}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

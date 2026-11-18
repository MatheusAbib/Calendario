import { useEffect, useState } from "react";

const INITIAL_CITY = {
  name: "São Paulo",
  admin1: "São Paulo",
  country: "Brasil",
  latitude: -23.5505,
  longitude: -46.6333,
  timezone: "America/Sao_Paulo"
};

const WEATHER_CODES = {
  0: "Céu limpo",
  1: "Predominantemente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com geada",
  51: "Garoa fraca",
  53: "Garoa moderada",
  55: "Garoa intensa",
  56: "Garoa congelante",
  57: "Garoa congelante intensa",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva forte",
  66: "Chuva congelante",
  67: "Chuva congelante forte",
  71: "Neve fraca",
  73: "Neve moderada",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva fracas",
  81: "Pancadas de chuva moderadas",
  82: "Pancadas de chuva fortes",
  85: "Pancadas de neve",
  86: "Pancadas de neve fortes",
  95: "Trovoadas",
  96: "Trovoadas com granizo",
  99: "Trovoadas com granizo forte"
};

function getWeatherDescription(code) {
  return WEATHER_CODES[code] || "Condição não identificada";
}

function getWeatherSymbol(code, isDay) {
  if (code === 0) return isDay ? "☀" : "☾";
  if (code <= 2) return isDay ? "☀" : "☾";
  if (code === 3) return "☁";
  if (code === 45 || code === 48) return "≋";
  if (code >= 51 && code <= 67) return "☂";
  if (code >= 71 && code <= 86) return "❄";
  if (code >= 95) return "ϟ";
  return "☁";
}

function readSavedCity() {
  try {
    const saved = JSON.parse(localStorage.getItem("botanicalWeatherCity"));

    if (
      saved &&
      typeof saved.name === "string" &&
      Number.isFinite(saved.latitude) &&
      Number.isFinite(saved.longitude) &&
      typeof saved.timezone === "string"
    ) {
      return saved;
    }
  } catch {}

  return INITIAL_CITY;
}

function formatLocation(city) {
  return [city.name, city.admin1, city.country]
    .filter(Boolean)
    .filter((part, index, array) => array.indexOf(part) === index)
    .join(", ");
}

function formatUpdatedTime(value, timezone) {
  if (!value) return "Horário indisponível";

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);

  if (!match) return "Horário indisponível";

  return `${match[4]}:${match[5]} · ${timezone.replaceAll("_", " ")}`;
}

export default function WeatherPanel() {
  const [city, setCity] = useState(readSavedCity);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          latitude: String(city.latitude),
          longitude: String(city.longitude),
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m",
            "is_day"
          ].join(","),
          timezone: city.timezone,
          wind_speed_unit: "kmh"
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Falha na consulta");

        const data = await response.json();

        if (!data.current) throw new Error("Dados indisponíveis");

        setWeather(data.current);
        setUpdatedAt(new Date());
      } catch (err) {
        if (err.name !== "AbortError") {
          setWeather(null);
          setError("Não foi possível consultar o clima desta cidade.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWeather();

    const interval = window.setInterval(loadWeather, 600000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [city]);

  async function searchCities(event) {
    event.preventDefault();

    const term = query.trim();

    if (term.length < 2) {
      setSearchError("Digite pelo menos duas letras.");
      return;
    }

    setSearching(true);
    setSearchError("");
    setResults([]);

    try {
      const params = new URLSearchParams({
        name: term,
        countryCode: "BR",
        count: "8",
        language: "pt",
        format: "json"
      });

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params}`
      );

      if (!response.ok) throw new Error("Falha na pesquisa");

      const data = await response.json();
      const cities = (data.results || []).filter((item) => item.country_code === "BR");

      setResults(cities);

      if (!cities.length) {
        setSearchError("Nenhuma cidade encontrada.");
      }
    } catch {
      setSearchError("Não foi possível pesquisar cidades.");
    } finally {
      setSearching(false);
    }
  }

  function selectCity(result) {
    const nextCity = {
      name: result.name,
      admin1: result.admin1 || "",
      country: result.country || "",
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone || "auto"
    };

    setCity(nextCity);
    setResults([]);
    setQuery("");

    try {
      localStorage.setItem(
        "botanicalWeatherCity",
        JSON.stringify(nextCity)
      );
    } catch {}
  }

  return (
    <section className="weather-panel" aria-labelledby="weather-panel-title">
      <div className="weather-panel-heading">
        <div>
          <span className="weather-panel-eyebrow">OBSERVATÓRIO METEOROLÓGICO</span>
          <h2 id="weather-panel-title">O tempo lá fora</h2>
          <p>Condições meteorológicas atuais da cidade escolhida.</p>
        </div>

        <span className="weather-panel-live">TEMPO ATUAL</span>
      </div>

      <div className="weather-panel-layout">
        <div className="weather-panel-current">
          <span className="weather-panel-city-label">LOCALIDADE</span>
          <h3>{formatLocation(city)}</h3>

          {loading && !weather ? (
            <p className="weather-panel-message">Consultando o tempo...</p>
          ) : error ? (
            <p className="weather-panel-message" role="alert">{error}</p>
          ) : weather ? (
            <>
              <div className="weather-panel-main">
                <span className="weather-panel-symbol" aria-hidden="true">
                  {getWeatherSymbol(weather.weather_code, weather.is_day)}
                </span>

                <strong className="weather-panel-temperature">
                  {Math.round(weather.temperature_2m)}°
                </strong>

                <div className="weather-panel-condition">
                  <span>CELSIUS</span>
                  <strong>{getWeatherDescription(weather.weather_code)}</strong>
                </div>
              </div>

              <div className="weather-panel-metrics">
                <div>
                  <span>SENSAÇÃO TÉRMICA</span>
                  <strong>{Math.round(weather.apparent_temperature)}°C</strong>
                </div>

                <div>
                  <span>UMIDADE</span>
                  <strong>{Math.round(weather.relative_humidity_2m)}%</strong>
                </div>

                <div>
                  <span>VENTO</span>
                  <strong>{Math.round(weather.wind_speed_10m)} km/h</strong>
                </div>
              </div>

              <span className="weather-panel-updated">
                Dados de {formatUpdatedTime(weather.time, city.timezone)}
                {updatedAt && loading ? " · Atualizando..." : ""}
              </span>
            </>
          ) : null}
        </div>

        <div className="weather-panel-search">
          <span className="weather-panel-city-label">CONSULTAR OUTRA CIDADE</span>
          <h3>Onde deseja consultar?</h3>
          <p>Pesquise uma cidade para consultar as condições meteorológicas locais.</p>

          <form onSubmit={searchCities}>
            <label htmlFor="weather-city-search">Nome da cidade</label>

            <div className="weather-panel-search-row">
              <input
                id="weather-city-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setResults([]);
                  setSearchError("");
                }}
                placeholder="Ex.: Rio de Janeiro"
              />

              <button type="submit" disabled={searching}>
                {searching ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </form>

          {searchError && (
            <p className="weather-panel-search-error" role="status">
              {searchError}
            </p>
          )}

          {results.length > 0 && (
            <div className="weather-panel-results">
              <span>SELECIONE UMA LOCALIDADE</span>

              {results.map((result) => (
                <button
                  type="button"
                  key={result.id}
                  onClick={() => selectCity(result)}
                >
                  {formatLocation(result)}
                </button>
              ))}
            </div>
          )}

          <span className="weather-panel-source">
            Dados meteorológicos fornecidos por Open-Meteo.
          </span>
        </div>
      </div>
    </section>
  );
}


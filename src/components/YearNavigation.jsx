import { MONTHS } from "../data/calendar";
import BotanicalClock from "./BotanicalClock";

export default function YearNavigation({ year }) {
  return (
    <div className="year-navigation year-navigation--with-clock year-navigation--clock-only">
      <div className="year-navigation-heading">
        <span className="edition-label">EDIÇÃO ANUAL</span>
        <h1>Calendário <span>{year}</span></h1>
        
      </div>

      <BotanicalClock />
    </div>
  );
}



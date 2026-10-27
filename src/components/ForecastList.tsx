import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-list-title">
      <h2 id="forecast-list-title" className="sr-only">
        Previsão de 5 dias
      </h2>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {days.map((day) => (
          <li key={day.localDate} className="min-w-0">
            <ForecastCard day={day} unit={unit} />
          </li>
        ))}
      </ol>
    </section>
  );
}

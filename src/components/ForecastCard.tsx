import { formatDayLabel } from '../lib/format';
import { toDisplayTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const probabilityFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

function formatTemperature(valueCelsius: number | null, unit: Unit): string {
  const value = toDisplayTemperature(valueCelsius, unit);
  if (value === null) return 'Indisponível';

  const unitLabel = unit === 'celsius' ? '°C' : '°F';
  return `${numberFormatter.format(value)} ${unitLabel}`;
}

function formatRainProbability(value: number | null): string {
  if (value === null) return 'Indisponível';
  return `${probabilityFormatter.format(value)}%`;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const dayLabel = formatDayLabel(day.localDate);

  return (
    <article
      aria-label={`Previsão: ${dayLabel}`}
      className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
    >
      <header className="flex items-start justify-between gap-2">
        <time dateTime={day.localDate} className="text-sm font-semibold text-white">
          {dayLabel}
        </time>
        <span aria-hidden="true" className="text-3xl leading-none">
          {getWeatherIcon(day.condition?.code ?? null)}
        </span>
      </header>

      <p className="mt-2 min-h-10 text-sm text-white/70">
        {day.condition?.labelPtBr ?? 'Condição indisponível'}
      </p>

      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 pt-4">
        <div>
          <dt className="text-xs text-white/55">Máx.</dt>
          <dd className="mt-1 text-sm font-semibold text-white">
            {formatTemperature(day.temperatureMaxCelsius, unit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-white/55">Mín.</dt>
          <dd className="mt-1 text-sm font-semibold text-white">
            {formatTemperature(day.temperatureMinCelsius, unit)}
          </dd>
        </div>
        <div className="col-span-2 border-t border-white/10 pt-2">
          <dt className="text-xs text-white/55">Chuva</dt>
          <dd className="mt-1 text-sm font-medium text-white">
            {formatRainProbability(day.precipitationProbabilityPercent)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

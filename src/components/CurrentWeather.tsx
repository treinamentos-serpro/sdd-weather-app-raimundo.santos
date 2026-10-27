import { toDisplayTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function formatMetric(value: number | null, unit: string): string {
  if (value === null) return 'Indisponível';
  return `${numberFormatter.format(value)} ${unit}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const displayTemperature = toDisplayTemperature(current.temperatureCelsius, unit);
  const temperatureUnit = unit === 'celsius' ? '°C' : '°F';
  const locationDetails = [city.admin1, city.country].filter(Boolean).join(', ');
  const metrics = [
    { label: 'Umidade', value: formatMetric(current.humidityPercent, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-lg border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-5xl leading-none sm:text-6xl">
            {getWeatherIcon(current.condition?.code ?? null)}
          </span>
          <div>
            <p className="text-sm font-medium text-white/60">Clima atual</p>
            <h2 id="current-weather-title" className="text-2xl font-semibold text-white">
              {city.name}
            </h2>
            {locationDetails && <p className="text-sm text-white/60">{locationDetails}</p>}
            <p className="mt-1 text-sm text-white/80">
              {current.condition?.labelPtBr ?? 'Condição indisponível'}
            </p>
          </div>
        </div>

        <p className="flex items-start text-6xl font-semibold leading-none text-white">
          {displayTemperature === null ? (
            <span className="text-3xl">Indisponível</span>
          ) : (
            <>
              <span>{numberFormatter.format(displayTemperature)}</span>
              <span className="ml-1 text-3xl text-white/70">{temperatureUnit}</span>
            </>
          )}
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-md border border-white/10 bg-night-800/70 p-4">
            <dt className="text-sm text-white/60">{metric.label}</dt>
            <dd className="mt-1 text-lg font-medium text-white">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

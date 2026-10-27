import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weatherData';
import type { Unit, WeatherData } from './types/weather';

type ContentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData };

const SEARCH_DELAY_MS = 250;

function normalizeSearch(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function matchesMockCity(query: string): boolean {
  const normalizedQuery = normalizeSearch(query);
  const searchableFields = [
    mockWeatherData.city.name,
    mockWeatherData.city.admin1,
    mockWeatherData.city.country,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearch);

  return searchableFields.some(
    (field) => field.includes(normalizedQuery) || normalizedQuery.includes(field),
  );
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [content, setContent] = useState<ContentState>({ status: 'idle' });
  const [lastSearch, setLastSearch] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    return () => {
      requestId.current += 1;
    };
  }, []);

  async function searchMockCity(city: string) {
    const activeRequest = ++requestId.current;
    setLastSearch(city);
    setContent({ status: 'loading' });

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, SEARCH_DELAY_MS);
      });

      if (activeRequest !== requestId.current) return;

      setContent(
        matchesMockCity(city) ? { status: 'success', data: mockWeatherData } : { status: 'empty' },
      );
    } catch {
      if (activeRequest === requestId.current) {
        setContent({
          status: 'error',
          message: 'Não foi possível carregar os dados meteorológicos.',
        });
      }
    }
  }

  function handleRetry() {
    if (lastSearch) void searchMockCity(lastSearch);
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <a
        href="#main-content"
        className="sr-only rounded-sm bg-night-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        Pular para o conteúdo
      </a>
      <header className="border-b border-white/10 bg-night-900/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            >
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-lg border border-accent-400/30 bg-accent-500/15 text-sm font-bold text-accent-400"
              >
                WX
              </span>
              <span className="text-xl font-semibold tracking-normal text-white">Weather</span>
            </a>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
              DEMO
            </span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar
              onSearch={(city) => void searchMockCity(city)}
              disabled={content.status === 'loading'}
            />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      {(content.status === 'empty' || content.status === 'success') && (
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {content.status === 'empty'
            ? 'Nenhuma cidade encontrada. Confira o nome e tente buscar novamente.'
            : `Clima carregado para ${content.data.city.name}.`}
        </p>
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        {content.status === 'idle' && (
          <section className="rounded-lg border border-white/10 bg-white/5 px-6 py-12 text-center shadow-glass backdrop-blur-md sm:py-16">
            <p className="text-sm font-medium uppercase text-accent-400">Weather</p>
            <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Consulte o clima da sua cidade
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Busque Lisboa para ver os dados de demonstração.
            </p>
          </section>
        )}

        {content.status === 'loading' && <LoadingState />}

        {content.status === 'empty' && (
          <EmptyState
            title="Nenhuma cidade encontrada"
            hint="Confira o nome e tente buscar novamente."
          />
        )}

        {content.status === 'error' && (
          <ErrorState message={content.message} onRetry={handleRetry} />
        )}

        {content.status === 'success' && (
          <div className="space-y-8">
            <CurrentWeather city={content.data.city} current={content.data.current} unit={unit} />
            <section aria-labelledby="forecast-heading" className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <h2 id="forecast-heading" className="text-xl font-semibold text-white sm:text-2xl">
                  Próximos dias
                </h2>
                <p className="text-xs text-white/50">Dados de demonstração</p>
              </div>
              <ForecastList days={content.data.days} unit={unit} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

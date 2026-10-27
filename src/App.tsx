import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, error, search, retry } = useWeather();

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
              OPEN-METEO
            </span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <SearchBar onSearch={(name) => void search(name)} disabled={status === 'loading'} />
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
        </div>
      </header>

      {(status === 'empty' || (status === 'success' && data !== null)) && (
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {status === 'empty'
            ? 'Nenhuma cidade encontrada. Confira o nome e tente buscar novamente.'
            : `Clima carregado para ${data?.city.name}.`}
        </p>
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        {status === 'idle' && (
          <section className="rounded-lg border border-white/10 bg-white/5 px-6 py-12 text-center shadow-glass backdrop-blur-md sm:py-16">
            <p className="text-sm font-medium uppercase text-accent-400">Weather</p>
            <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Consulte o clima da sua cidade
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Busque uma cidade para consultar o clima e a previsão.
            </p>
          </section>
        )}

        {status === 'loading' && <LoadingState />}

        {status === 'empty' && (
          <EmptyState
            title="Nenhuma cidade encontrada"
            hint="Confira o nome e tente buscar novamente."
          />
        )}

        {status === 'error' && (
          <ErrorState
            message={error ?? 'Não foi possível carregar os dados meteorológicos.'}
            onRetry={() => void retry()}
          />
        )}

        {status === 'success' && data && (
          <div className="space-y-8">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <section aria-labelledby="forecast-heading" className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <h2 id="forecast-heading" className="text-xl font-semibold text-white sm:text-2xl">
                  Próximos dias
                </h2>
                <p className="text-xs text-white/50">Dados de demonstração</p>
              </div>
              <ForecastList days={data.days} unit={unit} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

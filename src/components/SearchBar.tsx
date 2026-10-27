import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (disabled || trimmedCity.length === 0) return;

    onSearch(trimmedCity);
  }

  return (
    <form
      role="search"
      aria-label="Busca de cidades"
      onSubmit={handleSubmit}
      className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 shadow-glass backdrop-blur-md transition focus-within:border-accent-400/60 focus-within:ring-2 focus-within:ring-accent-500/30 sm:flex-1"
    >
      <label htmlFor={inputId} className="sr-only">
        Cidade
      </label>
      <input
        id={inputId}
        name="city"
        type="search"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Digite uma cidade"
        disabled={disabled}
        className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="shrink-0 rounded-md bg-accent-400 px-4 py-2 text-sm font-medium text-night-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  );
}

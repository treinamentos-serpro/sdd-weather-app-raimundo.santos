interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="flex flex-col items-start gap-4 rounded-lg border border-rose-300/20 bg-rose-400/5 p-5 text-white shadow-glass backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-white/90">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
      >
        Tentar novamente
      </button>
    </section>
  );
}

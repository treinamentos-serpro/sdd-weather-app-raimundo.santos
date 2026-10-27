const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  timeZone: 'UTC',
});

export function formatDayLabel(localDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);
  if (!match) return 'Data indisponível';

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return 'Data indisponível';
  }

  const weekday = weekdayFormatter.format(date);
  const capitalizedWeekday = `${weekday.charAt(0).toLocaleUpperCase('pt-BR')}${weekday.slice(1)}`;

  return `${capitalizedWeekday}, ${dayText}/${monthText}`;
}

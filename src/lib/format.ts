const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  timeZone: 'UTC',
});
const shortWeekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  timeZone: 'UTC',
});

interface ParsedLocalDate {
  date: Date;
  dayText: string;
  monthText: string;
}

function parseLocalDate(localDate: string): ParsedLocalDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);
  if (!match) return null;

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
    return null;
  }

  return { date, dayText, monthText };
}

export function formatDayLabel(localDate: string, index?: number): string {
  const parsedDate = parseLocalDate(localDate);
  if (!parsedDate) return 'Data indisponível';
  if (index === 0) return 'Hoje';
  if (index === 1) return 'Amanhã';

  if (index !== undefined) {
    const shortWeekday = shortWeekdayFormatter.format(parsedDate.date);
    return `${shortWeekday.charAt(0).toLocaleUpperCase('pt-BR')}${shortWeekday.slice(1)}`;
  }

  const weekday = weekdayFormatter.format(parsedDate.date);
  const capitalizedWeekday = `${weekday.charAt(0).toLocaleUpperCase('pt-BR')}${weekday.slice(1)}`;

  return `${capitalizedWeekday}, ${getShortDate(localDate)}`;
}

export function getShortDate(localDate: string): string {
  const parsedDate = parseLocalDate(localDate);
  if (!parsedDate) return 'Data indisponível';

  return `${parsedDate.dayText}/${parsedDate.monthText}`;
}

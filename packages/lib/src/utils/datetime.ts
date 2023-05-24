import { DateTime, Settings } from 'luxon';
import { getWeekStartByLocale } from 'weekstart';

export function datetimeFromISO(string: string): DateTime | null {
  const datetime = DateTime.fromISO(string).toUTC();

  return datetime.isValid ? datetime : null;
}

export const startOfDay = (datetime: DateTime): DateTime => (datetime.startOf('day'));

export function monthDayIsDisabled(
  minDate: DateTime | null,
  maxDate: DateTime | null,
  year: number,
  month: number,
  day: number,
): boolean {
  const date = DateTime.fromObject({ year, month, day }, { zone: 'UTC' });

  const newMinDate = minDate ? startOfDay(minDate.setZone('UTC', { keepLocalTime: true })) : null;
  const newMaxDate = maxDate ? startOfDay(maxDate.setZone('UTC', { keepLocalTime: true })) : null;

  return !!((newMinDate && date <= newMinDate) || (newMaxDate && date >= newMaxDate));
}

export function monthDays(year: number, month: number, weekStart: number): (null | number)[] {
  const monthDate = DateTime.local(year, month, 1);
  let firstDay = monthDate.weekday - weekStart;
  const daysInMonth = monthDate.daysInMonth ?? 0;

  if (firstDay < 0) {
    firstDay += 7;
  }
  let lastDay = (weekStart - monthDate.weekday - daysInMonth) % 7;
  if (lastDay < 0) {
    lastDay += 7;
  }

  return [...Array(daysInMonth + firstDay + lastDay)]
    .map(
      (value, index) => ((index + 1 <= firstDay || index >= firstDay + daysInMonth) ?
        null : (index + 1 - firstDay)),
    ) ?? [];
}

export function monthIsDisabled(minDate: DateTime, maxDate: DateTime, year: number, month: number): boolean {
  return (minDate && minDate > DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth ?? 0)) ||
    (maxDate && maxDate < DateTime.utc(year, month, 1));
}

export function yearIsDisabled(minDate: DateTime, maxDate: DateTime, year: number): boolean {
  const minYear = minDate ? minDate.year : null;
  const maxYear = maxDate ? maxDate.year : null;

  return (!!minYear && year < minYear) ||
    (!!maxYear && year > maxYear);
}

export function timeComponentIsDisabled(min: number | null, max: number | null, component: number): boolean {
  return (min !== null && component < min) ||
    (max !== null && component > max);
}

export function calculateWeekStart() {
  const firstDay = getWeekStartByLocale(Settings.defaultLocale);

  return firstDay === 0 ? 7 : firstDay;
}

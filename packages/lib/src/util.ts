import { DateTime, Info, Settings } from 'luxon';
import { getWeekStartByLocale } from 'weekstart';

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function datetimeFromISO(string: string): DateTime | null {
  const datetime = DateTime.fromISO(string).toUTC();

  return datetime.isValid ? datetime : null;
}

export function startOfDay(datetime: DateTime): DateTime {
  return datetime.startOf('day');
}

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

export function weekdaysGenerator(weekStart: number): string[] {
  let localWeekStart = weekStart;
  if (--localWeekStart < 0) {
    localWeekStart = 6;
  }
  // weekStart = (weekStart - 1) % 7;

  let weekDays = Info.weekdays('short').map((weekday) => capitalize(weekday));

  weekDays = weekDays.concat(weekDays.splice(0, localWeekStart));

  return weekDays;
}

export function monthsGenerator(): string[] {
  return [...Info.months().map((month: string) => capitalize(month))];
}

export function hoursGenerator(step: number): number[] {
  return [...Array(Math.ceil(24 / step))].map((item, index) => index * step);
}

export function minutesGenerator(step: number): number[] {
  return [...Array(Math.ceil(60 / step))].map((item, index) => index * step);
}

export function yearsGenerator(current: number): number[] {
  return [...Array(201)].map((item, index) => current - 100 + index);
}

export function pad(number: number): string {
  return String(number).padStart(2, '0');
}

export function calculateWeekStart() {
  const firstDay = getWeekStartByLocale(Settings.defaultLocale);

  return firstDay === 0 ? 7 : firstDay;
}

export interface TimeElement {
  number: number | undefined,
  label?: string,
  selected: boolean,
  disabled: boolean
}

export interface ListElement extends Element {
  offsetTop: number
}

export interface Actions {
  cancel?: string,
  ok?: string,
}

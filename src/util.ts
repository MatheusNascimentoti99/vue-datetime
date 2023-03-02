import { DateTime, Info, Settings } from 'luxon';

import FlowManager from './FlowManager';

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
  const date = DateTime.fromObject({ year, month, day, zone: 'UTC' });

  const newMinDate = minDate ? startOfDay(minDate.setZone('UTC', { keepLocalTime: true })) : null;
  const newMaxDate = maxDate ? startOfDay(maxDate.setZone('UTC', { keepLocalTime: true })) : null;

  return !!((newMinDate && date < newMinDate) || (newMaxDate && date > newMaxDate));
}

export function monthDays(year: number, month: number, weekStart: number): (null | number)[] {
  const monthDate = DateTime.local(year, month, 1);
  let firstDay = monthDate.weekday - weekStart;

  if (firstDay < 0) {
    firstDay += 7;
  }
  let lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7;
  if (lastDay < 0) {
    lastDay += 7;
  }

  return [...Array(monthDate.daysInMonth + firstDay + lastDay)]
    .map(
      (value, index) => ((index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ?
        null : (index + 1 - firstDay)),
    ) ?? [];
}

export function monthIsDisabled(minDate, maxDate, year, month) {
  return (minDate && minDate > DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth)) ||
         (maxDate && maxDate < DateTime.utc(year, month, 1));
}

export function yearIsDisabled(minDate, maxDate, year) {
  const minYear = minDate ? minDate.year : null;
  const maxYear = maxDate ? maxDate.year : null;

  return (minYear && year < minYear) ||
         (maxYear && year > maxYear);
}

export function timeComponentIsDisabled(min, max, component) {
  return (min !== null && component < min) ||
         (max !== null && component > max);
}

export function weekdaysGenerator(weekStart) {
  if (--weekStart < 0) {
    weekStart = 6;
  }
  // weekStart = (weekStart - 1) % 7;

  let weekDays = Info.weekdays('short').map((weekday) => capitalize(weekday));

  weekDays = weekDays.concat(weekDays.splice(0, weekStart));

  return weekDays;
}

export function monthsGenerator(): string[] {
  return [...Info.months().map((month: string) => capitalize(month))];
}

export function hoursGenerator(step: number): number[] {
  return [...Array(Math.ceil(24 / step))].map((item, index) => index * step);
}

export function minutesGenerator(step: number) {
  return [...Array(Math.ceil(60 / step))].map((item, index) => index * step);
}

export function years(current) {
  return Array.apply(null, Array(201)).map((item, index) => current - 100 + index);
}

export function pad(number: number): number | string {
  return number < 10 ? `0${number}` : number;
}

export function createFlowManager(flow) {
  return new FlowManager(flow, 'end');
}

export function createFlowManagerFromType(type) {
  let flow = [];

  switch (type) {
  case 'datetime':
    flow = ['date', 'time'];
    break;
  case 'time':
    flow = ['time'];
    break;
  default:
    flow = ['date'];
  }

  return new FlowManager(flow, 'end');
}

export function weekStart() {
  let weekstart;

  try {
    weekstart = require('weekstart/package.json').version ? require('weekstart') : null;
  } catch (e) {
    weekstart = window.weekstart;
  }

  const firstDay = weekstart ? weekstart.getWeekStartByLocale(Settings.defaultLocale) : 1;

  return firstDay === 0 ? 7 : firstDay;
}

export interface TimeElement {
  number: number | string | null,
  selected: boolean,
  disabled: boolean
}

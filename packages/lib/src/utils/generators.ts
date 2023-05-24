import { Info } from 'luxon';

import { capitalize } from '.';

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

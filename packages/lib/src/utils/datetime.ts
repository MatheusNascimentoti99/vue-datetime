import { DateTime, Settings, WeekdayNumbers } from 'luxon';
import { getWeekStartByLocale } from 'weekstart';

export function datetimeFromISO(string: string): DateTime | null {
  const datetime = DateTime.fromISO(string).toUTC();

  return datetime.isValid ? datetime : null;
}

export const startOfDay = (datetime: DateTime | undefined): DateTime | undefined => (datetime?.startOf('day'));

export function validDatetimeRange(minDate: DateTime | undefined, maxDate: DateTime | undefined): boolean {
  // Valid range is whatever either date is null or when minDate is lesser then maxDate
  return !minDate || !maxDate || minDate <= maxDate;
}

export function yearIsDisabled(minDate: DateTime | undefined, maxDate: DateTime | undefined, year: number): boolean {
  const minYear = minDate?.year;
  const maxYear = maxDate?.year;

  return !validDatetimeRange(minDate, maxDate) || (!!minYear && year < minYear) || (!!maxYear && year > maxYear);
}

export function monthIsDisabled(
  minDate: DateTime | undefined,
  maxDate: DateTime | undefined,
  year: number,
  month: number,
): boolean {
  const minMonth = minDate?.month;
  const maxMonth = maxDate?.month;

  return yearIsDisabled(minDate, maxDate, year) || (!!minMonth && month < minMonth) || (!!maxMonth && month > maxMonth);
}

export function dateIsDisabled(
  minDate: DateTime | undefined,
  maxDate: DateTime | undefined,
  year: number,
  month: number,
  day: number,
): boolean {
  const minDay = minDate?.day;
  const maxDay = maxDate?.day;

  return monthIsDisabled(minDate, maxDate, year, month) || (!!minDay && day < minDay) || (!!maxDay && day > maxDay);
}

export function timeComponentIsDisabled(min: number | null, max: number | null, component: number): boolean {
  return (!!min && component < min) || (!!max && component > max);
}

export function monthDays(year: number, month: number, weekStart: WeekdayNumbers): (null | number)[] {
  const monthDate = DateTime.local(year, month, 1);
  if (!monthDate.isValid) {
    return [null];
  }
  const calendarRows = 6;
  const calendarSize = 7 * (calendarRows - 1);

  const daysInFirstRow = (7 - monthDate.weekday + weekStart) % 7;
  const paddingFront = (7 - daysInFirstRow) % 7;
  const daysInMonth = monthDate.daysInMonth ?? 31;
  const paddingBack = calendarSize - (daysInMonth - daysInFirstRow - (daysInFirstRow ? 0 : 7));

  return [...Array(daysInMonth + paddingFront + paddingBack)]
    .map(
      (value, index) => ((index + 1 <= paddingFront || index >= paddingFront + daysInMonth) ?
        null : (index + 1 - paddingFront)),
    );
}

export function calculateWeekStart(): WeekdayNumbers {
  const firstDay = getWeekStartByLocale(Settings.defaultLocale);

  return firstDay || 7;
}

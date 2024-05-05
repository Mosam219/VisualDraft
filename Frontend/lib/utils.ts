import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

dayjs.extend(utc);
dayjs.extend(timezone);

export function unixToStringFormat(unix: number | undefined) {
  const format = 'DD-MM-YYYY';
  return typeof unix === 'number'
    ? dayjs
        .unix(unix / 1000)
        .tz('Asia/Kolkata')
        .format(format)
    : '-';
}

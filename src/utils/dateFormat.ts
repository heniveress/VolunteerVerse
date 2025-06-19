/* eslint-disable @typescript-eslint/unbound-method */
export function formatDateTime(dateTime: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Bucharest',
  };
  return dateTime.toLocaleString('ro-RO', options);
}

const minuteSeconds = 60;
const hourSeconds = minuteSeconds * 60;
const daySeconds = hourSeconds * 24;
const monthSeconds = daySeconds * 30;
const yearSeconds = daySeconds * 365;

export function formatter(date: Date, now: Date) {
  const d = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (d < minuteSeconds * 2) {
    return {
      value: 'just now',
      next: minuteSeconds * 2 - d,
    };
  }
  if (d < hourSeconds) {
    const minutes = Math.floor(d / minuteSeconds);
    return {
      value: `${minutes} minutes ago`,
      next: minuteSeconds - (d % 60),
    };
  }
  if (d < daySeconds) {
    const hours = Math.floor(d / hourSeconds);
    return {
      value: `${hours} hour${hours > 1 ? 's' : ''} ago`,
      next: hourSeconds - (d % hourSeconds),
    };
  }
  if (d < monthSeconds) {
    const days = Math.floor(d / daySeconds);
    return {
      value: `${days} day${days > 1 ? 's' : ''} ago`,
      next: daySeconds - (d % daySeconds),
    };
  }
  if (d < yearSeconds) {
    const months = Math.floor(d / monthSeconds);
    return {
      value: `${months} month${months > 1 ? 's' : ''} ago`,
      next: monthSeconds - (d % monthSeconds),
    };
  }
  const years = Math.floor(d / yearSeconds);
  return {
    value: `${years} year${years > 1 ? 's' : ''} ago`,
    next: yearSeconds - (d % yearSeconds),
  };
}

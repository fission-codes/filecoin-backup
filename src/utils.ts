import { browser } from '$app/env';

export function ellipse(str: string): string {
  let ellipsedString = '';

  if (browser) {
    if (window.innerWidth < 672) {
      const leading = str.slice(0, 6);
      const trailing = str.slice(-4);
      ellipsedString = leading + '...' + trailing;
    } else if (window.innerWidth < 1056) {
      const leading = str.slice(0, 10);
      const trailing = str.slice(-6);
      ellipsedString = leading + '...' + trailing;
    } else if (str.length > 62) {
      const leading = str.slice(0, 42);
      const trailing = str.slice(-18);
      ellipsedString = leading + '...' + trailing;
    } else {
      return str;
    }
  }
  return ellipsedString;
}

export function formatDate(timestamp: number): string {
  const date: Date = new Date(+timestamp);
  const lang: string = navigator.language;
  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short'
  };

  const formattedDate: string = new Intl.DateTimeFormat(
    lang,
    formatOptions
  ).format(date);
  return formattedDate;
}
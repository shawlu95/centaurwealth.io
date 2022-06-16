import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getTransactionDate(days) {
  return addDays("2022-01-01", days + 1);
}

export function getDaysDiff(date) {
  const ref = new Date('1/1/2022');
  const diffTime = date - ref;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function toTransactionDate() {
  const ref = new Date('1/1/2022');
  const diffTime = new Date() - ref;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
const monthStart = (date = new Date()): Date => {
  return new Date(date.setDate(1));
};

const nextMonth = (date = new Date()): Date => {
  // if november, next month will roll over into next year
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};

const quarterStart = (date = new Date()): Date => {
  const quarter = Math.floor(date.getMonth() / 3 + 1);
  return new Date(date.setFullYear(date.getFullYear(), (quarter - 1) * 3, 1));
};

const nextQuarter = (date = new Date()): Date => {
  const quarter = Math.floor(date.getMonth() / 3 + 1);
  return new Date(date.setFullYear(date.getFullYear(), quarter * 3, 1));
};

const halfYearStart = (date = new Date()): Date => {
  const month = date.getMonth() <= 5 ? 0 : 6;
  return new Date(date.setFullYear(date.getFullYear(), month, 1));
};

const nextHalfYear = (date = new Date()): Date => {
  const month = date.getMonth() <= 5 ? 6 : 12;
  return new Date(date.setFullYear(date.getFullYear(), month, 1));
};

const yearStart = (date = new Date()): Date => {
  return new Date(date.setFullYear(date.getFullYear(), 0, 1));
};

const nextYear = (date = new Date()): Date => {
  return new Date(date.setFullYear(date.getFullYear() + 1, 0, 1));
};

export default {
  monthStart,
  nextMonth,
  quarterStart,
  nextQuarter,
  halfYearStart,
  nextHalfYear,
  yearStart,
  nextYear,
};

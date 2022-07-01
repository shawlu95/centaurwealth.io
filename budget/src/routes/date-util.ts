const monthStart = (now = new Date()): Date => {
  const date = new Date(now.setDate(1));
  return new Date(date.setHours(0, 0, 0, 0));
};

const nextMonth = (now = new Date()): Date => {
  // if november, next month will roll over into next year
  const date = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return new Date(date.setHours(0, 0, 0, 0));
};

const quarterStart = (now = new Date()): Date => {
  const quarter = Math.floor(now.getMonth() / 3 + 1);
  const date = new Date(
    now.setFullYear(now.getFullYear(), (quarter - 1) * 3, 1)
  );
  return new Date(date.setHours(0, 0, 0, 0));
};

const nextQuarter = (now = new Date()): Date => {
  const quarter = Math.floor(now.getMonth() / 3 + 1);
  const date = new Date(now.setFullYear(now.getFullYear(), quarter * 3, 1));
  return new Date(date.setHours(0, 0, 0, 0));
};

const yearStart = (now = new Date()): Date => {
  const date = new Date(now.setFullYear(now.getFullYear(), 0, 1));
  return new Date(date.setHours(0, 0, 0, 0));
};

const nextYear = (now = new Date()): Date => {
  const date = new Date(now.setFullYear(now.getFullYear() + 1, 0, 1));
  return new Date(date.setHours(0, 0, 0, 0));
};

export default {
  monthStart,
  nextMonth,
  quarterStart,
  nextQuarter,
  yearStart,
  nextYear,
};

import { EntryType, Entry } from '@bookkeeping/common';

const EXPENSE = 'Expense';

export const accumulateExpense = (entries: Entry[]) => {
  const expenseEntries = entries.filter((x) => x.accountName === EXPENSE);

  var expenseAmount = 0;
  for (var i in expenseEntries) {
    if (expenseEntries[i].type === EntryType.Debit) {
      expenseAmount += expenseEntries[i].amount;
    } else if (expenseEntries[i].type === EntryType.Credit) {
      expenseAmount -= expenseEntries[i].amount;
    }
  }
  return expenseAmount;
};

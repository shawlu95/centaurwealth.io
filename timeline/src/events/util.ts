import { Entry, AccountType, EntryType } from '@bookkeeping/common';

export const getDelta = (type: AccountType, entries: Entry[]) => {
  var sign = 0;
  if (type == AccountType.Asset) sign = 1;
  if (type == AccountType.Liability) sign = -1;
  var delta = 0;

  for (var i in entries) {
    const entry = entries[i];
    if (entry.accountType == type) {
      if (entry.type == EntryType.Debit) {
        delta += sign * entry.amount;
      } else if (entry.type == EntryType.Credit) {
        delta -= sign * entry.amount;
      }
    }
  }
  return delta;
};

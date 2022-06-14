import mongoose from 'mongoose';
import { Account, AccountType } from '../../../models/account';
import { Transaction } from '../../../models/transaction';
import { EntryType } from '@bookkeeping/common';

export const buildAccountPair = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cash = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'cash',
    type: AccountType.Asset,
  });
  await cash.save();

  const expense = Account.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    name: 'expense',
    type: AccountType.Asset,
  });
  await expense.save();

  return { userId, cash, expense };
};

export const buildTransaction = async () => {
  const { userId, cash, expense } = await buildAccountPair();
  const transaction = Transaction.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    memo: 'beer',
    entries: [
      {
        amount: 10,
        type: EntryType.Credit,
        accountId: cash.id,
        accountName: cash.name,
        accountType: cash.type,
      },
      {
        amount: 10,
        type: EntryType.Debit,
        accountId: expense.id,
        accountName: expense.name,
        accountType: expense.type,
      },
    ],
  });
  await transaction.save();

  cash.set({ credit: 10 });
  await cash.save();

  expense.set({ debit: 10 });
  await expense.save();

  return { userId, cash, expense, transaction };
};
